// require the model



const listingModel = require("../models/listingModel");


// this is used on the main market page, to retrieve all the listings that are currently on the market
function getAllListings(req, res, next) {
  console.log("getting all listings");
  listingModel
    .getAllListings()
    .then((listings) => {
      console.table(listings);
      res.json(listings);
    })
    .catch((err) => {
      res.status(404);
      next(err);
    });
}



// used on the "CT-Side-weapons" page, to retrieve all the currently listed CT weapons
function getCTListings(req, res, next) {
  listingModel
    .getListingByTeam("CT")
    .then((listing) => {
      res.json(listing);
    })
    .catch((err) => {
      res.status(404);
      next(err);
    });
}

// used on the "CT-Side-weapons" page, to retrieve all the currently listed T weapons

function getTListings(req, res, next) {
  listingModel
    .getListingByTeam("T")
    .then((listing) => {
      res.json(listing);
    })
    .catch((err) => {
      res.status(404);
      next(err);
    });
}


// used to get the data of a specific listed skin (price etc.), so that the user can see the details of the skin, and then buy it

function getListingByID(req, res, next) { // ID is the SellerWeaponID
  listingModel
    .getListingById(parseInt(req.params.id))
    .then((listing) => {
      console.table(listing);
      res.json(listing);
    })
    .catch((err) => {
      res.status(404);
      next(err);
    });
}


// used from the inventory of the user, when the user wants to sell a skin for a specified price

function addListing(req, res, next) {
  listingModel
    .addListing(req.body) // req.body is the data from the form, is then parsed into "listingData" in the model
    .then((listing) => {
      res.json(listing);
    })
    .catch((err) => {
      res.status(404);
      next(err);
    });
}

module.exports = {
  getAllListings,
  getCTListings,
  getTListings,
  getListingByID,
  addListing,
};
