const env = {
    database: 'elearning',
    username: 'HelpNCD',
    password: 'P@ssW0rd',
    host: '178.128.57.150',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  
  module.exports = env;