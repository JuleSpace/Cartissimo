module.exports = {
  development: {
    database: {
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'cartissimo'
    },
    server: {
      port: 3000,
      host: '192.168.1.137'
    },
    jwt: {
      secret: 'b306bccb93de324d7ff4debe3883212d919743384697ece1c61decb48505bbd1cc920028928e65c3fb38de65e14e76b9f849d215a225d64cdb0d89eecdf458ed',
      expiresIn: '24h'
    }
  },
  // ... existing code ...
} 