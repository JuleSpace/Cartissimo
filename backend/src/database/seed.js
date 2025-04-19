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
      },
      // Nouvel orthophoniste
      {
        email: 'therapeute2@cartissimo.com',
        password: therapeutePassword,
        firstName: 'Sophie',
        lastName: 'Bernard',
        role: 'orthophonist',
        subscriptionRequired: true
      },
      // Nouveau parent
      {
        email: 'parent2@cartissimo.com',
        password: parentPassword,
        firstName: 'Pierre',
        lastName: 'Dubois',
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
      },
      // Nouveaux patients
      {
        firstName: 'Lucas',
        lastName: 'Petit',
        birthDate: '2015-01-15',
        parentEmail: 'parent@cartissimo.com',
        userId: 3, // ID du premier parent
        subscriptionStatus: 'active',
        subscriptionEndDate: '2025-12-31'
      },
      {
        firstName: 'Emma',
        lastName: 'Dubois',
        birthDate: '2016-03-20',
        parentEmail: 'parent2@cartissimo.com',
        userId: 5, // ID du deuxième parent
        subscriptionStatus: 'active',
        subscriptionEndDate: '2025-12-31'
      },
      {
        firstName: 'Thomas',
        lastName: 'Dubois',
        birthDate: '2017-05-10',
        parentEmail: 'parent2@cartissimo.com',
        userId: 5, // ID du deuxième parent
        subscriptionStatus: 'active',
        subscriptionEndDate: '2025-12-31'
      }
    ]);

    // Créer les thèmes
    const themes = await Theme.bulkCreate([
      {
        name: 'Animaux de la Ferme',
        description: 'Thème sur les animaux de la ferme',
        createdBy: 2,
        status: 'approved'
      },
      {
        name: 'Véhicules',
        description: 'Thème sur les véhicules',
        createdBy: 2,
        status: 'approved'
      },
      // Nouveaux thèmes
      {
        name: 'Animaux domestiques',
        description: 'Thème sur les animaux domestiques',
        createdBy: 4,
        status: 'approved'
      },
      {
        name: 'Météo',
        description: 'Thème sur la météo',
        createdBy: 4,
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
        createdBy: 2
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
        createdBy: 2
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
        createdBy: 2
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
        createdBy: 2
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
        createdBy: 2
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
        createdBy: 2
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
        createdBy: 2
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
        createdBy: 2
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
        createdBy: 2
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
        createdBy: 2
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
        createdBy: 2
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
        createdBy: 2
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
        createdBy: 2
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
        createdBy: 2
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
        createdBy: 2
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
        createdBy: 2
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
        createdBy: 2
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
        createdBy: 2
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
        createdBy: 2
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
        createdBy: 2
      }
    ];

    // Créer les animations pour le thème "Animaux domestiques"
    const animauxDomestiquesAnimations = [
      {
        name: 'Chat',
        description: 'Animation d\'un chat',
        animatedGifPath: '/animations/animaux_dom/chat_anime.gif',
        realGifPath: '/animations/animaux_dom/chat_reel.gif',
        soundPath: '/sounds/animaux_dom/chat.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 3,
        createdBy: 4
      },
      {
        name: 'Chien',
        description: 'Animation d\'un chien',
        animatedGifPath: '/animations/animaux_dom/chien_anime.gif',
        realGifPath: '/animations/animaux_dom/chien_reel.gif',
        soundPath: '/sounds/animaux_dom/chien.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 3,
        createdBy: 4
      },
      {
        name: 'Oiseau',
        description: 'Animation d\'un oiseau',
        animatedGifPath: '/animations/animaux_dom/oiseau_anime.gif',
        realGifPath: '/animations/animaux_dom/oiseau_reel.gif',
        soundPath: '/sounds/animaux_dom/oiseau.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 3,
        createdBy: 4
      },
      {
        name: 'Poisson',
        description: 'Animation d\'un poisson',
        animatedGifPath: '/animations/animaux_dom/poisson_anime.gif',
        realGifPath: '/animations/animaux_dom/poisson_reel.gif',
        soundPath: '/sounds/animaux_dom/poisson.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 3,
        createdBy: 4
      },
      {
        name: 'Hamster',
        description: 'Animation d\'un hamster',
        animatedGifPath: '/animations/animaux_dom/hamster_anime.gif',
        realGifPath: '/animations/animaux_dom/hamster_reel.gif',
        soundPath: '/sounds/animaux_dom/hamster.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 3,
        createdBy: 4
      },
      {
        name: 'Lapin',
        description: 'Animation d\'un lapin',
        animatedGifPath: '/animations/animaux_dom/lapin_anime.gif',
        realGifPath: '/animations/animaux_dom/lapin_reel.gif',
        soundPath: '/sounds/animaux_dom/lapin.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 3,
        createdBy: 4
      },
      {
        name: 'Tortue',
        description: 'Animation d\'une tortue',
        animatedGifPath: '/animations/animaux_dom/tortue_anime.gif',
        realGifPath: '/animations/animaux_dom/tortue_reel.gif',
        soundPath: '/sounds/animaux_dom/tortue.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 3,
        createdBy: 4
      },
      {
        name: 'Cochon d\'Inde',
        description: 'Animation d\'un cochon d\'Inde',
        animatedGifPath: '/animations/animaux_dom/cochon_indien_anime.gif',
        realGifPath: '/animations/animaux_dom/cochon_indien_reel.gif',
        soundPath: '/sounds/animaux_dom/cochon_indien.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 3,
        createdBy: 4
      },
      {
        name: 'Perroquet',
        description: 'Animation d\'un perroquet',
        animatedGifPath: '/animations/animaux_dom/perroquet_anime.gif',
        realGifPath: '/animations/animaux_dom/perroquet_reel.gif',
        soundPath: '/sounds/animaux_dom/perroquet.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 3,
        createdBy: 4
      },
      {
        name: 'Souris',
        description: 'Animation d\'une souris',
        animatedGifPath: '/animations/animaux_dom/souris_anime.gif',
        realGifPath: '/animations/animaux_dom/souris_reel.gif',
        soundPath: '/sounds/animaux_dom/souris.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 3,
        createdBy: 4
      }
    ];

    // Créer les animations pour le thème "Météo"
    const meteoAnimations = [
      {
        name: 'Soleil',
        description: 'Animation du soleil',
        animatedGifPath: '/animations/meteo/soleil_anime.gif',
        realGifPath: '/animations/meteo/soleil_reel.gif',
        soundPath: '/sounds/meteo/soleil.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 4,
        createdBy: 4
      },
      {
        name: 'Pluie',
        description: 'Animation de la pluie',
        animatedGifPath: '/animations/meteo/pluie_anime.gif',
        realGifPath: '/animations/meteo/pluie_reel.gif',
        soundPath: '/sounds/meteo/pluie.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 4,
        createdBy: 4
      },
      {
        name: 'Nuage',
        description: 'Animation d\'un nuage',
        animatedGifPath: '/animations/meteo/nuage_anime.gif',
        realGifPath: '/animations/meteo/nuage_reel.gif',
        soundPath: '/sounds/meteo/nuage.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 4,
        createdBy: 4
      },
      {
        name: 'Vent',
        description: 'Animation du vent',
        animatedGifPath: '/animations/meteo/vent_anime.gif',
        realGifPath: '/animations/meteo/vent_reel.gif',
        soundPath: '/sounds/meteo/vent.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 4,
        createdBy: 4
      },
      {
        name: 'Neige',
        description: 'Animation de la neige',
        animatedGifPath: '/animations/meteo/neige_anime.gif',
        realGifPath: '/animations/meteo/neige_reel.gif',
        soundPath: '/sounds/meteo/neige.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 4,
        createdBy: 4
      },
      {
        name: 'Orage',
        description: 'Animation d\'un orage',
        animatedGifPath: '/animations/meteo/orage_anime.gif',
        realGifPath: '/animations/meteo/orage_reel.gif',
        soundPath: '/sounds/meteo/orage.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 4,
        createdBy: 4
      },
      {
        name: 'Arc-en-ciel',
        description: 'Animation d\'un arc-en-ciel',
        animatedGifPath: '/animations/meteo/arc_en_ciel_anime.gif',
        realGifPath: '/animations/meteo/arc_en_ciel_reel.gif',
        soundPath: '/sounds/meteo/arc_en_ciel.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 4,
        createdBy: 4
      },
      {
        name: 'Brouillard',
        description: 'Animation du brouillard',
        animatedGifPath: '/animations/meteo/brouillard_anime.gif',
        realGifPath: '/animations/meteo/brouillard_reel.gif',
        soundPath: '/sounds/meteo/brouillard.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 4,
        createdBy: 4
      },
      {
        name: 'Éclair',
        description: 'Animation d\'un éclair',
        animatedGifPath: '/animations/meteo/eclair_anime.gif',
        realGifPath: '/animations/meteo/eclair_reel.gif',
        soundPath: '/sounds/meteo/eclair.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 4,
        createdBy: 4
      },
      {
        name: 'Grêle',
        description: 'Animation de la grêle',
        animatedGifPath: '/animations/meteo/grele_anime.gif',
        realGifPath: '/animations/meteo/grele_reel.gif',
        soundPath: '/sounds/meteo/grele.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 4,
        createdBy: 4
      }
    ];

    // Créer toutes les animations
    await Animation.bulkCreate([...animauxAnimations, ...vehiculesAnimations, ...animauxDomestiquesAnimations, ...meteoAnimations]);

    // Associer les utilisateurs aux thèmes
    await UserTheme.bulkCreate([
      { userId: 1, themeId: 1 }, // Admin a accès aux animaux
      { userId: 1, themeId: 2 }, // Admin a accès aux véhicules
      { userId: 1, themeId: 3 }, // Admin a accès aux animaux domestiques
      { userId: 1, themeId: 4 }, // Admin a accès à la météo
      { userId: 2, themeId: 1 }, // Thérapeute a accès aux animaux
      { userId: 2, themeId: 2 }, // Thérapeute a accès aux véhicules
      { userId: 2, themeId: 3 }, // Thérapeute a accès aux animaux domestiques
      { userId: 2, themeId: 4 }, // Thérapeute a accès à la météo
      { userId: 3, themeId: 1 }, // Parent a accès aux animaux
      { userId: 3, themeId: 2 }, // Parent a accès aux véhicules
      { userId: 4, themeId: 3 }, // Nouveau thérapeute a accès aux animaux domestiques
      { userId: 4, themeId: 4 }, // Nouveau thérapeute a accès à la météo
      { userId: 5, themeId: 3 }, // Nouveau parent a accès aux animaux domestiques
      { userId: 5, themeId: 4 }  // Nouveau parent a accès à la météo
    ]);

    // Associer les thérapeutes aux patients
    await patient_therapists.bulkCreate([
      { patientId: 1, therapistId: 2 },
      { patientId: 2, therapistId: 2 },
      { patientId: 3, therapistId: 4 },
      { patientId: 4, therapistId: 4 }
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
    console.log('\nNouveau Thérapeute :');
    console.log('Email: therapeute2@cartissimo.com');
    console.log('Mot de passe: Therapeute123!');
    console.log('\nNouveau Parent :');
    console.log('Email: parent2@cartissimo.com');
    console.log('Mot de passe: Parent123!');
    console.log('\nPatients associés :');
    console.log('Jean Dupont (parent@cartissimo.com)');
    console.log('Lucas Petit (parent@cartissimo.com)');
    console.log('Emma Dubois (parent2@cartissimo.com)');
    console.log('Thomas Dubois (parent2@cartissimo.com)');

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
};

seedDatabase();