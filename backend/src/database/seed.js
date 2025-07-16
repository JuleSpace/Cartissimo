const bcrypt = require('bcryptjs');
const { User, Patient, Theme, Animation, UserTheme, patient_therapists } = require('../models');
const sequelize = require('../config/database');
const { Orthophoniste } = require('../models');

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
        subscriptionRequired: false
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
        subscriptionRequired: false
      },
      // Nouveau parent
      {
        email: 'parent2@cartissimo.com',
        password: parentPassword,
        firstName: 'Pierre',
        lastName: 'Dubois',
        role: 'parent',
        subscriptionRequired: true
      },
      {
        email: 'parent3@cartissimo.com',
        password: parentPassword,
        firstName: 'Bernard',
        lastName: 'Bernard',
        role: 'parent',
        subscriptionRequired: true
      }
    ]);
    // - - - Créer les patients - - -
    const orthophonistes = await Orthophoniste.bulkCreate([
      {
        firstName: 'Marie',
        lastName: 'Dubois',
        email: 'therapeute@cartissimo.com',
        phone: '0601020304',
        address: '3 Bd Michelet',
        city: 'Marseille',
        postalCode: '13008',
        profilePictureUrl: 'https://example.com/photos/marie.jpg',
        doctolibUrl: 'https://www.doctolib.fr/orthophoniste/marseille/marie-dubois'
      },
      {
        firstName: 'Sophie',
        lastName: 'Bernard',
        email: 'therapeute2@cartissimo.com',
        phone: '0605060708',
        address: '456 avenue Victor Hugo',
        city: 'Lyon',
        postalCode: '69002',
        profilePictureUrl: 'https://example.com/photos/sophie.jpg',
        doctolibUrl: 'https://www.doctolib.fr/orthophoniste/lyon/sophie-bernard'
      }
    ]);

    // - - - Créer les patients - - - 
    const patients = await Patient.bulkCreate([
      {
        firstName: 'Jean',
        lastName: 'Dupont',
        birthDate: '2018-05-15',
        parentEmail: 'parent@cartissimo.com',
        userId: 3, // ID du parent
        subscriptionStatus: 'active',
        subscriptionEndDate: '2025-12-31',
        orthophonisteId: orthophonistes[0].id // Marie Dubois
      },
      {
        firstName: 'Lucas',
        lastName: 'Petit',
        birthDate: '2015-01-15',
        parentEmail: 'parent@cartissimo.com',
        userId: 3, // ID du parent
        subscriptionStatus: 'active',
        subscriptionEndDate: '2025-12-31',
        orthophonisteId: orthophonistes[0].id // Marie Dubois
      },
      {
        firstName: 'Emma',
        lastName: 'Dubois',
        birthDate: '2016-03-20',
        parentEmail: 'parent2@cartissimo.com',
        userId: 5, // ID du parent
        subscriptionStatus: 'active',
        subscriptionEndDate: '2025-12-31',
        orthophonisteId: orthophonistes[1].id // Sophie Bernard
      },
      {
        firstName: 'Thomas',
        lastName: 'Bernard',
        birthDate: '2017-05-10',
        parentEmail: 'parent3@cartissimo.com',
        userId: 6, // ID du deuxième parent
        subscriptionStatus: 'active',
        subscriptionEndDate: '2025-12-31',
        orthophonisteId: orthophonistes[1].id // Sophie Bernard
      }
    ]);

    // Créer les thèmes
    const themes = await Theme.bulkCreate([
      {
        name: 'Animaux de la Ferme',
        description: 'Thème sur les animaux de la ferme',
        createdBy: 2,
        status: 'approved',
        image: '/images/themes/ferme.jpg',
      },
      {
        name: 'Véhicules',
        description: 'Thème sur les véhicules',
        createdBy: 2,
        status: 'approved',
        image: '/images/themes/vehicules.jpg',
      },
      {
        name: 'Animaux domestiques',
        description: 'Thème sur les animaux domestiques',
        createdBy: 4,
        status: 'approved',
        image: '/images/themes/domestiques.png',
      },
      {
        name: 'Instruments de musique',
        description: 'Thème sur les instruments de musique',
        createdBy: 2,
        status: 'approved',
        image: '/images/themes/instruments.jpg',
      },
      {
        name: 'Animaux de la savane',
        description: 'Thème sur les animaux de la savane',
        createdBy: 4,
        status: 'approved',
        image: '/images/themes/savane.jpg',
      },
      {
        name: 'Outils/Electroménagers',
        description: 'Thème sur les outils et électroménagers',
        createdBy: 2,
        status: 'approved',
        image: '/images/themes/outils.jpg',
      },
      {
        name: 'Animaux sauvages',
        description: 'Thème sur les animaux sauvages',
        createdBy: 4,
        status: 'approved',
        image: '/images/themes/sauvages.jpg',
      },
      {
        name: 'Animaux marins',
        description: 'Thème sur les animaux marins',
        createdBy: 2,
        status: 'approved',
        image: '/images/themes/marins.jpg',
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

    // Créer les animations pour le thème "Instruments de musique"
    const instrumentsAnimations = [
      {
        name: 'Piano',
        description: 'Animation d\'un piano',
        animatedGifPath: '/animations/instruments/piano_anime.gif',
        realGifPath: '/animations/instruments/piano_reel.gif',
        soundPath: '/sounds/instruments/piano.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 4,
        createdBy: 2
      },
      {
        name: 'Guitare',
        description: 'Animation d\'une guitare',
        animatedGifPath: '/animations/instruments/guitare_anime.gif',
        realGifPath: '/animations/instruments/guitare_reel.gif',
        soundPath: '/sounds/instruments/guitare.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 4,
        createdBy: 2
      },
      {
        name: 'Batterie',
        description: 'Animation d\'une batterie',
        animatedGifPath: '/animations/instruments/batterie_anime.gif',
        realGifPath: '/animations/instruments/batterie_reel.gif',
        soundPath: '/sounds/instruments/batterie.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 4,
        createdBy: 2
      },
      {
        name: 'Trompette',
        description: 'Animation d\'une trompette',
        animatedGifPath: '/animations/instruments/trompette_anime.gif',
        realGifPath: '/animations/instruments/trompette_reel.gif',
        soundPath: '/sounds/instruments/trompette.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 4,
        createdBy: 2
      },
      {
        name: 'Violon',
        description: 'Animation d\'un violon',
        animatedGifPath: '/animations/instruments/violon_anime.gif',
        realGifPath: '/animations/instruments/violon_reel.gif',
        soundPath: '/sounds/instruments/violon.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 4,
        createdBy: 2
      },
      {
        name: 'Flûte',
        description: 'Animation d\'une flûte',
        animatedGifPath: '/animations/instruments/flute_anime.gif',
        realGifPath: '/animations/instruments/flute_reel.gif',
        soundPath: '/sounds/instruments/flute.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 4,
        createdBy: 2
      },
      {
        name: 'Harmonica',
        description: 'Animation d\'un harmonica',
        animatedGifPath: '/animations/instruments/harmonica_anime.gif',
        realGifPath: '/animations/instruments/harmonica_reel.gif',
        soundPath: '/sounds/instruments/harmonica.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 4,
        createdBy: 2
      },
      {
        name: 'Xylophone',
        description: 'Animation d\'un xylophone',
        animatedGifPath: '/animations/instruments/xylophone_anime.gif',
        realGifPath: '/animations/instruments/xylophone_reel.gif',
        soundPath: '/sounds/instruments/xylophone.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 4,
        createdBy: 2
      },
      {
        name: 'Tambour',
        description: 'Animation d\'un tambour',
        animatedGifPath: '/animations/instruments/tambour_anime.gif',
        realGifPath: '/animations/instruments/tambour_reel.gif',
        soundPath: '/sounds/instruments/tambour.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 4,
        createdBy: 2
      },
      {
        name: 'Maracas',
        description: 'Animation d\'une maracas',
        animatedGifPath: '/animations/instruments/maracas_anime.gif',
        realGifPath: '/animations/instruments/maracas_reel.gif',
        soundPath: '/sounds/instruments/maracas.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 4,
        createdBy: 2
      }
    ];

    // Créer les animations pour le thème "Animaux de la savane"
    const savaneAnimations = [
      {
        name: 'Lion',
        description: 'Animation d\'un lion',
        animatedGifPath: '/animations/savane/lion_anime.gif',
        realGifPath: '/animations/savane/lion_reel.gif',
        soundPath: '/sounds/savane/lion.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 5,
        createdBy: 4
      },
      {
        name: 'Éléphant',
        description: 'Animation d\'un éléphant',
        animatedGifPath: '/animations/savane/elephant_anime.gif',
        realGifPath: '/animations/savane/elephant_reel.gif',
        soundPath: '/sounds/savane/elephant.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 5,
        createdBy: 4
      },
      {
        name: 'Girafe',
        description: 'Animation d\'une girafe',
        animatedGifPath: '/animations/savane/girafe_anime.gif',
        realGifPath: '/animations/savane/girafe_reel.gif',
        soundPath: '/sounds/savane/girafe.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 5,
        createdBy: 4
      },
      {
        name: 'Zèbre',
        description: 'Animation d\'un zèbre',
        animatedGifPath: '/animations/savane/zebre_anime.gif',
        realGifPath: '/animations/savane/zebre_reel.gif',
        soundPath: '/sounds/savane/zebre.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 5,
        createdBy: 4
      },
      {
        name: 'Hippopotame',
        description: 'Animation d\'un hippopotame',
        animatedGifPath: '/animations/savane/hippopotame_anime.gif',
        realGifPath: '/animations/savane/hippopotame_reel.gif',
        soundPath: '/sounds/savane/hippopotame.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 5,
        createdBy: 4
      },
      {
        name: 'Rhinocéros',
        description: 'Animation d\'un rhinocéros',
        animatedGifPath: '/animations/savane/rhinoceros_anime.gif',
        realGifPath: '/animations/savane/rhinoceros_reel.gif',
        soundPath: '/sounds/savane/rhinoceros.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 5,
        createdBy: 4
      },
      {
        name: 'Hyène',
        description: 'Animation d\'une hyène',
        animatedGifPath: '/animations/savane/hyene_anime.gif',
        realGifPath: '/animations/savane/hyene_reel.gif',
        soundPath: '/sounds/savane/hyene.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 5,
        createdBy: 4
      },
      {
        name: 'Guépard',
        description: 'Animation d\'un guépard',
        animatedGifPath: '/animations/savane/guepard_anime.gif',
        realGifPath: '/animations/savane/guepard_reel.gif',
        soundPath: '/sounds/savane/guepard.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 5,
        createdBy: 4
      },
      {
        name: 'Crocodile',
        description: 'Animation d\'un crocodile',
        animatedGifPath: '/animations/savane/crocodile_anime.gif',
        realGifPath: '/animations/savane/crocodile_reel.gif',
        soundPath: '/sounds/savane/crocodile.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 5,
        createdBy: 4
      },
      {
        name: 'Singe',
        description: 'Animation d\'un singe',
        animatedGifPath: '/animations/savane/singe_anime.gif',
        realGifPath: '/animations/savane/singe_reel.gif',
        soundPath: '/sounds/savane/singe.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 5,
        createdBy: 4
      }
    ];

    // Créer les animations pour le thème "Outils"
    const outilsAnimations = [
      {
        name: 'Marteau',
        description: 'Animation d\'un marteau',
        animatedGifPath: '/animations/outils/marteau_anime.gif',
        realGifPath: '/animations/outils/marteau_reel.gif',
        soundPath: '/sounds/outils/marteau.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 6,
        createdBy: 2
      },
      {
        name: 'Perceuse',
        description: 'Animation d\'une perceuse',
        animatedGifPath: '/animations/outils/perceuse_anime.gif',
        realGifPath: '/animations/outils/perceuse_reel.gif',
        soundPath: '/sounds/outils/perceuse.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 6,
        createdBy: 2
      },
      {
        name: 'Scie',
        description: 'Animation d\'une scie',
        animatedGifPath: '/animations/outils/scie_anime.gif',
        realGifPath: '/animations/outils/scie_reel.gif',
        soundPath: '/sounds/outils/scie.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 6,
        createdBy: 2
      },
      {
        name: 'Tondeuse',
        description: 'Animation d\'une tondeuse',
        animatedGifPath: '/animations/outils/tondeuse_anime.gif',
        realGifPath: '/animations/outils/tondeuse_reel.gif',
        soundPath: '/sounds/outils/tondeuse.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 6,
        createdBy: 2
      },
      {
        name: 'Aspirateur',
        description: 'Animation d\'un aspirateur',
        animatedGifPath: '/animations/outils/aspirateur_anime.gif',
        realGifPath: '/animations/outils/aspirateur_reel.gif',
        soundPath: '/sounds/outils/aspirateur.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 6,
        createdBy: 2
      },
      {
        name: 'Mixeur',
        description: 'Animation d\'un mixeur',
        animatedGifPath: '/animations/outils/mixeur_anime.gif',
        realGifPath: '/animations/outils/mixeur_reel.gif',
        soundPath: '/sounds/outils/mixeur.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 6,
        createdBy: 2
      },
      {
        name: 'Sèche-cheveux',
        description: 'Animation d\'un sèche-cheveux',
        animatedGifPath: '/animations/outils/seche_cheveux_anime.gif',
        realGifPath: '/animations/outils/seche_cheveux_reel.gif',
        soundPath: '/sounds/outils/seche_cheveux.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 6,
        createdBy: 2
      },
      {
        name: 'Machine à laver',
        description: 'Animation d\'une machine à laver',
        animatedGifPath: '/animations/outils/machine_laver_anime.gif',
        realGifPath: '/animations/outils/machine_laver_reel.gif',
        soundPath: '/sounds/outils/machine_laver.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 6,
        createdBy: 2
      },
      {
        name: 'Micro-ondes',
        description: 'Animation d\'un micro-ondes',
        animatedGifPath: '/animations/outils/micro_ondes_anime.gif',
        realGifPath: '/animations/outils/micro_ondes_reel.gif',
        soundPath: '/sounds/outils/micro_ondes.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 6,
        createdBy: 2
      },
      {
        name: 'Sonnette',
        description: 'Animation d\'une sonnette',
        animatedGifPath: '/animations/outils/sonnette_anime.gif',
        realGifPath: '/animations/outils/sonnette_reel.gif',
        soundPath: '/sounds/outils/sonnette.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 6,
        createdBy: 2
      }
    ];

    // Créer les animations pour le thème "Animaux sauvages"
    const sauvagesAnimations = [
      {
        name: 'Ours',
        description: 'Animation d\'un ours',
        animatedGifPath: '/animations/sauvages/ours_anime.gif',
        realGifPath: '/animations/sauvages/ours_reel.gif',
        soundPath: '/sounds/sauvages/ours.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 7,
        createdBy: 4
      },
      {
        name: 'Loup',
        description: 'Animation d\'un loup',
        animatedGifPath: '/animations/sauvages/loup_anime.gif',
        realGifPath: '/animations/sauvages/loup_reel.gif',
        soundPath: '/sounds/sauvages/loup.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 7,
        createdBy: 4
      },
      {
        name: 'Renard',
        description: 'Animation d\'un renard',
        animatedGifPath: '/animations/sauvages/renard_anime.gif',
        realGifPath: '/animations/sauvages/renard_reel.gif',
        soundPath: '/sounds/sauvages/renard.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 7,
        createdBy: 4
      },
      {
        name: 'Écureuil',
        description: 'Animation d\'un écureuil',
        animatedGifPath: '/animations/sauvages/ecureuil_anime.gif',
        realGifPath: '/animations/sauvages/ecureuil_reel.gif',
        soundPath: '/sounds/sauvages/ecureuil.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 7,
        createdBy: 4
      },
      {
        name: 'Hérisson',
        description: 'Animation d\'un hérisson',
        animatedGifPath: '/animations/sauvages/herisson_anime.gif',
        realGifPath: '/animations/sauvages/herisson_reel.gif',
        soundPath: '/sounds/sauvages/herisson.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 7,
        createdBy: 4
      },
      {
        name: 'Chauve-souris',
        description: 'Animation d\'une chauve-souris',
        animatedGifPath: '/animations/sauvages/chauve_souris_anime.gif',
        realGifPath: '/animations/sauvages/chauve_souris_reel.gif',
        soundPath: '/sounds/sauvages/chauve_souris.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 7,
        createdBy: 4
      },
      {
        name: 'Grenouille',
        description: 'Animation d\'une grenouille',
        animatedGifPath: '/animations/sauvages/grenouille_anime.gif',
        realGifPath: '/animations/sauvages/grenouille_reel.gif',
        soundPath: '/sounds/sauvages/grenouille.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 7,
        createdBy: 4
      },
      {
        name: 'Serpent',
        description: 'Animation d\'un serpent',
        animatedGifPath: '/animations/sauvages/serpent_anime.gif',
        realGifPath: '/animations/sauvages/serpent_reel.gif',
        soundPath: '/sounds/sauvages/serpent.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 7,
        createdBy: 4
      },
      {
        name: 'Aigle',
        description: 'Animation d\'un aigle',
        animatedGifPath: '/animations/sauvages/aigle_anime.gif',
        realGifPath: '/animations/sauvages/aigle_reel.gif',
        soundPath: '/sounds/sauvages/aigle.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 7,
        createdBy: 4
      },
      {
        name: 'Hibou',
        description: 'Animation d\'un hibou',
        animatedGifPath: '/animations/sauvages/hibou_anime.gif',
        realGifPath: '/animations/sauvages/hibou_reel.gif',
        soundPath: '/sounds/sauvages/hibou.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 7,
        createdBy: 4
      }
    ];

    // Créer les animations pour le thème "Animaux marins"
    const marinsAnimations = [
      {
        name: 'Baleine',
        description: 'Animation d\'une baleine',
        animatedGifPath: '/animations/marins/baleine_anime.gif',
        realGifPath: '/animations/marins/baleine_reel.gif',
        soundPath: '/sounds/marins/baleine.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 8,
        createdBy: 2
      },
      {
        name: 'Dauphin',
        description: 'Animation d\'un dauphin',
        animatedGifPath: '/animations/marins/dauphin_anime.gif',
        realGifPath: '/animations/marins/dauphin_reel.gif',
        soundPath: '/sounds/marins/dauphin.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 8,
        createdBy: 2
      },
      {
        name: 'Requin',
        description: 'Animation d\'un requin',
        animatedGifPath: '/animations/marins/requin_anime.gif',
        realGifPath: '/animations/marins/requin_reel.gif',
        soundPath: '/sounds/marins/requin.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 8,
        createdBy: 2
      },
      {
        name: 'Pieuvre',
        description: 'Animation d\'une pieuvre',
        animatedGifPath: '/animations/marins/pieuvre_anime.gif',
        realGifPath: '/animations/marins/pieuvre_reel.gif',
        soundPath: '/sounds/marins/pieuvre.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 8,
        createdBy: 2
      },
      {
        name: 'Phoque',
        description: 'Animation d\'un phoque',
        animatedGifPath: '/animations/marins/phoque_anime.gif',
        realGifPath: '/animations/marins/phoque_reel.gif',
        soundPath: '/sounds/marins/phoque.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 8,
        createdBy: 2
      },
      {
        name: 'Otarie',
        description: 'Animation d\'une otarie',
        animatedGifPath: '/animations/marins/otarie_anime.gif',
        realGifPath: '/animations/marins/otarie_reel.gif',
        soundPath: '/sounds/marins/otarie.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 8,
        createdBy: 2
      },
      {
        name: 'Crabe',
        description: 'Animation d\'un crabe',
        animatedGifPath: '/animations/marins/crabe_anime.gif',
        realGifPath: '/animations/marins/crabe_reel.gif',
        soundPath: '/sounds/marins/crabe.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 8,
        createdBy: 2
      },
      {
        name: 'Méduse',
        description: 'Animation d\'une méduse',
        animatedGifPath: '/animations/marins/meduse_anime.gif',
        realGifPath: '/animations/marins/meduse_reel.gif',
        soundPath: '/sounds/marins/meduse.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 8,
        createdBy: 2
      },
      {
        name: 'Poisson-clown',
        description: 'Animation d\'un poisson-clown',
        animatedGifPath: '/animations/marins/poisson_clown_anime.gif',
        realGifPath: '/animations/marins/poisson_clown_reel.gif',
        soundPath: '/sounds/marins/poisson_clown.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 8,
        createdBy: 2
      },
      {
        name: 'Étoile de mer',
        description: 'Animation d\'une étoile de mer',
        animatedGifPath: '/animations/marins/etoile_mer_anime.gif',
        realGifPath: '/animations/marins/etoile_mer_reel.gif',
        soundPath: '/sounds/marins/etoile_mer.mp3',
        duration: 2000,
        width: 300,
        height: 300,
        status: 'approved',
        themeId: 8,
        createdBy: 2
      }
    ];

    // Créer toutes les animations
    await Animation.bulkCreate([
      ...animauxAnimations, 
      ...vehiculesAnimations, 
      ...animauxDomestiquesAnimations, 
      ...instrumentsAnimations,
      ...savaneAnimations,
      ...outilsAnimations,
      ...sauvagesAnimations,
      ...marinsAnimations
    ]);

    // Associer les utilisateurs aux thèmes
    await UserTheme.bulkCreate([
      // Admin a accès à tous les thèmes
      { userId: 1, themeId: 1 },
      { userId: 1, themeId: 2 },
      { userId: 1, themeId: 3 },
      { userId: 1, themeId: 4 },
      { userId: 1, themeId: 5 },
      { userId: 1, themeId: 6 },
      { userId: 1, themeId: 7 },
      { userId: 1, themeId: 8 },
      // Thérapeute a accès à tous les thèmes
      { userId: 2, themeId: 1 },
      { userId: 2, themeId: 2 },
      { userId: 2, themeId: 3 },
      { userId: 2, themeId: 4 },
      { userId: 2, themeId: 5 },
      { userId: 2, themeId: 6 },
      { userId: 2, themeId: 7 },
      { userId: 2, themeId: 8 },
      // Parent a accès aux premiers thèmes
      { userId: 3, themeId: 1 },
      { userId: 3, themeId: 2 },
      { userId: 3, themeId: 3 },
      { userId: 3, themeId: 4 },
      // Nouveau thérapeute a accès à tous les thèmes
      { userId: 4, themeId: 1 },
      { userId: 4, themeId: 2 },
      { userId: 4, themeId: 3 },
      { userId: 4, themeId: 4 },
      { userId: 4, themeId: 5 },
      { userId: 4, themeId: 6 },
      { userId: 4, themeId: 7 },
      { userId: 4, themeId: 8 },
      // Nouveau parent a accès à certains thèmes
      { userId: 5, themeId: 5 },
      { userId: 5, themeId: 6 },
      { userId: 5, themeId: 7 },
      { userId: 5, themeId: 8 }
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
    console.log('\nNouveau Parent :');
    console.log('Email: parent3@cartissimo.com');
    console.log('Mot de passe: Parent123!');
    console.log('\nPatients associés :');
    console.log('Jean Dupont (parent@cartissimo.com)');
    console.log('Lucas Petit (parent@cartissimo.com)');
    console.log('Emma Dubois (parent2@cartissimo.com)');
    console.log('Thomas Bernard (parent3@cartissimo.com)');

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
};

seedDatabase();