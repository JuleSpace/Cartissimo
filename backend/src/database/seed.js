const bcrypt = require('bcryptjs');
const { User, Patient, Theme, Animation, UserTheme, patient_therapists } = require('../models');
const sequelize = require('../config/database');

const seedDatabase = async () => {
  try {
    // Désactiver temporairement les contraintes de clé étrangère
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Synchroniser la base de données
    await sequelize.sync({ force: true });

    // Réactiver les contraintes de clé étrangère
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // Hasher les mots de passe
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const therapeutePassword = await bcrypt.hash('Therapeute123!', 10);
    const parentPassword = await bcrypt.hash('Parent123!', 10);

    // Créer les utilisateurs
    const users = await User.bulkCreate([
      {
        email: 'admin@cartissimo.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'Cartissimo',
        role: 'admin',
        subscriptionRequired: false
      },
      {
        email: 'therapeute@cartissimo.com',
        password: therapeutePassword,
        firstName: 'Marie',
        lastName: 'Dubois',
        role: 'orthophonist',
        subscriptionRequired: true
      },
      {
        email: 'parent@cartissimo.com',
        password: parentPassword,
        firstName: 'Sophie',
        lastName: 'Martin',
        role: 'parent',
        subscriptionRequired: true
      }
    ]);

    // Créer les patients
    const patients = await Patient.bulkCreate([
      {
        firstName: 'Jean',
        lastName: 'Dupont',
        birthDate: '2018-05-15',
        parentEmail: 'parent@cartissimo.com',
        userId: 3, // ID du parent
        subscriptionStatus: 'active',
        subscriptionEndDate: '2025-12-31'
      }
    ]);

    // Créer les thèmes
    const themes = await Theme.bulkCreate([
      {
        name: 'Animaux de la Ferme',
        description: 'Thème sur les animaux de la ferme',
        createdBy: 1,
        status: 'approved'
      },
      {
        name: 'Véhicules',
        description: 'Thème sur les véhicules',
        createdBy: 1,
        status: 'approved'
      }
    ]);

    // Créer les animations pour le thème "Animaux de la Ferme"
    const animauxAnimations = [
      {
        name: 'Vache',
        description: 'Animation d\'une vache',
        animatedGifPath: '/animations/animaux/vache_anime.gif',
        realGifPath: '/animations/animaux/vache_reel.gif',
        soundPath: '/sounds/animaux/vache.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 1,
        createdBy: 1
      },
      {
        name: 'Cochon',
        description: 'Animation d\'un cochon',
        animatedGifPath: '/animations/animaux/cochon_anime.gif',
        realGifPath: '/animations/animaux/cochon_reel.gif',
        soundPath: '/sounds/animaux/cochon.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 1,
        createdBy: 1
      },
      {
        name: 'Poule',
        description: 'Animation d\'une poule',
        animatedGifPath: '/animations/animaux/poule_anime.gif',
        realGifPath: '/animations/animaux/poule_reel.gif',
        soundPath: '/sounds/animaux/poule.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 1,
        createdBy: 1
      },
      {
        name: 'Mouton',
        description: 'Animation d\'un mouton',
        animatedGifPath: '/animations/animaux/mouton_anime.gif',
        realGifPath: '/animations/animaux/mouton_reel.gif',
        soundPath: '/sounds/animaux/mouton.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 1,
        createdBy: 1
      },
      {
        name: 'Cheval',
        description: 'Animation d\'un cheval',
        animatedGifPath: '/animations/animaux/cheval_anime.gif',
        realGifPath: '/animations/animaux/cheval_reel.gif',
        soundPath: '/sounds/animaux/cheval.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 1,
        createdBy: 1
      },
      {
        name: 'Canard',
        description: 'Animation d\'un canard',
        animatedGifPath: '/animations/animaux/canard_anime.gif',
        realGifPath: '/animations/animaux/canard_reel.gif',
        soundPath: '/sounds/animaux/canard.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 1,
        createdBy: 1
      },
      {
        name: 'Chèvre',
        description: 'Animation d\'une chèvre',
        animatedGifPath: '/animations/animaux/chevre_anime.gif',
        realGifPath: '/animations/animaux/chevre_reel.gif',
        soundPath: '/sounds/animaux/chevre.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 1,
        createdBy: 1
      },
      {
        name: 'Âne',
        description: 'Animation d\'un âne',
        animatedGifPath: '/animations/animaux/ane_anime.gif',
        realGifPath: '/animations/animaux/ane_reel.gif',
        soundPath: '/sounds/animaux/ane.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 1,
        createdBy: 1
      },
      {
        name: 'Oie',
        description: 'Animation d\'une oie',
        animatedGifPath: '/animations/animaux/oie_anime.gif',
        realGifPath: '/animations/animaux/oie_reel.gif',
        soundPath: '/sounds/animaux/oie.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 1,
        createdBy: 1
      },
      {
        name: 'Lapin',
        description: 'Animation d\'un lapin',
        animatedGifPath: '/animations/animaux/lapin_anime.gif',
        realGifPath: '/animations/animaux/lapin_reel.gif',
        soundPath: '/sounds/animaux/lapin.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 1,
        createdBy: 1
      }
    ];

    // Créer les animations pour le thème "Véhicules"
    const vehiculesAnimations = [
      {
        name: 'Voiture',
        description: 'Animation d\'une voiture',
        animatedGifPath: '/animations/vehicules/voiture_anime.gif',
        realGifPath: '/animations/vehicules/voiture_reel.gif',
        soundPath: '/sounds/vehicules/voiture.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 2,
        createdBy: 1
      },
      {
        name: 'Camion',
        description: 'Animation d\'un camion',
        animatedGifPath: '/animations/vehicules/camion_anime.gif',
        realGifPath: '/animations/vehicules/camion_reel.gif',
        soundPath: '/sounds/vehicules/camion.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 2,
        createdBy: 1
      },
      {
        name: 'Bus',
        description: 'Animation d\'un bus',
        animatedGifPath: '/animations/vehicules/bus_anime.gif',
        realGifPath: '/animations/vehicules/bus_reel.gif',
        soundPath: '/sounds/vehicules/bus.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 2,
        createdBy: 1
      },
      {
        name: 'Moto',
        description: 'Animation d\'une moto',
        animatedGifPath: '/animations/vehicules/moto_anime.gif',
        realGifPath: '/animations/vehicules/moto_reel.gif',
        soundPath: '/sounds/vehicules/moto.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 2,
        createdBy: 1
      },
      {
        name: 'Vélo',
        description: 'Animation d\'un vélo',
        animatedGifPath: '/animations/vehicules/velo_anime.gif',
        realGifPath: '/animations/vehicules/velo_reel.gif',
        soundPath: '/sounds/vehicules/velo.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 2,
        createdBy: 1
      },
      {
        name: 'Tram',
        description: 'Animation d\'un tram',
        animatedGifPath: '/animations/vehicules/tram_anime.gif',
        realGifPath: '/animations/vehicules/tram_reel.gif',
        soundPath: '/sounds/vehicules/tram.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 2,
        createdBy: 1
      },
      {
        name: 'Train',
        description: 'Animation d\'un train',
        animatedGifPath: '/animations/vehicules/train_anime.gif',
        realGifPath: '/animations/vehicules/train_reel.gif',
        soundPath: '/sounds/vehicules/train.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 2,
        createdBy: 1
      },
      {
        name: 'Avion',
        description: 'Animation d\'un avion',
        animatedGifPath: '/animations/vehicules/avion_anime.gif',
        realGifPath: '/animations/vehicules/avion_reel.gif',
        soundPath: '/sounds/vehicules/avion.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 2,
        createdBy: 1
      },
      {
        name: 'Bateau',
        description: 'Animation d\'un bateau',
        animatedGifPath: '/animations/vehicules/bateau_anime.gif',
        realGifPath: '/animations/vehicules/bateau_reel.gif',
        soundPath: '/sounds/vehicules/bateau.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 2,
        createdBy: 1
      },
      {
        name: 'Hélicoptère',
        description: 'Animation d\'un hélicoptère',
        animatedGifPath: '/animations/vehicules/helicoptere_anime.gif',
        realGifPath: '/animations/vehicules/helicoptere_reel.gif',
        soundPath: '/sounds/vehicules/helicoptere.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 2,
        createdBy: 1
      }
    ];

    // Créer toutes les animations
    await Animation.bulkCreate([...animauxAnimations, ...vehiculesAnimations]);

    // Associer les utilisateurs aux thèmes
    await UserTheme.bulkCreate([
      { userId: 1, themeId: 1 }, // Admin a accès aux animaux
      { userId: 1, themeId: 2 }, // Admin a accès aux véhicules
      { userId: 2, themeId: 1 }, // Thérapeute a accès aux animaux
      { userId: 2, themeId: 2 }, // Thérapeute a accès aux véhicules
      { userId: 3, themeId: 1 }  // Parent a accès aux animaux
    ]);

    // Associer les thérapeutes aux patients
    await patient_therapists.bulkCreate([
      { patientId: 1, therapistId: 2 }
    ]);

    console.log('Base de données initialisée avec succès !');
    console.log('\nIdentifiants de connexion :');
    console.log('------------------------');
    console.log('Administrateur :');
    console.log('Email: admin@cartissimo.com');
    console.log('Mot de passe: Admin123!');
    console.log('\nThérapeute :');
    console.log('Email: therapeute@cartissimo.com');
    console.log('Mot de passe: Therapeute123!');
    console.log('\nParent :');
    console.log('Email: parent@cartissimo.com');
    console.log('Mot de passe: Parent123!');
    console.log('\nPatient associé :');
    console.log('Nom: Jean Dupont');
    console.log('Email du parent: parent@cartissimo.com');

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
};

seedDatabase();