// require models


const tradeModel = require("../models/tradeModel");

// the only purpose of this controller is to call the Buy function, as it is the most complex function in the whole project

let BuyListedSkin = (req, res, next) => {
    tradeModel.BuyListedItem(req, res, next);
}

module.exports = {
    BuyListedSkin,
};