//database access

const db = require('../config/database').config;

let getUserInventory = (id) => new Promise((resolve,reject)=>{ // the ID is the user ID
    db.query(`SELECT CCL_inventory.userWeaponID, CCL_weapons.id, CCL_weapons.image, CCL_weapons.rarity, CCL_weapons.name FROM CCL_inventory
            INNER JOIN CCL_weapons
            ON CCL_inventory.weaponID = CCL_weapons.id
            WHERE CCL_inventory.userID =${id};`, function (err, inventory, fields){
        if(err){
            reject(err);
        }
        resolve(inventory);
    });
});


module.exports= {
    getUserInventory
}