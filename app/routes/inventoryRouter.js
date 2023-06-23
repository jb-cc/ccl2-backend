// require express and create a router and its routes


const router = require("express").Router();

const inventoryController = require("../controllers/inventoryController.js");

// defining routes, that will be accessed from the client side using axios


router.get("/user/:id", inventoryController.getUserInventory);
router.get("/item/:id", inventoryController.getItemByUserWeaponID);



module.exports = router;