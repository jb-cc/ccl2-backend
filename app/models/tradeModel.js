// require database connection

const db = require("../config/database").config;


// This function gets called, when a user clicks on a skin on the market, and then clicks on the "Buy" button.
// Because the function is complex, and involves multiple database operations, it is wrapped in a transaction.
// If any of the steps fail, the transaction is rolled back and an error response is sent.

// The function:
// 1. Starts a database transaction to ensure that the series of operations are executed atomically.
// 2. Retrieves the skin listing from the database using the sellerWeaponID provided in the request parameters.
// 3. Retrieves the buyer information using the buyerID provided in the request body
// 4. Checks if the buyer has enough balance to make the purchase.
// 5. Updates the ownership of the item by setting the userID in the inventory table from the seller's ID to the buyer's ID.
// 6. Updates the inventory to indicate that the item is no longer listed by setting isListed to 0.
// 7. Deletes the listing from the CCL_listings table.
// 8. Updates the buyers and sellers money
// 9. Commits the transaction if all the previous steps were successful.
// 10. Sends a success response if the transaction is successfully committed.


let BuyListedItem = (req, res) => {

    // Extract the buyer's ID from the request body
    const buyerID = req.body.buyerID;

    // Start a database transaction
    db.beginTransaction(function (err) {

        // Send an error response if transaction start fails
        if (err) {
            res.status(500).json({message: "Error starting transaction"});
            return;
        }

        // Query to get the listing based on sellerWeaponID
        db.query(
            "SELECT * FROM CCL_listings WHERE sellerWeaponID = ?",
            [parseInt(req.params.sellerWeaponID)],
            (error, listingRows) => {
                if (error) {
                    console.error(error);

                    // Rollback transaction if there is an error fetching listing
                    return db.rollback(function () {
                        res
                            .status(500)
                            .json({message: "Error occurred while fetching listing"});
                    });
                }

                if (listingRows.length === 0) {

                    // Rollback transaction if listing not found
                    console.log("listingRows: " + listingRows);
                    console.log("listing not found");
                    return db.rollback(function () {
                        res.status(400).json({message: "Listing not found"});
                    });
                }

                // Extract listing details from the query result
                const listing = listingRows[0];
                const sellerWeaponID = listing.sellerWeaponID;
                const sellerID = listing.sellerID;
                console.log("sellerID: " + sellerID);
                const price = listing.price;

                // Query to get buyer details based on buyerID
                db.query(
                    "SELECT * FROM CCL_users WHERE id = ?",
                    [buyerID],
                    (error, buyerRows) => {
                        if (error) {

                            // Rollback transaction if there is an error fetching buyer
                            return db.rollback(function () {
                                res
                                    .status(500)
                                    .json({message: "Error occurred while fetching buyer"});
                            });
                        }
                        // roll back transaction if buyer not found
                        if (buyerRows.length === 0) {
                            return db.rollback(function () {
                                res.status(400).json({message: "Buyer not found"});
                            });
                        }


                        const buyer = buyerRows[0];

                        // Check if buyer has enough balance to make the purchase
                        if (buyer.balance < price) {

                            // Rollback transaction if buyer does not have enough money
                            return db.rollback(function () {
                                res
                                    .status(400)
                                    .json({message: "Buyer does not have enough money"});
                            });
                        }

                        // Update the sellerWeaponID with the buyerID
                        db.query(
                            "UPDATE CCL_inventory SET userID = ? WHERE userWeaponID = ?",
                            [buyerID, sellerWeaponID],
                            (error) => {
                                if (error) {

                                    // Rollback transaction if there is an error transferring weapon ownership
                                    return db.rollback(function () {
                                        res.status(500).json({
                                            message:
                                                "Error occurred while transferring weapon ownership",
                                        });
                                    });
                                }

                                // Set isListed to 0 to show the item is no longer listed (needed for a frontend button, also for better understanding of the database)
                                db.query(
                                    "UPDATE CCL_inventory SET isListed = ? WHERE userWeaponID = ?",
                                    [0, sellerWeaponID],
                                    (error) => {
                                        if (error) {
                                            // Rollback transaction if there is an error setting isListed to 0

                                            return db.rollback(function () {
                                                res.status(500).json({
                                                    message: "Error occurred while setting isListed to 0",
                                                });
                                            });
                                        }

                                        console.log("item transaction finished");

                                        // Delete the listing
                                        db.query(
                                            "DELETE FROM CCL_listings WHERE sellerWeaponID = ?",
                                            [sellerWeaponID],
                                            (error) => {
                                                if (error) {
                                                    return db.rollback(function () {
                                                        res.status(500).json({
                                                            message: "Error occurred while deleting listing",
                                                        });
                                                    });
                                                }

                                                // Update the buyers and sellers money
                                                db.query(
                                                    "UPDATE CCL_users SET balance = balance - ? WHERE id = ?",
                                                    [price, buyerID],
                                                    (error) => {
                                                        if (error) {
                                                            return db.rollback(function () {
                                                                res.status(500).json({
                                                                    message:
                                                                        "Error occurred while updating buyer's money",
                                                                });
                                                            });
                                                        }

                                                        db.query(
                                                            "UPDATE CCL_users SET balance = balance + ? WHERE id = ?",
                                                            [price, sellerID],
                                                            (error) => {
                                                                if (error) {
                                                                    return db.rollback(function () {
                                                                        res.status(500).json({
                                                                            message:
                                                                                "Error occurred while updating seller's money",
                                                                        });
                                                                    });
                                                                }

                                                                // Commit the transaction if all steps are successful
                                                                db.commit(function (err) {
                                                                    if (err) {
                                                                        return db.rollback(function () {
                                                                            res.status(500).json({
                                                                                message: "Error committing transaction",
                                                                            });
                                                                        });
                                                                    }

                                                                    // Send a success response if transaction is successful
                                                                    console.log("Transaction Complete.");
                                                                    res.status(200).json({
                                                                        message: "Transaction successful",
                                                                    });
                                                                });
                                                            }
                                                        );
                                                    }
                                                );
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    });
};

module.exports = {
    BuyListedItem,
};