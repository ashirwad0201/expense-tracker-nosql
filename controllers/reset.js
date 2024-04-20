const Expense = require('../models/expense');
const Userdetail=require('../models/userdetail');
const FPR=require('../models/forgotPasswordRequest');
const sequelize = require('../util/database');
const Sib=require('sib-api-v3-sdk')
const { v4: uuidv4 } = require('uuid');
const bcrypt=require('bcrypt');

exports.forgotPassword=async (req,res,next)=>{
    try{
        const userEmail=req.body.email;
        const client=Sib.ApiClient.instance
        const apiKey=client.authentications['api-key']
        console.log('API Key:', process.env.API_KEY);
        apiKey.apiKey=process.env.API_KEY
        const tranEmailApi=new Sib.TransactionalEmailsApi();
        const uuid=uuidv4();
        const hostname=(req.hostname==='localhost'?'localhost:5000':req.hostname)
        const url=`http://${hostname}/password/resetpassword/`+uuid;
        const user=await Userdetail.findOne({email: userEmail});
        console.log(user)
        await user.createForgotPasswordRequest({id: uuid,isactive: true});
        console.log(url)
        const sender={
            email: userEmail,
        }
        const receivers=[
            {
                email: userEmail,
            }
        ]
        const result=await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: `Reset Your Password`,
            textContent: `Please click on this link to reset your password. {{params.reseturl}}`,
            params:{
                reseturl: url,
            }
        })
        res.json();
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}

exports.resetPassword=async (req,res,next)=>{
    try{
        const uid=req.params.uid;
        console.log(uid)
        const request=await FPR.findByPk(uid);
        console.log(request)
        if(request){
            if(request.isactive){
                const hostname=(req.hostname==='localhost'?'localhost:5500':req.hostname)
                res.redirect(`http://${hostname}/Reset/newpassword.html?uuid=${uid}`)
            }
            else{
                throw new Error("Reset Link expired")
            }
        }
        else{
            throw new Error("Reset Request not found")
        }
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}

exports.newPassword=async (req,res,next)=>{
    try{
        const saltrounds=10;
        const myObj=req.body;
        bcrypt.hash(myObj.password,saltrounds,async (err,hash)=>{
          if(!err){
            myObj.password=hash;
            const request=await FPR.findByPk(myObj.uuid);
            if(request.isactive){
                const user=await Userdetail.findById(request.userdetailId);
                user.password=myObj.password;
                await user.save();
                request.isactive=false;
                await request.save();
                console.log("password reset successfully")
                res.json();
            }
            else{
                throw new Error("Reset Link expired")
            }
          }
        })
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}