//  require the database connection


const db = require("../config/database").config;


// getAllListings function:
// serves all listings by getting all listings from the database. Used for the main page of the marketplace.
let getAllListings = () =>
  new Promise(async (resolve, reject) => {
    let sql = `SELECT * FROM CCL_listings INNER JOIN CCL_inventory ON CCL_listings.sellerWeaponID = CCL_inventory.userWeaponID INNER JOIN CCL_weapons ON CCL_inventory.weaponID = CCL_weapons.id`;
    db.query(sql, function (err, listings, fields) {
      if (err) {
        reject(err);
      }
      console.log(sql);
      resolve(listings);
    });
  });


// getlistingByTeam function:
// serves listings by team by getting all listings from the database by team. Used for the T / CT  pages of the marketplace.

let getListingByTeam = (Team) =>
  new Promise(async (resolve, reject) => {
    let sql =
      "SELECT * FROM CCL_listings INNER JOIN CCL_inventory ON CCL_listings.sellerWeaponID = CCL_inventory.userWeaponID INNER JOIN CCL_weapons ON CCL_inventory.weaponID = CCL_weapons.id WHERE CCL_weapons.team = " +
      db.escape(Team);
    console.log(sql);

    db.query(sql, function (err, listing, fields) {
      if (err) {
        reject(err);
      }
      resolve(listing);
    });
  });


// addListing function:
// adds a listing to the database. Used when a user wants to sell an item. gets the sellerID, sellerWeaponID, and price from the request body. Also sets islIsted to 1 in the CCL_inventory table, which is used in the frontend to change the button from "sell" to "listed on market"


let addListing = (listingData) =>
  new Promise(async (resolve, reject) => {
    console.log("listingsData: " + listingData);
    let sql =
      "INSERT INTO CCL_listings (sellerID, sellerWeaponID, price) VALUES (" +
      db.escape(listingData.sellerID) +
      ",  " +
      db.escape(listingData.sellerWeaponID) +
      ",  " +
      db.escape(listingData.price) +
      ")";
    console.log(sql);

    db.query(sql, function (err, result, fields) {
      if (err) {
        return reject(err);
      }

      let sql2 =
        "UPDATE CCL_inventory SET isListed = " +
        1 +
        " WHERE userWeaponID = " +
        db.escape(listingData.sellerWeaponID);
      console.log(sql2);
      db.query(sql2, function (err, result, fields) {
        if (err) {
          return reject(err);
        }
        resolve(listingData);
      });
    });
  });


// getlistingById function:
// serves a listed skin by ID. Used for the listing page of the marketplace.
let getListingById = (sellerWeaponID) =>
  new Promise(async (resolve, reject) => {
    let sql =
      "SELECT * FROM CCL_listings INNER JOIN CCL_inventory ON CCL_listings.sellerWeaponID = CCL_inventory.userWeaponID INNER JOIN CCL_weapons ON CCL_inventory.weaponID = CCL_weapons.id WHERE CCL_listings.sellerWeaponID = " +
      db.escape(sellerWeaponID);
    console.log(sql);

    db.query(sql, function (err, listing, fields) {
      if (err) {
        reject(err);
      }
      resolve(listing);
    });
  });

// for later use:
// use this to get all info about a specific listing:
// SELECT * FROM CCL_listings INNER JOIN CCL_inventory ON CCL_listings.sellerWeaponID = CCL_inventory.userWeaponID INNER JOIN CCL_weapons ON CCL_inventory.weaponID = CCL_weapons.id WHERE [key] = [value]




module.exports = {
  getAllListings,
  getListingByTeam,
  addListing,
  getListingById,
};
