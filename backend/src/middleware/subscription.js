const { User, Patient } = require('../models');

const checkSubscription = async (req, res, next) => {
  try {
    const user = req.user;
    console.log('=== Vérification abonnement ===');
    console.log('User:', user.email, 'Role:', user.role);
    console.log('subscriptionRequired:', user.subscriptionRequired);
    
    // Vérifier si l'abonnement est requis pour cet utilisateur
    if (!user.subscriptionRequired) {
      // Pas d'abonnement requis (admin, orthophoniste)
      console.log('Abonnement non requis, accès autorisé');
      return next();
    }

    // Pour les parents, vérifier l'abonnement via leurs patients
    const patients = await Patient.findAll({
      where: { userId: user.id }
    });

    console.log('Patients trouvés:', patients.length);
    if (patients.length > 0) {
      console.log('Premier patient:', {
        id: patients[0].id,
        subscriptionStatus: patients[0].subscriptionStatus,
        subscriptionEndDate: patients[0].subscriptionEndDate
      });
    }

    if (patients.length === 0) {
      console.log('Aucun patient trouvé, accès refusé');
      return res.status(403).json({
        error: 'subscription_required',
        message: 'Aucun patient trouvé pour cet utilisateur'
      });
    }

    // Vérifier si au moins un patient a un abonnement actif
    const hasActiveSubscription = patients.some(patient => 
      patient.subscriptionStatus === 'active' && 
      patient.subscriptionEndDate && 
      new Date(patient.subscriptionEndDate) > new Date()
    );

    console.log('Abonnement actif:', hasActiveSubscription);

    if (!hasActiveSubscription) {
      console.log('Abonnement inactif, accès refusé');
      return res.status(403).json({
        error: 'subscription_required',
        message: 'Abonnement requis pour accéder à cette ressource',
        subscriptionStatus: patients[0]?.subscriptionStatus || 'inactive'
      });
    }

    next();
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'abonnement:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = checkSubscription; 