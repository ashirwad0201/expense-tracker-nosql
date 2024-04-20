const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');
const userAuthentication = require('../middleware/auth');

router.get('/get-user/:email', adminController.getUser);
router.post('/insert-user', adminController.insertUser);
router.post('/login-user', adminController.loginUser);
router.post('/ispremium',userAuthentication.authenticate,adminController.isPremiumUser);


module.exports = router;