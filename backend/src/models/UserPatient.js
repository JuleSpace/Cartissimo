const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UserPatient extends Model {
    static associate(models) {
      // Les associations sont définies dans les modèles principaux
    }
  }

  UserPatient.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'patient_id',
      references: {
        model: 'Patients',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'UserPatient',
    tableName: 'user_patients',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'patient_id'],
        name: 'unique_user_patient'
      }
    ]
  });

  return UserPatient;
}; 