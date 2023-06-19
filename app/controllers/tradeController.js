const tradeModel = require("../models/tradeModel");
const listingModel = require("../models/listingModel");
const inventoryModel = require("../models/inventoryModel");

// Here is where the Buying and selling logic will be implemented

let BuyListedSkin = (req, res, next) => {
    tradeModel.handleTransaction(req, res, next);
}

module.exports = {
    BuyListedSkin,
};