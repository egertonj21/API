const bcrypt = require('bcrypt');
require('dotenv').config({ path: './config.env' });
const { query } = require('./../utils/dbconn'); // Use the query function you defined

// Controller function to get user's hashed password (for login)
exports.getUserHashedPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const sql = 'SELECT password FROM user WHERE email = ?';
        const [user] = await query(sql, [email]);
        const hashedPassword = user.password;
        const match = await bcrypt.compare(password, hashedPassword);
        if (match) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
};

// Controller function to insert a new user
exports.postInsertUser = async (req, res) => {
    const { userName, email, password, phoneNumber, streetNumber, address1, address2, city, postCode, biometricData, identification } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const sql = 'INSERT INTO user (user_name, email, password, Phone_number, `Street Number`, Address1, Address2, City, Post_code, Biometric_data, Identification) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await query(sql, [userName, email, hashedPassword, phoneNumber, streetNumber, address1, address2, city, postCode, biometricData, identification]);
        res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'An error occurred while adding the user' });
    }
};

// Controller function to insert a new item
exports.postInsertItem = async (req, res) => {
    const { itemName, typeID, brandID, description, susID, certificateOfAuth, status, yearMade, quantityMade } = req.body;
    try {
        const sql = 'INSERT INTO item (Item_name, TypeID, BrandID, Description, SusID, `Certificate of Auth`, Status, Year_made, Quantity_made) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await query(sql, [itemName, typeID, brandID, description, susID, certificateOfAuth, status, yearMade, quantityMade]);
        res.status(201).json({ message: 'Item added successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'An error occurred while adding the item' });
    }
};

// Controller function to insert a new brand
exports.postInsertBrand = async (req, res) => {
    const { brandName } = req.body;
    try {
        const sql = 'INSERT INTO brand (Brand_name) VALUES (?)';
        await query(sql, [brandName]);
        res.status(201).json({ message: 'Brand added successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'An error occurred while adding the brand' });
    }
};

// Controller function to insert a new type
exports.postInsertType = async (req, res) => {
    const { name } = req.body;
    try {
        const sql = 'INSERT INTO type (Name) VALUES (?)';
        await query(sql, [name]);
        res.status(201).json({ message: 'Type added successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'An error occurred while adding the type' });
    }
};

// Controller function to insert a new award
exports.postInsertAward = async (req, res) => {
    const { awardName } = req.body;
    try {
        const sql = 'INSERT INTO sustainability (`Award Name`) VALUES (?)';
        await query(sql, [awardName]);
        res.status(201).json({ message: 'Award added successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'An error occurred while adding the award' });
    }
};

exports.postPurchase = async (req, res) => {
    const { userId, itemId, purchaseDate } = req.body;
    try {
        // Check if the item has been purchased previously by any user
        const checkSql = 'SELECT * FROM purchases WHERE itemID = ?';
        const existingPurchases = await query(checkSql, [itemId]);

        if (existingPurchases.length > 0) {
            // If the item has been purchased previously, delete the existing purchase(s)
            const deleteSql = 'DELETE FROM purchases WHERE itemID = ?';
            await query(deleteSql, [itemId]);

            // Update the times_sold column in the item table
            const updateItemSql = 'UPDATE item SET Times_sold = Times_sold + 1 WHERE ItemID = ?';
            await query(updateItemSql, [itemId]);
        }
        
        // Insert the new purchase (regardless of whether an old one was deleted)
        const insertSql = 'INSERT INTO purchases (userID, itemID, timestamp) VALUES (?, ?, NOW())';
        await query(insertSql, [userId, itemId, purchaseDate]);
        res.status(201).json({ message: 'Purchase recorded successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'An error occurred during the purchase process' });
    }
};



exports.postUpdateStatus = async (req, res) => {
    const { itemId, newStatus } = req.body;
    try {
        console.log(`Updating item ${itemId} to status ${newStatus}`);
        const sql = 'UPDATE item SET Status = ? WHERE itemID = ?';
        const result = await query(sql, [newStatus, itemId]);
        console.log('Update result:', result);
        if (result.affectedRows === 0) {
            // No rows were updated, which means the itemID might not exist
            return res.status(404).json({ message: 'Item not found or no changes made' });
        }
        res.status(200).json({ message: 'Item status updated successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'An error occurred while updating the item status' });
    }
};


