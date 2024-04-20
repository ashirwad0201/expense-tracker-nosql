const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Download = sequelize.define('download', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  url: Sequelize.STRING
});


module.exports = Download;