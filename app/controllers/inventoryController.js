const inventoryModel = require('../models/inventoryModel');


function getUserInventory(req,res,next){
    inventoryModel.getUserInventory(parseInt(req.params.id))
        .then((inventory)=>{
            res.json(inventory); // this was: res.render('inventory', {inventory});
        })
        .catch((err)=>{
            res.status(404);
            next(err);
        })

}

module.exports = {
    getUserInventory
}