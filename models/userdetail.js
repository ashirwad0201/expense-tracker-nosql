// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');


// const Userdetail = sequelize.define('userdetail', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   username: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   password: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   ispremiumuser: Sequelize.BOOLEAN,
//   totalexpense:Sequelize.INTEGER,
//   totalincome:Sequelize.INTEGER
// });

// module.exports = Userdetail;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userdetailSchema = new Schema({
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    ispremiumuser: {
      type: Boolean,
      default: false
    },
    totalexpense: {
      type: Number,
      default: 0
    },
    totalincome: {
      type: Number,
      default: 0
    } 
})

module.exports = mongoose.model('Userdetail', userdetailSchema);