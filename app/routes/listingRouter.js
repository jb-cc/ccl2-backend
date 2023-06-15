const express = require("express");
const router = require("express").Router();

const listingController = require("../controllers/listingController.js");

router.get("/", listingController.getAllListings);
router.get("/CT", listingController.getCTListings);
router.get("/T", listingController.getTListings);
router.get("/item/:id", listingController.getListingByID);

module.exports = router;