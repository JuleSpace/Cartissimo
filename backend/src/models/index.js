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
const ThemeCompletion = require('./ThemeCompletion')(sequelize, DataTypes); // ← ajout ici

// Définition des associations
User.associate({ User, Patient, Theme, Animation, UserTheme, patient_therapists, Orthophoniste, ThemeCompletion });
Patient.associate({ User, Patient, Theme, Animation, UserTheme, patient_therapists, Orthophoniste, ThemeCompletion });
Theme.associate({ User, Patient, Theme, Animation, UserTheme, patient_therapists, Orthophoniste, ThemeCompletion });
Animation.associate({ User, Patient, Theme, Animation, UserTheme, patient_therapists, Orthophoniste, ThemeCompletion });
UserTheme.associate({ User, Patient, Theme, Animation, UserTheme, patient_therapists, Orthophoniste, ThemeCompletion });
Orthophoniste.associate({ User, Patient, Theme, Animation, UserTheme, patient_therapists, Orthophoniste, ThemeCompletion });
ThemeCompletion.associate({ User, Patient, Theme, Animation, UserTheme, patient_therapists, Orthophoniste, ThemeCompletion });


// Si tu veux ajouter une association dans ThemeCompletion.js plus tard
// ThemeCompletion.associate({...})

module.exports = {
  sequelize,
  User,
  Patient,
  Theme,
  Animation,
  UserTheme,
  patient_therapists,
  Orthophoniste,
  ThemeCompletion // ← export ici
};
