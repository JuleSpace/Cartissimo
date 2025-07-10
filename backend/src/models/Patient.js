const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Patient extends Model {
    static associate(models) {
      Patient.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'parent'
      });
      Patient.belongsTo(models.Orthophoniste, {
        foreignKey: 'orthophonisteId',
        as: 'orthophoniste'
      });
      
      Patient.belongsToMany(models.User, {
        through: 'PatientTherapists',
        foreignKey: 'patientId',
        otherKey: 'therapistId',
        as: 'therapists'
      });
    }
  }

  Patient.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    parentEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    subscriptionStatus: {
      type: DataTypes.ENUM('active', 'inactive', 'expired', 'payment_failed'),
      defaultValue: 'inactive'
    },
    subscriptionEndDate: {
      type: DataTypes.DATEONLY
    },
    stripeSubscriptionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    orthophonisteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'orthophoniste_id',
      references: {
        model: 'Orthophonistes',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Patient',
    tableName: 'patients',
    timestamps: true,
    underscored: true
  });

  return Patient;
}; 