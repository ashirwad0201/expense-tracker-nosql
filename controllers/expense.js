const Expense = require('../models/expense');
const sequelize = require('../util/database');
const Income = require('../models/income');

exports.insertExpense = async (req, res, next) => {
  const t=await sequelize.transaction();
  try{
    let myObj = req.body
    const result=await req.user.createExpense(myObj,{transaction : t})
    await req.user.update({
      totalexpense: (req.user.totalexpense || 0)+(+myObj.price)},{transaction : t})
    await t.commit();
    console.log('Created expense');
    res.redirect('/get-expense')
  }catch(err){
    await t.rollback();
    console.log(err);
    res.status(500).json("something went wrong"+err)
  }
};

exports.insertIncome = async (req, res, next) => {
  const t=await sequelize.transaction();
  try{
    let myObj = req.body
    const result=await req.user.createIncome(myObj,{transaction : t})
    await req.user.update({
      totalincome: (req.user.totalincome || 0)+(+myObj.price)},{transaction : t})
    await t.commit();
    console.log('Created income');
    res.redirect('/get-income')
  }catch(err){
    await t.rollback();
    console.log(err);
    res.status(500).json("something went wrong"+err)
  }
};

exports.deleteExpense = async (req,res,next)=>{
  const t=await sequelize.transaction();
  try {
    const id=req.params.id;
    const amount=req.query.amount;

    const expense=await Expense.destroy({
      where: {
        id: id,
        userdetailId: req.user.id
      }
    },{transaction : t})
    console.log(expense)
    await req.user.update({
      totalexpense: (req.user.totalexpense)-(+amount)},
      {transaction : t})
    await t.commit();
    console.log(expense);
    res.redirect('/get-expense')    
  } catch (err) {
    await t.rollback();
    console.log(err);
    res.status(500).json("something went wrong"+err)    
  }

}

exports.deleteIncome = async (req,res,next)=>{
  const t=await sequelize.transaction();
  try {
    const id=req.params.id;
    const amount=req.query.amount;

    const income=await Income.destroy({
      where: {
        id: id,
        userdetailId: req.user.id
      }
    },{transaction : t})
    await req.user.update({
      totalincome: (req.user.totalincome)-(+amount)},
      {transaction : t})
    await t.commit();
    res.redirect('/get-income')    
  } catch (err) {
    await t.rollback();
    console.log(err);
    res.status(500).json("something went wrong"+err)    
  }

}
exports.getExpense =async (req,res,next)=>{
  try{
    const page=+req.query.page || 1;
    const ITEMS_PER_PAGE=+req.query.itemsPerPage || 2;
    const totalItems=await Expense.count({
      where:{userdetailId: req.user.id}
    });
    const expenses=await Expense.findAll({
      where:{userdetailId: req.user.id},
      offset:(page-1)*ITEMS_PER_PAGE,
      limit: ITEMS_PER_PAGE
    })
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
    // req.user.getExpenses()
    // .then((result)=>{
    //     res.json(result)
    // })
    // .catch(err=>console.log(err));
};

exports.getIncome =(req,res,next)=>{
  req.user.getIncomes()
  .then((result)=>{
    console.log("Incomes found")
      res.json(result)
  })
  .catch(err=>console.log(err));
};