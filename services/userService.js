const bcrypt = require('bcrypt');
const { query } = require('./../utils/dbconn');

exports.getHashedPassword = async (email) => {
    const selectSQL = 'SELECT hashed_password from users WHERE email = ?';
    const rows = await query(selectSQL, [email]);
    if (rows.length > 0) {
        return rows[0].hashed_password;
    } else {
        throw new Error('User not found');
    }
};

exports.comparePasswords = async (password, hashedPassword) => {
    
    const match = await bcrypt.compare(password, hashedPassword);
    if (match) {
        return true;
    } else {
        throw new Error('Incorrect password');
    }
};