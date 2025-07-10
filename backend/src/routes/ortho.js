const express = require('express');
const router = express.Router();
const { User, Patient, Orthophoniste } = require('../models');
const { auth, isAdmin } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Middleware pour vérifier que l'utilisateur est admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé. Seuls les administrateurs peuvent effectuer cette action.' });
  }
  next();
};

// GET /api/ortho - Récupérer tous les orthophonistes
router.get('/', auth, requireAdmin, async (req, res) => {
  try {
    console.log('Récupération des orthophonistes...');
    const orthophonistes = await Orthophoniste.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode', 'profilePictureUrl', 'doctolibUrl', 'createdAt'],
      include: [{
        model: Patient,
        as: 'patients',
        attributes: ['id', 'firstName', 'lastName', 'birthDate'],
        required: false // LEFT JOIN pour inclure même les orthophonistes sans patients
      }]
    });

    console.log('Orthophonistes trouvés:', orthophonistes.length);
    console.log('Premier orthophoniste:', orthophonistes[0] ? orthophonistes[0].toJSON() : 'Aucun');

    res.json(orthophonistes);
  } catch (error) {
    console.error('Erreur lors de la récupération des orthophonistes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /api/ortho - Créer un nouvel orthophoniste
router.post('/', auth, requireAdmin, async (req, res) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      address, 
      city, 
      postalCode, 
      profilePictureUrl, 
      doctolibUrl 
    } = req.body;

    // Vérifier si l'email existe déjà dans la table users
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
    }

    // Vérifier si l'email existe déjà dans la table orthophonistes
    const existingOrtho = await Orthophoniste.findOne({ where: { email } });
    if (existingOrtho) {
      return res.status(400).json({ message: 'Un orthophoniste avec cet email existe déjà' });
    }

    // Créer l'utilisateur dans la table users
    const user = await User.create({
      email,
      password, // Le hashage se fait automatiquement via le hook beforeCreate
      firstName,
      lastName,
      role: 'orthophonist',
      subscriptionRequired: false
    });

    // Créer l'orthophoniste dans la table orthophonistes
    const orthophoniste = await Orthophoniste.create({
      firstName,
      lastName,
      email,
      phone: phone || null,
      address: address || null,
      city: city || null,
      postalCode: postalCode || null,
      profilePictureUrl: profilePictureUrl || null,
      doctolibUrl: doctolibUrl || null
    });

    res.status(201).json(orthophoniste);
  } catch (error) {
    console.error('Erreur lors de la création de l\'orthophoniste:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/ortho/:id - Modifier un orthophoniste
router.put('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      email, 
      firstName, 
      lastName, 
      password, 
      phone, 
      address, 
      city, 
      postalCode, 
      profilePictureUrl, 
      doctolibUrl 
    } = req.body;

    // Trouver l'orthophoniste dans la table orthophonistes
    const orthophoniste = await Orthophoniste.findByPk(id);
    if (!orthophoniste) {
      return res.status(404).json({ message: 'Orthophoniste non trouvé' });
    }

    // Vérifier si l'email existe déjà dans les deux tables (sauf pour l'utilisateur actuel)
    if (email && email !== orthophoniste.email) {
      const existingUser = await User.findOne({ where: { email } });
      const existingOrtho = await Orthophoniste.findOne({ where: { email } });
      
      if (existingUser || existingOrtho) {
        return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
      }
    }

    // Mettre à jour dans la table orthophonistes
    const orthoUpdateData = {};
    if (email) orthoUpdateData.email = email;
    if (firstName) orthoUpdateData.firstName = firstName;
    if (lastName) orthoUpdateData.lastName = lastName;
    if (phone !== undefined) orthoUpdateData.phone = phone;
    if (address !== undefined) orthoUpdateData.address = address;
    if (city !== undefined) orthoUpdateData.city = city;
    if (postalCode !== undefined) orthoUpdateData.postalCode = postalCode;
    if (profilePictureUrl !== undefined) orthoUpdateData.profilePictureUrl = profilePictureUrl;
    if (doctolibUrl !== undefined) orthoUpdateData.doctolibUrl = doctolibUrl;

    await orthophoniste.update(orthoUpdateData);

    // Mettre à jour dans la table users si nécessaire
    const user = await User.findOne({ where: { email: orthophoniste.email } });
    if (user) {
      const userUpdateData = {};
      if (email) userUpdateData.email = email;
      if (firstName) userUpdateData.firstName = firstName;
      if (lastName) userUpdateData.lastName = lastName;
      if (password) userUpdateData.password = password; // Le hashage se fait automatiquement

      await user.update(userUpdateData);
    }

    // Retourner l'orthophoniste mis à jour
    const updatedOrthophoniste = await Orthophoniste.findByPk(id);
    res.json(updatedOrthophoniste);
  } catch (error) {
    console.error('Erreur lors de la modification de l\'orthophoniste:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// DELETE /api/ortho/:id - Supprimer un orthophoniste
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Trouver l'orthophoniste dans la table orthophonistes
    const orthophoniste = await Orthophoniste.findByPk(id);
    if (!orthophoniste) {
      return res.status(404).json({ message: 'Orthophoniste non trouvé' });
    }

    // Trouver l'utilisateur correspondant
    const user = await User.findOne({ where: { email: orthophoniste.email } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur correspondant non trouvé' });
    }

    console.log(`Début de suppression de l'orthophoniste ${id} (${orthophoniste.email})`);

    // 1. Détacher tous les patients de cet orthophoniste
    const patientsUpdated = await Patient.update(
      { orthophonisteId: null },
      { where: { orthophonisteId: id } }
    );
    console.log(`${patientsUpdated[0]} patients détachés de l'orthophoniste ${id}`);

    // 2. Gérer les thèmes créés par cet utilisateur
    // Les thèmes restent accessibles mais ne sont plus liés à un créateur spécifique
    const { Theme } = require('../models');
    const themesUpdated = await Theme.update(
      { createdBy: null },
      { where: { createdBy: user.id } }
    );
    console.log(`${themesUpdated[0]} thèmes détachés du créateur`);

    // 3. Gérer les animations créées par cet utilisateur
    // Les animations restent accessibles mais ne sont plus liées à un créateur spécifique
    const { Animation } = require('../models');
    const animationsUpdated = await Animation.update(
      { createdBy: null },
      { where: { createdBy: user.id } }
    );
    console.log(`${animationsUpdated[0]} animations détachées du créateur`);

    // 4. Supprimer les associations UserTheme
    const { UserTheme } = require('../models');
    const userThemesDeleted = await UserTheme.destroy({
      where: { userId: user.id }
    });
    console.log(`${userThemesDeleted} associations UserTheme supprimées`);

    // 5. Supprimer de la table users
    await user.destroy();
    console.log(`Utilisateur ${user.email} supprimé`);

    // 6. Supprimer de la table orthophonistes
    await orthophoniste.destroy();
    console.log(`Orthophoniste ${id} supprimé`);

    res.json({ 
      message: 'Orthophoniste supprimé avec succès. Les patients ont été détachés, les thèmes et animations restent accessibles.' 
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'orthophoniste:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/ortho/:id/patients - Récupérer les patients d'un orthophoniste
router.get('/:id/patients', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que l'orthophoniste existe
    const orthophoniste = await Orthophoniste.findByPk(id);
    if (!orthophoniste) {
      return res.status(404).json({ message: 'Orthophoniste non trouvé' });
    }

    const patients = await Patient.findAll({
      where: { orthophonisteId: id },
      attributes: ['id', 'firstName', 'lastName', 'birthDate', 'createdAt'],
      include: [{
        model: User,
        as: 'parent',
        attributes: ['id', 'email', 'firstName', 'lastName']
      }]
    });

    res.json(patients);
  } catch (error) {
    console.error('Erreur lors de la récupération des patients:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/ortho/patients/unassigned - Récupérer tous les patients sans orthophoniste
router.get('/patients/unassigned', auth, requireAdmin, async (req, res) => {
  try {
    const unassignedPatients = await Patient.findAll({
      where: { orthophonisteId: null },
      attributes: ['id', 'firstName', 'lastName', 'birthDate', 'parentEmail', 'createdAt'],
      include: [{
        model: User,
        as: 'parent',
        attributes: ['id', 'email', 'firstName', 'lastName'],
        required: false
      }],
      order: [['createdAt', 'DESC']]
    });

    console.log(`Patients sans orthophoniste trouvés: ${unassignedPatients.length}`);
    res.json(unassignedPatients);
  } catch (error) {
    console.error('Erreur lors de la récupération des patients sans orthophoniste:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/ortho/patients/:patientId/assign - Assigner un patient à un orthophoniste
router.put('/patients/:patientId/assign', auth, requireAdmin, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { orthophonisteId } = req.body;

    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // Vérifier que l'orthophoniste existe
    const orthophoniste = await Orthophoniste.findByPk(orthophonisteId);
    if (!orthophoniste) {
      return res.status(404).json({ message: 'Orthophoniste non trouvé' });
    }

    // Assigner le patient
    await patient.update({ orthophonisteId: orthophonisteId });

    // Retourner le patient mis à jour avec les informations de l'orthophoniste
    const updatedPatient = await Patient.findByPk(patientId, {
      include: [{
        model: Orthophoniste,
        as: 'orthophoniste',
        attributes: ['id', 'email', 'firstName', 'lastName']
      }]
    });

    console.log(`Patient ${patientId} assigné à l'orthophoniste ${orthophonisteId}`);
    res.json(updatedPatient);
  } catch (error) {
    console.error('Erreur lors de l\'assignation du patient:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/ortho/patients/:patientId/reassign - Réassigner un patient à un autre orthophoniste
router.put('/patients/:patientId/reassign', auth, requireAdmin, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { newOrthophonisteId } = req.body;

    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // Vérifier que le nouvel orthophoniste existe
    const newOrthophoniste = await Orthophoniste.findByPk(newOrthophonisteId);
    if (!newOrthophoniste) {
      return res.status(404).json({ message: 'Orthophoniste de destination non trouvé' });
    }

    // Réassigner le patient
    await patient.update({ orthophonisteId: newOrthophonisteId });

    // Retourner le patient mis à jour avec les informations de l'orthophoniste
    const updatedPatient = await Patient.findByPk(patientId, {
      include: [{
        model: Orthophoniste,
        as: 'orthophoniste',
        attributes: ['id', 'email', 'firstName', 'lastName']
      }]
    });

    res.json(updatedPatient);
  } catch (error) {
    console.error('Erreur lors de la réassignation du patient:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
