const tradeModel = require("../models/tradeModel");

// Here is where the Buying and selling logic will be implemented

let BuyListedSkin = (req, res, next) => {
    tradeModel.BuyListedItem(req, res, next);
}

module.exports = {
    BuyListedSkin,
};