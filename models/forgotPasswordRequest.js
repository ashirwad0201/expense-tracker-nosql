// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const FPR = sequelize.define('forgotPasswordRequest', {
//   id: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     primaryKey: true
//   },
//   isactive: Sequelize.BOOLEAN
// });


// module.exports = FPR;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const forgotPasswordRequestSchema = new Schema({
    _id: {
      type: String,
      required: true
    },
    isactive: {
      type: Boolean,
      default: false
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Userdetail',
      required: true
    }
})

module.exports = mongoose.model('ForgotPasswordRequest', forgotPasswordRequestSchema);