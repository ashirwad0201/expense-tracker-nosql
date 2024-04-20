require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const sequelize = require('./util/database');
const fs=require('fs');
const helmet=require('helmet')
const compression=require('compression')
const morgan=require('morgan');
const cors = require('cors');
const adminRoutes = require('./routes/admin');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
const resetRoutes = require('./routes/reset');
// const UserDetail = require('./models/userdetail');
// const Expense = require('./models/expense')
// const Income = require('./models/income')
// const Order=require('./models/order')
// const Download=require('./models/download')
// const FPR=require('./models/forgotPasswordRequest');
const path = require('path');
const app = express();
const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});
app.use(express.static('public'));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('combined',{stream: accessLogStream}));
app.use(bodyParser.json({ extended: false }));

app.use(adminRoutes);
// app.use(expenseRoutes);
// app.use(purchaseRoutes);
// app.use('/premium',premiumRoutes);
// app.use('/password',resetRoutes);
app.use((req,res)=>{
    const hostname=(req.hostname==='localhost'?'localhost:5000':req.hostname)
    res.redirect(`http://localhost:5000/login/login.html`);
})


//sequelize.sync({force:true})
// sequelize.sync()
// .then(result=>{
//     //console.log(result);
//     app.listen(process.env.PORT_NO || 5000);
// })
// .catch(err=>console.log(err));

mongoose
  .connect(
    'mongodb+srv://Ashi0201:02011999@cluster0.vk1wtvm.mongodb.net/expense?retryWrites=true'
  )
  .then(result => {
    console.log('Connected')
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });