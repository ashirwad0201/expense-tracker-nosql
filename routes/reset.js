const express = require('express');
const router = express.Router();
const resetController = require('../controllers/reset');
const userAuthentication = require('../middleware/auth');

router.get('/resetpassword/:uid', resetController.resetPassword);
router.post('/forgotpassword', resetController.forgotPassword);
router.post('/newpassword', resetController.newPassword);


module.exports = router;