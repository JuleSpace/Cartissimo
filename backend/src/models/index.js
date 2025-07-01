const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Initialisation des modèles
const User = require('./User')(sequelize, DataTypes);
const Patient = require('./Patient')(sequelize, DataTypes);
const Theme = require('./Theme')(sequelize, DataTypes);
const Animation = require('./Animation')(sequelize, DataTypes);
const UserTheme = require('./UserTheme')(sequelize, DataTypes);
const patient_therapists = require('./PatientTherapist')(sequelize, DataTypes);
const Orthophoniste = require('./Orthophoniste')(sequelize, DataTypes);

// Définition des associations
User.associate({ User, Patient, Theme, Animation, UserTheme, patient_therapists, Orthophoniste });
Patient.associate({ User, Patient, Theme, Animation, UserTheme, patient_therapists, Orthophoniste });
Theme.associate({ User, Patient, Theme, Animation, UserTheme, patient_therapists, Orthophoniste });
Animation.associate({ User, Patient, Theme, Animation, UserTheme, patient_therapists, Orthophoniste });
UserTheme.associate({ User, Patient, Theme, Animation, UserTheme, patient_therapists, Orthophoniste });
Orthophoniste.associate({ User, Patient, Theme, Animation, UserTheme, patient_therapists, Orthophoniste });

module.exports = {
  sequelize,
  User,
  Patient,
  Theme,
  Animation,
  UserTheme,
  patient_therapists,
  Orthophoniste
};