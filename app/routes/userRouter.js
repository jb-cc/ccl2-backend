module.exports = app => {
    const userController = require("../controllers/userController.js");
    const router = require("express").Router();

    // Retrieve all Users
    router.get("/", userController.getUsers);

    // Retrieve a single User with id
    router.get("/:id", userController.getUser);

    // Update a User with id, previously used to render the editUser view, which then used the update the user with usercontroller.updateUser
    router.put("/:id/edit", userController.editUser);



    //

}