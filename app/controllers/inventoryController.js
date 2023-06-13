const inventoryModel = require('../models/inventoryModel');


function getUserInventory(req,res,next){                // TODO: add the userID in the params of the request ( in the route )
    inventoryModel.getUserInventory(parseInt(req.params.id))
        .then((inventory)=>{
            res.json(inventory); // this was: res.render('inventory', {inventory});
        })
        .catch((err)=>{
            res.status(404);
            next(err);
        })

}

function changeSkinOwner(req,res,next){  // TODO: send the userID and sellerWeaponID in the body of the request
    inventoryModel.updateSkinOwner(req.body.sellerWeaponID, req.body.userID)
        .then((inventory)=>{
            res.json(inventory);
        })
        .catch((err)=>{
            res.status(404);
            next(err);
        })

}

module.exports = {
    getUserInventory,
    changeSkinOwner,

}