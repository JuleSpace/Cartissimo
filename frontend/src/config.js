// Configuration automatique selon l'environnement
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    // En production, utilise la même origine (Railway sert frontend et backend sur le même domaine)
    return window.location.origin + '/api';
  } else {
    // En développement, utilise l'IP locale
    const IP = process.env.VUE_APP_IP || 'localhost';
    return `http://${IP}:3000/api`;
  }
};

const getServerUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return window.location.origin;
  } else {
    const IP = process.env.VUE_APP_IP || 'localhost';
    return `http://${IP}:3000`;
  }
};

export const API_URL = getApiUrl();
export const SERVER_BASE_URL = getServerUrl(); 