const { Sequelize } = require('sequelize');
const Expense = require('../models/expense');
const Income = require('../models/income');
const Userdetail=require('../models/userdetail');
const sequelize = require('../util/database');
const S3Service=require('../services/S3services')

exports.getLeaderBoard=async (req,res,next)=>{
    try{
        const leaderboard=await Userdetail.findAll({
            attributes: ['username','totalexpense']
        })
        res.status(200).json(leaderboard)
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}

exports.getMonthlyReport=async (req,res,next)=>{
    try{
        const Obj=req.query;
        const year=Obj.year;
        const month=Obj.month;
        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        console.log(month);
        console.log(isLeapYear)
        const startDate=new Date(year,month-1,1); 
        const endDate=new Date(year,month,1);
        const userId=req.user.id;
        console.log(startDate)
        console.log(endDate)
        console.log(new Date(year,month,1))
        console.log(userId)
        const expenses=await Expense.findAll({
            where:{
                userdetailId: userId,
                createdAt: {[Sequelize.Op.between]: [startDate, endDate]},
            },
            order:[['createdAt','ASC']],
        });
        const incomes=await Income.findAll({
            where:{
                userdetailId: userId,
                createdAt: {[Sequelize.Op.between]: [startDate, endDate]},
            },
            order:[['createdAt','ASC']],
        });
        let records=[...expenses,...incomes]
        records.sort((a,b)=>a.createdAt-b.createdAt);
        const response=records.map(record=>({
            date: record.createdAt.toLocaleDateString('en-GB'),
            category: record.category,
            description: record.description,
            income: record.category=="salary"?record.price:"",
            expense: record.category=="salary"?"":record.price
        }))
        res.status(200).json(response)

    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}

exports.getYearlyReport=async (req,res,next)=>{
    try{
        const Obj=req.query;
        const year=Obj.year;
        const month=Obj.month;
        const startDate=new Date(year,0,1);
        const endDate=new Date(year,11,31);
        const userId=req.user.id;
        const expenses=await Expense.findAll({
            where:{
                userdetailId: userId,
                createdAt: {[Sequelize.Op.between]: [startDate, endDate]},                
            }
        });
        const incomes=await Income.findAll({
            where:{
                userdetailId: userId,
                createdAt: {[Sequelize.Op.between]: [startDate, endDate]},                
            }
        });
        const yearReport=Array.from({length:12},()=>({
            month: 0,
            income: 0,
            expense: 0,
            savings: 0
        }))
        expenses.forEach(expense=>{
            const currMonth=expense.createdAt.getMonth();
            yearReport[currMonth].month=currMonth;
            yearReport[currMonth].expense+=expense.price;
        });
        incomes.forEach(income=>{
            const currMonth=income.createdAt.getMonth();
            yearReport[currMonth].month=currMonth;
            yearReport[currMonth].income+=income.price;
        })
        yearReport.forEach(report=>{
            report.savings=report.income-report.expense;
        })
        const filteredReport=yearReport.filter(report=>report.income !==0 || report.expense !==0 || report.savings!==0)
        res.status(200).json(filteredReport)
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}

exports.downloadexpense = async(req,res,next)=>{
    try{

        const Obj1= req.query;
        const stringifiedExpenses= JSON.stringify(Obj1);
        const userId = req.user.id;
        const currentDate = new Date();
        const currentDateTime = currentDate.toLocaleString();
        console.log(currentDateTime)
        const filename=`Expense${userId}/${currentDateTime}.txt`;
        const fileUrl= await S3Service.uploadToS3(stringifiedExpenses, filename);
        await req.user.createDownload({name:filename, url:fileUrl})
        res.status(200).json({fileUrl, success:true})
    }
    catch(err){
        console.log(err);
        res.status(500).json({fileUrl:'', success:true, err:err})
    }
}

exports.getdownload = async(req,res,next)=>{
    try{
        const downloads=await req.user.getDownloads();
        res.status(200).json(downloads)
    }
    catch(err){
        console.log(err);
        res.status(500).json({fileUrl:'', success:true, err:err})
    }
}