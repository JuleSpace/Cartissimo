const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Patient extends Model {
    static associate(models) {
      Patient.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'parent'
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
      type: DataTypes.ENUM('active', 'inactive', 'expired'),
      defaultValue: 'active'
    },
    subscriptionEndDate: {
      type: DataTypes.DATEONLY
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