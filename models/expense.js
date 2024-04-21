// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Expense = sequelize.define('expense', {
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


// module.exports = Expense;


const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
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

module.exports = mongoose.model('Expense', expenseSchema);