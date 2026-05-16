const express = require('express');
const router = express.Router();
const { register, login, adminLogin, adminRegister, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/admin/register', adminRegister);
router.post('/admin/login', adminLogin);
router.get('/me', protect, getMe);

module.exports = router;
