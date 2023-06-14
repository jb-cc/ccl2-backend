const router = require("express").Router();

const userController = require("../controllers/userController.js");

// TODO: Add authentication middleware to all routes

    // Retrieve all Users
router.get("/", userController.getUsers);

    // Create a new User
router.post("/register", userController.registerNewUser);

// Retrieve a single User with id
router.get("/:id", userController.getUser);

    // Update a User with id, previously used to render the editUser view, which then used the update the user with usercontroller.updateUser
router.put("/:id/edit", userController.editUser);



module.exports = router;

