const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Theme extends Model {
    static associate(models) {
      Theme.belongsToMany(models.User, { 
        through: 'UserThemes',
        foreignKey: 'themeId',
        otherKey: 'userId'
      });
      Theme.hasMany(models.UserTheme, {
        foreignKey: 'themeId',
        as: 'userThemes'
      });
      Theme.hasMany(models.Animation, { 
        foreignKey: 'themeId',
        as: 'animations'
      });
      Theme.belongsTo(models.User, { 
        foreignKey: 'createdBy',
        as: 'creator'
      });
    }
  }

  Theme.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Theme'
  });

  return Theme;
}; 