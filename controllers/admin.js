const Userdetail=require('../models/userdetail');
const bcrypt=require('bcrypt');
const jwt= require('jsonwebtoken');

function generateAccessToken(id, name){
  console.log(id,name)
  return jwt.sign({userId: id, name: name},'secretkey');
}
exports.insertUser = (req, res, next) => {
  var myObj=req.body;
  console.log(myObj)
  console.log('hi')
  
  const saltrounds=10;
  bcrypt.hash(myObj.password,saltrounds, (err,hash)=>{
    if(!err){
      const userdetail=new Userdetail({
        username: myObj.username,
        email: myObj.email,
        password: hash
      })
      userdetail.save()
      .then(result=>{
        console.log('user created');
        res.json();
      })
      .catch(err => {
        console.log(err)
      })
    }
  })
  };

exports.getUser=(req,res,next)=>{
    const email=req.params.email;
    console.log(email);
    Userdetail.findOne({email : email})
    .then(userdetail=>{
        console.log('Got user details');
        console.log(userdetail)
        res.json(userdetail)
    })
    .catch(err=>console.log(err))
}

exports.loginUser = (req, res, next) => {
  var myObj=req.body; 
  Userdetail.findOne({email : myObj.email})
  .then(userdetail=>{
      if(userdetail==undefined){
        res.status(404).json({message:"User doesn't exist"});
      }
      else{
          bcrypt.compare(myObj.password,userdetail.password,(err,result)=>{
            if(err){
              res.status(500).json({message:"Something went wrong"});
            }
            if(result===true){
              res.status(200).json({message:"Logged in successfully",token: generateAccessToken(userdetail.id,userdetail.username)});
            }
            else{
              res.status(401).json({message:"Password incorrect!"});
            }
          })
      }      
  })
  .catch(err=>console.log(err))
 };

 exports.isPremiumUser=(req,res,next)=>{
  console.log(req.user.ispremiumuser)
  res.status(201).json({isPremium : req.user.ispremiumuser});
 }