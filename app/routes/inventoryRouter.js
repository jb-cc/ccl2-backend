const router = require("express").Router();

const inventoryController = require("../controllers/inventoryController.js");


router.get("/user/:id", inventoryController.getUserInventory);
router.get("/item/:id", inventoryController.getItemByUserWeaponID);



module.exports = router;