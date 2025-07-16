const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ajouter le champ order à la table Themes
    await queryInterface.addColumn('Themes', 'order', {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Supprimer le champ order de la table Themes
    await queryInterface.removeColumn('Themes', 'order');
  }
}; 