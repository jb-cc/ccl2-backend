const db = require("../config/database").config;

let getAllListings = () =>
  new Promise(async (resolve, reject) => {
    let sql = `SELECT * FROM CCL_listings INNER JOIN CCL_inventory ON CCL_listings.sellerWeaponID = CCL_inventory.userWeaponID INNER JOIN CCL_weapons ON CCL_inventory.weaponID = CCL_weapons.id`;
    db.query(sql, function (err, listings, fields) {
      if (err) {
        reject(err);
      }
      console.log(sql)
      resolve(listings);
    });
  });

// get all info by a specific listing:
// SELECT * FROM CCL_listings INNER JOIN CCL_inventory ON CCL_listings.sellerWeaponID = CCL_inventory.userWeaponID INNER JOIN CCL_weapons ON CCL_inventory.weaponID = CCL_weapons.id WHERE [key] = [value]
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

let addListing = (listingData) =>
  new Promise(async (resolve, reject) => {
    let sql =
      "INSERT INTO CCL_listings (sellerID, sellerWeaponID, price) VALUES (" + // TODO: get the specific sellerWeaponID from the inventory table when clicking on an item in the inventory
      db.escape(listingData.team) +
      ",  " +
      db.escape(listingData.price) +
      ",  " +
      db.escape(listingData.weaponID) +
      ")";
    console.log(sql);

    db.query(sql, function (err, result, fields) {
      if (err) {
        reject(err);
      }
      resolve(listingData);
    });
  });

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

let deleteListingById = (id) =>
  new Promise(async (resolve, reject) => {
    let sql = "DELETE FROM CCL_listings WHERE id = " + db.escape(id);
    console.log(sql);

    db.query(sql, function (err, result, fields) {
      if (err) {
        reject(err);
      }
      resolve(); // I don't think we need to return anything here
    });
  });

module.exports = {
  getAllListings,
  getListingByTeam,
  addListing,
  getListingById,
  deleteListingById,
};
