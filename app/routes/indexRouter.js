const router = require("express").Router();

const indexController = require ('../controllers/indexController')
const authController = require ('../controllers/authController')



router.get('/', indexController.sendHelloMessage);
router.post('/register', authController.registerUser);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/logout', authController.logout);





module.exports = router;