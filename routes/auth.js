const express = require('express');
const { 
    register, 
    login, 
    me, 
    forgotPassword, 
    resetPassword, 
    updateDetails,
    updatePassword,
    logout
 } = require('../controllers/auth');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, me);
router.post('/forgotPassword', forgotPassword);
router.put('/resetPassword/:resetToken', resetPassword);
router.put('/updateDetails', protect, updateDetails);
router.put('/updatePassword', protect, updatePassword);
router.get('/logout', logout);

module.exports = router;