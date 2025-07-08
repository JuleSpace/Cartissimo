const { Patient, User, Orthophoniste, patient_therapists } = require('../models');
const { Op, Sequelize } = require('sequelize');
const sequelize = require('sequelize');

const patientController = {
  getPatients: async (req, res) => {
    try {
      const userEmail = req.user.email;
      console.log('=== DEBUG getPatients ===');
      console.log('User connecté:', req.user);
      console.log('Email utilisateur:', userEmail);

      // Récupérer l'orthophoniste correspondant à cet email
      const orthophoniste = await Orthophoniste.findOne({
        where: { email: userEmail }
      });

      if (!orthophoniste) {
        console.log('Aucun orthophoniste trouvé pour cet email');
        return res.json([]);
      }

      console.log('Orthophoniste trouvé:', { id: orthophoniste.id, firstName: orthophoniste.firstName, lastName: orthophoniste.lastName });

      // Debug: voir tous les patients en base
      const allPatients = await Patient.findAll({
        attributes: ['id', 'firstName', 'lastName', 'orthophonisteId']
      });
      console.log('Tous les patients en base:', allPatients.map(p => ({ id: p.id, name: p.firstName + ' ' + p.lastName, orthophonisteId: p.orthophonisteId })));

      // Récupérer tous les patients liés à cet orthophoniste
      const patients = await Patient.findAll({
        where: {
          orthophonisteId: orthophoniste.id
        },
        include: [{
          model: User,
          as: 'parent',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }]
      });

      console.log('Nombre de patients trouvés:', patients.length);
      console.log('Patients:', patients.map(p => ({ id: p.id, name: p.firstName + ' ' + p.lastName, orthophonisteId: p.orthophonisteId })));
      console.log('=== FIN DEBUG ===');

      res.json(patients);
    } catch (error) {
      console.error('Erreur lors de la récupération des patients:', error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des patients",
        error: error.message
      });
    }
  }
};

module.exports = patientController; 