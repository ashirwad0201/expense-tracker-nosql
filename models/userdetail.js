const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Userdetail = sequelize.define('userdetail', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ispremiumuser: Sequelize.BOOLEAN,
  totalexpense:Sequelize.INTEGER,
  totalincome:Sequelize.INTEGER
});

module.exports = Userdetail;