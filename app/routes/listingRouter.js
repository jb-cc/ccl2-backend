// require express and create a router and its routes


const router = require("express").Router();


// the listing controller will be used to handle requests made to the /listings route. Here you see all the items listed on the market.
// Not all of this code is protected with the JWT, as users should still see the listings even if they are not logged in.
// However, they will not be able to buy them (or sell any listings), as that is protected with the JWT.

const listingController = require("../controllers/listingController.js");
const tradeController = require("../controllers/tradeController.js");

router.get("/", listingController.getAllListings);
router.get("/CT", listingController.getCTListings);
router.get("/T", listingController.getTListings);
router.get("/item/:id", listingController.getListingByID);
router.post("/add", listingController.addListing);
router.post('/buy/:sellerWeaponID', tradeController.BuyListedSkin);

module.exports = router;