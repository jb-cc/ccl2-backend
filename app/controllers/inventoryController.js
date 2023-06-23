// require the model


const inventoryModel = require("../models/inventoryModel");


// This retrieves the inventory of a user, and is used to display the inventory of a user on the frontend.
// it uses the user ID to retrieve the inventory of that user.
function getUserInventory(req, res, next) {
  inventoryModel
    .getUserInventory(parseInt(req.params.id))
    .then((inventory) => {
      console.table((inventory));
      res.json(inventory);
    })
    .catch((err) => {
      res.status(404);
      next(err);
    });
}


// This function is used to retrieve a specific item from the inventory of a user.
// This is necessary for the frontend to have a view where the user can see one specific skin, and then for example sell it.

function getItemByUserWeaponID(req, res, next) {
  inventoryModel
    .getItemByUserWeaponID(parseInt(req.params.id))
    .then((item) => {
      res.json(item);
    });
}

module.exports = {
  getUserInventory,
  getItemByUserWeaponID,
};
