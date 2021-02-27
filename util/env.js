const env = {
    database: 'elearning',
    username: 'HelpNCD',
    password: 'P@ssW0rd',
    host: '206.189.43.0',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  
  module.exports = env;