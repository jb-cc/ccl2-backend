const router = require("express").Router();

const listingController = require("../controllers/listingController.js");
const tradeController = require("../controllers/tradeController.js");

router.get("/", listingController.getAllListings);
router.get("/CT", listingController.getCTListings);
router.get("/T", listingController.getTListings);
router.get("/item/:id", listingController.getListingByID);
router.post("/add", listingController.addListing);
router.post('/buy/:sellerWeaponID', tradeController.BuyListedSkin);

module.exports = router;