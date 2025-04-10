const IP = process.env.VUE_APP_IP || 'localhost';
export const SERVER_BASE_URL = `http://${IP}:3000`;
export const API_URL = `${SERVER_BASE_URL}/api`; 