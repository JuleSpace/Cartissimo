const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Patient } = require('../models');

const paymentController = {
  // Créer une session de paiement
  createCheckoutSession: async (req, res) => {
    try {
      const { patientId } = req.body;

      const patient = await Patient.findByPk(patientId);
      if (!patient) {
        return res.status(404).json({ error: 'Patient non trouvé' });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Abonnement annuel',
              description: 'Accès à toutes les animations pour un an'
            },
            unit_amount: 5000, // 50.00 EUR
            recurring: {
              interval: 'year'
            }
          },
          quantity: 1
        }],
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        metadata: {
          patientId
        }
      });

      res.json({ sessionId: session.id });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la création de la session de paiement' });
    }
  },

  // Webhook pour les événements Stripe
  handleWebhook: async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Gérer l'événement
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const patientId = session.metadata.patientId;

        // Mettre à jour le statut de l'abonnement du patient
        await Patient.update({
          subscriptionStatus: 'active',
          subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 an
        }, {
          where: { id: patientId }
        });

        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const patientId = subscription.metadata.patientId;

        // Mettre à jour le statut de l'abonnement du patient
        await Patient.update({
          subscriptionStatus: 'expired'
        }, {
          where: { id: patientId }
        });

        break;
      }
    }

    res.json({ received: true });
  }
};

module.exports = paymentController; 