const Sequelize = require('sequelize');
const env = require('./env');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  timezone: '+07:00',
  operatorsAliases: false,

  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//import model
db.UserModel = require('../model/UserModel.js')(sequelize, Sequelize);
db.ForgetPasswordModel = require('../model/ForgetPasswordModel.js')(sequelize, Sequelize);

module.exports = db;