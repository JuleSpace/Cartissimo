const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class patient_therapists extends Model {
    static associate(models) {
      // Les associations sont définies dans les modèles principaux
    }
  }

  patient_therapists.init({
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'patient_id',
      references: {
        model: 'patients',
        key: 'id'
      }
    },
    therapistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'therapist_id',
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'patient_therapists',
    tableName: 'patient_therapists',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['patient_id', 'therapist_id'],
        name: 'unique_patient_therapist'
      }
    ]
  });

  return patient_therapists;
}; 