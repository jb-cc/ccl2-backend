// require express and create a router and its routes

const router = require("express").Router();

const authController = require ('../controllers/authController')

// defining routes, that will be accessed from the client side using axios

// I did not add a route for the '/' route, as that is already in the main api.js file

// the routes defined here are the most important ones, as they are the ones that are used for authentication


router.post('/register', authController.registerUser);
router.post('/login', authController.login);
router.post('/logout', authController.logout); // I added a GET and POST logout route, just so that I can send a post request from the client side, but it also logs you out if you just go to the route in the browser
router.get('/logout', authController.logout);


// this route is used to send back the data of the current user that is logged in, because the client side needs that data again if the user refreshes the page.
// this for example is useful for the navbar, which has different buttons depending on whether the user is logged in or not
router.get('/me', authController.sendBackUser);





module.exports = router;