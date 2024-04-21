// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Income = sequelize.define('income', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   category: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false
//   }
// });


// module.exports = Income;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const incomeSchema = new Schema({
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Userdetail',
      required: true
    }
}, 
{
  timestamps: true 
})

module.exports = mongoose.model('Income', incomeSchema);