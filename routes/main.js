const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const signUpController = require('../controllers/authentication/signUpController')
router.get('/', homeController.home);

router.get('/signup', signUpController.signUp)
router.post('/register', signUpController.register)

module.exports = router;