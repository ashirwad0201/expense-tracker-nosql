const express = require('express');
const router = express.Router();
const premiumController = require('../controllers/premium');
const userAuthentication = require('../middleware/auth');


router.get('/get-leaderboard', premiumController.getLeaderBoard);
// router.get('/monthlyreport', userAuthentication.authenticate, premiumController.getMonthlyReport);
// router.get('/yearlyreport', userAuthentication.authenticate, premiumController.getYearlyReport);
router.get('/download', userAuthentication.authenticate, premiumController.downloadexpense);
router.get('/getdownload', userAuthentication.authenticate, premiumController.getdownload);


module.exports = router;