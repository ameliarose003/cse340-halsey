import db from '../db.js';
import bcrypt from 'bcrypt';

/**
 * Find a user by email address for login verification
 * @param {string} email - Email address to search for
 * @returns {Promise<Object|null>} User object with password hash or null if not found
 */


const findUserByEmail = async (email) => {
    const query = `
        SELECT 
            users.id, 
            users.name, 
            users.email, 
            users.password, 
            users.created_at,
            roles.role_name
        FROM users
        INNER JOIN roles ON users.role_id = roles.id
        WHERE LOWER(users.email) = LOWER($1)
        LIMIT 1
            `;

    try {
        // TODO: Return the user object if found, null otherwise
        const result = await db.query(query, [email]);
        return result.rows.length > 0 ? result.rows[0] : null;

    } catch (error) {
        console.error('DB Error in findUserByEmail:', error);
        return null;
    }
};

/**
 * Verify a plain text password against a stored bcrypt hash
 * @param {string} plainPassword - The password to verify
 * @param {string} hashedPassword - The stored password hash
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
    try {
        // TODO: Use bcrypt.compare() to verify the password
        const verify = bcrypt.compare(plainPassword, hashedPassword);
        // Return the result (true/false)
        return verify;

    } catch (error) {
        console.error('Error verifying password:', error);
        return false;
    }
};

export { findUserByEmail, verifyPassword };