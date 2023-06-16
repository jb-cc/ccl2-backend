const express = require('express');
const router = express.Router();

const indexController = require ('../controllers/indexController')
const authController = require ('../controllers/authController')



router.get('/', indexController.sendHelloMessage);
router.post('/register', authController.registerUser);
router.post('/login', authController.login);





module.exports = router;