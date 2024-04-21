const Expense = require('../models/expense');
const mongoose = require('mongoose');
const Income = require('../models/income');

exports.insertExpense = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try{
    let myObj = req.body;
    const expense=new Expense({
      description: myObj.description,
      category: myObj.category,
      price: myObj.price,
      userId: req.user
    })
    await expense.save({ session: session });
    req.user.totalexpense=req.user.totalexpense+(+myObj.price);
    await req.user.save({ session: session })
    await session.commitTransaction();
    console.log('Created expense');
    res.redirect('/get-expense')
  }catch(err){
    await session.abortTransaction();
    console.log(err);
    res.status(500).json("something went wrong"+err)
  }
};

exports.insertIncome = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try{
    let myObj = req.body
    const income=new Income({
      description: myObj.description,
      category: myObj.category,
      price: myObj.price,
      userId: req.user
    })
    await income.save({ session: session });
    req.user.totalincome=req.user.totalincome+(+myObj.price);
    await req.user.save({ session: session })
    await session.commitTransaction();
    console.log('Created income');
    res.redirect('/get-income')
  }catch(err){
    await session.abortTransaction();
    console.log(err);
    res.status(500).json("something went wrong"+err)
  }
};

exports.deleteExpense = async (req,res,next)=>{
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const id=req.params.id;
    const amount=req.query.amount;
    const expense=await Expense.findByIdAndDelete(id).session(session)
    console.log(expense)
    req.user.totalexpense=req.user.totalexpense-(+amount);
    await req.user.save({ session: session })
    await session.commitTransaction();
    console.log(expense);
    res.redirect('/get-expense')    
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    res.status(500).json("something went wrong"+err)    
  }

}

exports.deleteIncome = async (req,res,next)=>{
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const id=req.params.id;
    const amount=req.query.amount;
    const income=await Income.findByIdAndDelete(id).session(session)
    console.log(income)
    req.user.totalincome=req.user.totalincome-(+amount);
    await req.user.save({ session: session })
    await session.commitTransaction();
    res.redirect('/get-income')    
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    res.status(500).json("something went wrong"+err)    
  }

}
exports.getExpense =async (req,res,next)=>{
  try{
    const page=+req.query.page || 1;
    const ITEMS_PER_PAGE=+req.query.itemsPerPage || 2;
    const totalItems = await Expense.countDocuments({ userId: req.user.id });
    console.log(totalItems)
    const expenses = await Expense.find({ userId: req.user.id })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    console.log(expenses);
    res.json({
      expenses: expenses,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE*page<totalItems,
      nextPage: page+1,
      hasPreviousPage: page>1,
      previousPage:page-1,
      lastPage: Math.ceil(totalItems/ITEMS_PER_PAGE),
    })
  }catch(err){
    res.status(500).json({error:"something went wrong"});
  }
};

exports.getIncome =async (req,res,next)=>{
  try{
    const income = await Income.find({ userId: req.user.id })
    console.log("Incomes found")
    res.json(income)   
  }
  catch(err){
    res.status(500).json({error:"something went wrong"});
  }
};