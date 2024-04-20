const jwt = require('jsonwebtoken');
const UserDetail=require('../models/userdetail');

const authenticate=(req,res,next)=>{
    const token=req.header('authorization');
    console.log(token);
    const user=jwt.verify(token,'secretkey');
    console.log(user.userId)
    UserDetail.findById(user.userId)
    .then(user=>{
        req.user=user;
        next();
    })
    .catch(err=>{
        res.status(401).json({message:"Something went wrong"});
    })
}

module.exports={
    authenticate
};