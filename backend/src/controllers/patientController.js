const { Patient, User, patient_therapists } = require('../models');
const { Op, Sequelize } = require('sequelize');
const sequelize = require('sequelize');

const patientController = {
  getPatients: async (req, res) => {
    try {
      const therapistId = req.user.id;

      // Récupérer tous les patients liés à l'orthophoniste
      const patients = await Patient.findAll({
        include: [{
          model: User,
          as: 'parent',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }],
        where: {
          '$parent.id$': {
            [Op.in]: sequelize.literal(`(
              SELECT DISTINCT p.user_id 
              FROM patients p 
              INNER JOIN patient_therapists pt ON p.id = pt.patient_id 
              WHERE pt.therapist_id = ${therapistId}
            )`)
          }
        }
      });

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