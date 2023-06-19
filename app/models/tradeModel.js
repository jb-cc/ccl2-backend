const db = require('../config/database').config;




function handleTransaction(req, res) {
    console.log('body: '+req.body)
    const buyerID = req.body.buyerID;

    db.beginTransaction(function(err) {
        if (err) {
            res.status(500).json({ message: "Error starting transaction" });
            return;
        }

        db.query('SELECT * FROM CCL_listings WHERE sellerWeaponID = ?', [req.params.sellerWeaponID], (error, listingRows) => {
            if (error) {
                return db.rollback(function() {
                    res.status(500).json({ message: "Error occurred while fetching listing" });
                });
            }

            if (listingRows.length === 0) {
                return db.rollback(function() {
                    res.status(400).json({ message: "Listing not found" });
                });
            }

            const listing = listingRows[0];
            const sellerWeaponID = listing.sellerWeaponID;
            const sellerID = listing.sellerID;
            const price = listing.price;

            db.query('SELECT * FROM CCL_users WHERE id = ?', [buyerID], (error, buyerRows) => {
                if (error) {
                    return db.rollback(function() {
                        res.status(500).json({ message: "Error occurred while fetching buyer" });
                    });
                }

                if (buyerRows.length === 0) {
                    return db.rollback(function() {
                        res.status(400).json({ message: "Buyer not found" });
                    });
                }

                const buyer = buyerRows[0];
                if (buyer.balance < price) {
                    return db.rollback(function() {
                        res.status(400).json({ message: "Buyer does not have enough money" });
                    });
                }

                // Update the sellerWeaponID with the buyerID
                db.query('UPDATE CCL_inventory SET userID = ? WHERE userWeaponID = ?', [buyerID, sellerWeaponID], (error) => {
                    if (error) {
                        return db.rollback(function() {
                            res.status(500).json({ message: "Error occurred while transferring weapon ownership" });
                        });
                    }

                    // Delete the listing
                    db.query('DELETE FROM CCL_listings WHERE sellerWeaponID = ?', [sellerWeaponID], (error) => {
                        if (error) {
                            return db.rollback(function() {
                                res.status(500).json({ message: "Error occurred while deleting listing" });
                            });
                        }

                        // Update the buyer's and seller's money
                        db.query('UPDATE CCL_users SET balance = balance - ? WHERE id = ?', [price, buyerID], (error) => {
                            if (error) {
                                return db.rollback(function() {
                                    res.status(500).json({ message: "Error occurred while updating buyer's money" });
                                });
                            }

                            db.query('UPDATE CCL_users SET balance = balance + ? WHERE id = ?', [price, sellerID], (error) => {
                                if (error) {
                                    return db.rollback(function() {
                                        res.status(500).json({ message:"Error occurred while updating seller's money" });
                                    });
                                }

                                db.commit(function(err) {
                                    if (err) {
                                        return db.rollback(function() {
                                            res.status(500).json({ message: "Error committing transaction" });
                                        });
                                    }
                                    console.log('Transaction Complete.')
                                    res.status(200).json({ message: "Transaction successful" });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

module.exports = {
    handleTransaction,
}
