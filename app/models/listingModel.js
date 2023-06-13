const db = require('../config/database').config;

let getAllListings = () => new Promise(async (resolve,reject)=>{
    let sql = `SELECT * FROM CCL_listings`;
    db.query(sql, function (err, listing, fields){
        if(err){
            reject(err);
        }
        resolve(listing[0]);
    });
});

// get all info by a specific listing:
// SELECT * FROM CCL_listings INNER JOIN CCL_inventory ON CCL_listings.sellerWeaponID = CCL_inventory.userWeaponID INNER JOIN CCL_weapons ON CCL_inventory.weaponID = CCL_weapons.id WHERE [key] = [value]
let getListingByTeam = (Team) => new Promise(async (resolve,reject)=>{

    let sql = "SELECT * FROM CCL_listings INNER JOIN CCL_inventory ON CCL_listings.sellerWeaponID = CCL_inventory.userWeaponID INNER JOIN CCL_weapons ON CCL_inventory.weaponID = CCL_weapons.id WHERE CCL_weapons.team = " + db.escape(Team);
    console.log(sql);

    db.query(sql, function (err, listing, fields){
        if(err){
            reject(err);
        }
        resolve(listing);
    });

});
let addListing = (listingData) => new Promise( async (resolve,reject)=> {

    let sql = "INSERT INTO CCL_listings (sellerID, sellerWeaponID, price) VALUES (" +
        db.escape(listingData.team) + ",  " +
        db.escape(listingData.price)+ ",  "  +
        db.escape(listingData.weaponID)+ ")" ;
    console.log(sql);

    db.query(sql, function (err, result, fields){
        if(err) {
            reject(err)
        }
        resolve(listingData)
    });

});

module.exports = {
    getAllListings,
    getListingByTeam,
    addListing,
}