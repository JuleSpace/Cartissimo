const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ajouter le champ stripeSubscriptionId à la table patients
    await queryInterface.addColumn('patients', 'stripe_subscription_id', {
      type: DataTypes.STRING,
      allowNull: true
    });

    // Modifier l'ENUM subscriptionStatus pour inclure 'payment_failed'
    await queryInterface.changeColumn('patients', 'subscription_status', {
      type: DataTypes.ENUM('active', 'inactive', 'expired', 'payment_failed'),
      defaultValue: 'inactive'
    });

    // Mettre à jour subscriptionRequired pour les rôles admin et orthophonist
    await queryInterface.bulkUpdate('users', 
      { subscriptionRequired: false }, 
      { role: ['admin', 'orthophonist'] }
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Supprimer le champ stripeSubscriptionId
    await queryInterface.removeColumn('patients', 'stripe_subscription_id');

    // Restaurer l'ancien ENUM
    await queryInterface.changeColumn('patients', 'subscription_status', {
      type: DataTypes.ENUM('active', 'inactive', 'expired'),
      defaultValue: 'active'
    });

    // Restaurer subscriptionRequired à true pour tous les utilisateurs
    await queryInterface.bulkUpdate('users', 
      { subscriptionRequired: true }, 
      {}
    );
  }
}; 