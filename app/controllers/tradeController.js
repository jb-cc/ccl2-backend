const tradeModel = require("../models/tradeModel");
const listingModel = require("../models/listingModel");
const inventoryModel = require("../models/inventoryModel");

// Here is where the Buying and selling logic will be implemented

function BuyListedSkin(req, res, next) {
  tradeModel
    .handleTransaction(req.body)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(404);
      next(err);
    });

  // 1. Get the listingID from the request
  // 2. Get the listing from the listingID
  // 3. Get the sellerWeaponID from the listing
  // 4. Get the sellerID from the listing
  // 5. Get the buyerID from the request
  // 6. Check if the buyer has enough money to buy the skin
  // 7. Update the sellerWeaponID with the buyerID
  // 8. Delete the listing
  // 9. Add the listing to the buyer's inventory
  // 10. Update the buyer's money
  // 11. Update the seller's money
  // 12. Redirect to /market
  // (13. Display a message that the purchase was successful)
  // (14. If something goes wrong, redirect to /market and display a message that the purchase was unsuccessful)
  // data I need: listingID, buyerID, buyer.balance, sellerID, seller.balance, sellerWeaponID
  // tables I need: listings, users, weapons, inventory
  // why weapons? because I need to get the weaponName from the sellerWeaponID
  // why do I need the weaponname? because I need to add the weapon to the buyer's inventory
  // I can do this by just changing the userID in the inventory table, right?

}

module.exports = {
  BuyListedSkin,
};