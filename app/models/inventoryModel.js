//database access

const db = require('../config/database').config;

let getUserInventory = (id) => new Promise((resolve, reject) => { // the ID is the user ID
    db.query(`SELECT CCL_inventory.userWeaponID, CCL_weapons.id, CCL_weapons.image, CCL_weapons.rarity, CCL_weapons.name FROM CCL_inventory
            INNER JOIN CCL_weapons
            ON CCL_inventory.weaponID = CCL_weapons.id
            WHERE CCL_inventory.userID =${id};`, function (err, inventory, fields) {
        if (err) {
            reject(err);
        }
        resolve(inventory);
    });
});

let updateSkinOwner = (sellerWeaponID, buyerID) => new Promise((resolve, reject) => {
    db.query(`UPDATE CCL_inventory SET userID = ${buyerID} WHERE userWeaponID = ${sellerWeaponID};`, function (err, inventory, fields) {
        if (err) {
            reject(err);
        }
        resolve(); // don't need to return anything, because only metadata would be returned
    });
});

let getItemByUserWeaponID = (userWeaponID) => new Promise((resolve, reject) => {
        db.query(`SELECT * FROM CCL_inventory WHERE userWeaponID = ${userWeaponID};`, function (err, item, fields) {
            if (err) {
                console.log('error in sql query: '+err)
                reject(err);
            }
            resolve(item);
        });
    }
);

module.exports = {
    getUserInventory,
    updateSkinOwner,
    getItemByUserWeaponID
}