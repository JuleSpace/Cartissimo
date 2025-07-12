module.exports = (sequelize, DataTypes) => {
  const ThemeCompletion = sequelize.define('ThemeCompletion', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    themeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

  }, {
    tableName: 'ThemeCompletions',
    timestamps: true, // Sequelize les gère automatiquement
  });

  ThemeCompletion.associate = (models) => {
    ThemeCompletion.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    ThemeCompletion.belongsTo(models.Theme, {
      foreignKey: 'themeId',
      onDelete: 'CASCADE'
    });
  };

  return ThemeCompletion;
};
