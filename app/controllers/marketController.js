const marketModel = require('../models/marketModel');
const listingModel = require('../models/listingModel');
const inventoryModel = require('../models/inventoryModel');

// Here is where the Buying and selling logic will be implemented

function BuyListedSkin (req,res,next){

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
}


module.exports = {
    BuyListedSkin,
}