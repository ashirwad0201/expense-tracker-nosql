const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense');
const userAuthentication = require('../middleware/auth');

router.get('/get-expense', userAuthentication.authenticate, expenseController.getExpense);
router.get('/get-income', userAuthentication.authenticate, expenseController.getIncome);
router.post('/insert-expense', userAuthentication.authenticate, expenseController.insertExpense);
router.post('/insert-income', userAuthentication.authenticate, expenseController.insertIncome);
router.delete('/delete-expense/:id', userAuthentication.authenticate, expenseController.deleteExpense);
router.delete('/delete-income/:id', userAuthentication.authenticate, expenseController.deleteIncome);


module.exports = router;