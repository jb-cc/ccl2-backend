// require express and create a router and its routes


const router = require("express").Router();

const userController = require("../controllers/userController.js");




router.put("/:id/edit", userController.editUser);
router.put("/:id/deposit", userController.depositBalance);
router.delete("/:id/delete", userController.deleteUser);


module.exports = router;

