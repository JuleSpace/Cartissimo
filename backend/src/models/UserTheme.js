const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UserTheme extends Model {
    static associate(models) {
      UserTheme.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      UserTheme.belongsTo(models.Theme, {
        foreignKey: 'themeId',
        as: 'theme'
      });
    }
  }

  UserTheme.init({
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    themeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Themes',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'UserTheme',
    tableName: 'UserThemes',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'themeId']
      }
    ],
    timestamps: true
  });

  return UserTheme;
}; 