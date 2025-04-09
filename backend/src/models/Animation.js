const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Animation extends Model {
    static associate(models) {
      Animation.belongsTo(models.Theme, { foreignKey: 'themeId' });
      Animation.belongsTo(models.User, { foreignKey: 'createdBy' });
    }
  }

  Animation.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    animatedGifPath: {
      type: DataTypes.STRING,
      allowNull: false
    },
    realGifPath: {
      type: DataTypes.STRING,
      allowNull: false
    },
    soundPath: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    themeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Animation',
    tableName: 'Animations',
    indexes: [
      {
        fields: ['themeId']
      },
      {
        fields: ['createdBy']
      }
    ]
  });

  return Animation;
}; 