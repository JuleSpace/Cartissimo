const sequelize = require('../config/database');

// Initialisation des modèles
const User = require('./User')(sequelize);
const Patient = require('./Patient')(sequelize);
const Theme = require('./Theme')(sequelize);
const Animation = require('./Animation')(sequelize);
const UserTheme = require('./UserTheme')(sequelize);
const patient_therapists = require('./PatientTherapist')(sequelize);

// Définition des associations
User.associate({ User, Patient, Theme, Animation, UserTheme, patient_therapists });
Patient.associate({ User, Patient, Theme, Animation, UserTheme, patient_therapists });
Theme.associate({ User, Patient, Theme, Animation, UserTheme, patient_therapists });
Animation.associate({ User, Patient, Theme, Animation, UserTheme, patient_therapists });
UserTheme.associate({ User, Patient, Theme, Animation, UserTheme, patient_therapists });

module.exports = {
  sequelize,
  User,
  Patient,
  Theme,
  Animation,
  UserTheme,
  patient_therapists
}; 