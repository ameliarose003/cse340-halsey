import { body, validationResult } from 'express-validator';
import { hashPassword, emailExists, saveUser, getAllUsers } from '../../models/forms/registration.js';

/**
 * Comprehensive validation rules for user registration
 */
const registrationValidation = [
    body('name')
        .trim()
        .isLength({ min: 7 })
        .withMessage('Name must be at least 7 characters long'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('confirmEmail')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid confirmation email')
        .normalizeEmail()
        .custom((value, { req }) => {
            if (value !== req.body.email) {
                throw new Error('Email addresses do not match');
            }
            return true;
        }),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)
        .withMessage('Password must contain at least one number and one symbol (!@#$%^&*)'),

    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

const addRegistrationSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
};
/**
 * Display the registration form
 */

const showRegistrationForm = (req, res) => {
    // TODO: Add registration-specific styles using res.addStyle()
    addRegistrationSpecificStyles(res);
    // TODO: Render the registration form view (forms/registration/form)
    res.render('forms/registration/form', {
        title: 'Registration'
    });
};

/**
 * Process user registration submission
 */
const processRegistration = async (req, res) => {

    try {

        // TODO: Check for validation errors using validationResult(req)
        const errors = validationResult(req);
        
        // TODO: If errors exist, redirect back to registration form
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.redirect('/register');
        }
        // TODO: Extract name, email, password from req.body
        const {name, email, password} = req.body;
        // TODO: Check if email already exists using emailExists()
        const emailTaken = await emailExists(email);
        // TODO: If email exists, log message and redirect back
        if (emailTaken) {
            console.log('Email already exists:', email);
            return res.redirect('/register');
        }
        // TODO: Save the user using saveUser()
        const savedUser = await saveUser(name, email, password);
        // TODO: If save fails, log error and redirect back
        if (!savedUser) {
            console.log('Failed to save user.');
            return res.redirect('/register');
        }
        // TODO: If successful, log success and redirect (maybe to users list?)
        console.log('User registered:', savedUser);
        res.redirect('/users');
    }
    // used try / catch to handle any unexpected errors in the function. 
    catch (error) {
        console.error('Error in processRegistration:', error);
        return res.redirect('/register');
    }
};

/**
 * Display all registered users
 */
const showAllUsers = async (req, res) => {
    // TODO: Get all users using getAllUsers()
    const allRegisteredUsers = await getAllUsers();
    // TODO: Add registration-specific styles
    addRegistrationSpecificStyles(res);
    // TODO: Render the users list view (forms/registration/list) with the user data
    res.render('forms/registration/list', {
        title: 'Registered Users',
        allRegisteredUsers: allRegisteredUsers
    });
};

export { showRegistrationForm, processRegistration, showAllUsers, registrationValidation };