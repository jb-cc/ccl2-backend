const inventoryModel = require("../models/inventoryModel");

function getUserInventory(req, res, next) {
  // TODO: add the userID in the params of the request ( in the route )
  inventoryModel
    .getUserInventory(parseInt(req.params.id))
    .then((inventory) => {
      console.table((inventory));
      res.json(inventory); // this was: res.render('inventory', {inventory});
    })
    .catch((err) => {
      res.status(404);
      next(err);
    });
}

function changeSkinOwner(req, res, next) {
  // TODO: send the userID and sellerWeaponID in the body of the request
  inventoryModel
    .updateSkinOwner(req.body.sellerWeaponID, req.body.userID)
    .then((inventory) => {
      res.json(inventory);
    })
    .catch((err) => {
      res.status(404);
      next(err);
    });
}

function getItemByUserWeaponID(req, res, next) {
  inventoryModel
    .getItemByUserWeaponID(parseInt(req.params.id))
    .then((item) => {
      res.json(item);
    });
}

module.exports = {
  getUserInventory,
  changeSkinOwner,
  getItemByUserWeaponID,
};
