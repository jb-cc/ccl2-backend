const listingModel = require("../models/listingModel");

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

function addListing(req, res, next) {
  listingModel
    .addListing(req.body) // req.body is the data from the form, is then parsed into "listingData" in the model
    .then((listing) => {
      res.json(listing); // redirect to /listings??
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
