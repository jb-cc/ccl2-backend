//database access

const db = require("../config/database").config;



// getUserInventory function:
// serves user inventory by getting the user's inventory from the database.
// the ID is the user ID


let getUserInventory = (id) =>
  new Promise((resolve, reject) => {
    // the ID is the user ID
    db.query(
      `SELECT CCL_inventory.userWeaponID, CCL_weapons.id, CCL_weapons.image, CCL_weapons.rarity, CCL_weapons.name FROM CCL_inventory
            INNER JOIN CCL_weapons
            ON CCL_inventory.weaponID = CCL_weapons.id
            WHERE CCL_inventory.userID =${id};`,
      function (err, inventory, fields) {
        if (err) {
          reject(err);
        }
        resolve(inventory);
      }
    );
  });

// getItemByUserWeaponID function:
// sends back the item by user weapon ID.
// Important: the userWeaponID is the unique ID of the item in the inventory. It is not the weapon ID.
// The userWeaponID is the primary key of the CCL_inventory table, and is auto incremented. Any item is only unique while a user has it in their inventory.
// You can imagine the ccl_weapons table as a collection of blueprints for weapons, and the ccl_inventory table as actual manufactured weapons that are in the user's inventory.


let getItemByUserWeaponID = (userWeaponID) =>
  new Promise((resolve, reject) => {
    const sql = `SELECT * FROM CCL_inventory INNER JOIN CCL_weapons ON CCL_inventory.weaponID = CCL_weapons.id WHERE CCL_inventory.userWeaponID = ${userWeaponID};`;

    db.query(sql, function (err, item, fields) {
      if (err) {
        console.log("error in sql query: " + err);
        reject(err);
      }
      resolve(item);
    });
  });

module.exports = {
  getUserInventory,
  getItemByUserWeaponID,
};
