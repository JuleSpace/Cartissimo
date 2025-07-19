const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Patient, User } = require('../models');

const paymentController = {
  // Créer une session de paiement
  createCheckoutSession: async (req, res) => {
    try {
      const userId = req.user.id;

      // Récupérer tous les patients de l'utilisateur
      const patients = await Patient.findAll({
        where: { userId: userId }
      });

      if (patients.length === 0) {
        return res.status(404).json({ error: 'Aucun patient trouvé pour cet utilisateur' });
      }

      // Construire l'URL frontend dynamiquement selon l'environnement
      let FRONTEND_URL;
      if (process.env.NODE_ENV === 'production') {
        // En production Railway, utiliser l'URL publique
        const baseUrl = req.get('host') ? `https://${req.get('host')}` : 'https://cartissimo.up.railway.app';
        FRONTEND_URL = baseUrl;
      } else {
        // En développement, utiliser localhost
        const IP = process.env.IP || 'localhost';
        FRONTEND_URL = `http://${IP}:8080`;
      }
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price: process.env.STRIPE_PRICE_ID, // Utilise l'ID du prix créé dans Stripe
          quantity: 1
        }],
        mode: 'subscription',
        success_url: `${FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${FRONTEND_URL}/payment/cancel`,
        metadata: {
          userId: userId,
          patientIds: patients.map(p => p.id).join(',')
        }
      });

      res.json({ sessionId: session.id });
    } catch (error) {
      console.error('Erreur lors de la création de la session de paiement:', error);
      res.status(500).json({ error: 'Erreur lors de la création de la session de paiement' });
    }
  },

  // Vérifier le statut de l'abonnement
  getSubscriptionStatus: async (req, res) => {
    try {
      console.log('=== getSubscriptionStatus appelé ===');
      console.log('User ID:', req.user.id);
      console.log('User:', req.user);
      const userId = req.user.id;
      const user = await User.findByPk(userId);

      if (!user.subscriptionRequired) {
        return res.json({ 
          subscriptionRequired: false,
          status: 'not_required'
        });
      }

      const patients = await Patient.findAll({
        where: { userId: userId }
      });

      if (patients.length === 0) {
        return res.json({
          subscriptionRequired: true,
          status: 'no_patients'
        });
      }

      const hasActiveSubscription = patients.some(patient => 
        patient.subscriptionStatus === 'active' && 
        patient.subscriptionEndDate && 
        new Date(patient.subscriptionEndDate) > new Date()
      );

      res.json({
        subscriptionRequired: true,
        status: hasActiveSubscription ? 'active' : patients[0].subscriptionStatus || 'inactive',
        subscriptionEndDate: patients[0].subscriptionEndDate,
        patients: patients.map(p => ({
          id: p.id,
          firstName: p.firstName,
          lastName: p.lastName,
          subscriptionStatus: p.subscriptionStatus,
          subscriptionEndDate: p.subscriptionEndDate
        }))
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du statut d\'abonnement:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // Méthode pour simuler l'activation d'abonnement (développement uniquement)
  simulateSubscriptionActivation: async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'Non autorisé en production' });
    }

    try {
      const userId = req.user.id;
      
      // Récupérer tous les patients de l'utilisateur
      const patients = await Patient.findAll({
        where: { userId: userId }
      });

      if (patients.length === 0) {
        return res.status(404).json({ error: 'Aucun patient trouvé' });
      }

      // Activer l'abonnement pour tous les patients
      await Patient.update({
        subscriptionStatus: 'active',
        subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
        stripeSubscriptionId: 'sub_simulation_' + Date.now()
      }, {
        where: { userId: userId }
      });

      res.json({ 
        message: 'Abonnement simulé avec succès',
        patients: patients.length 
      });
    } catch (error) {
      console.error('Erreur lors de la simulation:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // Webhook pour les événements Stripe
  handleWebhook: async (req, res) => {
    console.log('=== Webhook reçu ===');
    console.log('Body type:', typeof req.body);
    console.log('Body length:', req.body ? req.body.length : 'null');
    
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
      console.log('Event type:', event.type);
    } catch (err) {
      console.error('Webhook Error:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Gérer l'événement
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const patientIds = session.metadata.patientIds.split(',');

        // Mettre à jour le statut de l'abonnement pour tous les patients de l'utilisateur
        await Patient.update({
          subscriptionStatus: 'active',
          subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
          stripeSubscriptionId: session.subscription
        }, {
          where: { id: patientIds }
        });

        console.log(`Abonnement activé pour l'utilisateur ${userId} et patients ${patientIds.join(', ')}`);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        // Trouver les patients avec cet abonnement Stripe
        const patients = await Patient.findAll({
          where: { stripeSubscriptionId: subscription.id }
        });

        if (patients.length > 0) {
          await Patient.update({
            subscriptionStatus: 'expired'
          }, {
            where: { stripeSubscriptionId: subscription.id }
          });

          console.log(`Abonnement expiré pour ${patients.length} patients`);
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        
        // Trouver les patients avec cet abonnement Stripe
        const patients = await Patient.findAll({
          where: { stripeSubscriptionId: invoice.subscription }
        });

        if (patients.length > 0) {
          await Patient.update({
            subscriptionStatus: 'payment_failed'
          }, {
            where: { stripeSubscriptionId: invoice.subscription }
          });

          console.log(`Paiement échoué pour ${patients.length} patients`);
        }
        break;
      }
    }

    res.json({ received: true });
  }
};

module.exports = paymentController; 