import { body, validationResult } from 'express-validator';
import { emailExists, saveUser, getAllUsers, getUserById, updateUser, deleteUser } from '../../models/forms/registration.js';


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

/**
 * Validation rules for account updates
 */
const updateAccountValidation = [
    body('name')
        .trim()
        .isLength({ min: 7 })
        .withMessage('Name must be at least 7 characters long'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
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
            req.flash('error')
            return res.redirect('/register');
        }
        // TODO: Extract name, email, password from req.body
        const {name, email, password} = req.body;
        // TODO: Check if email already exists using emailExists()
        const emailTaken = await emailExists(email);
        // TODO: If email exists, log message and redirect back
        if (emailTaken) {
            req.flash('warning', 'An account with this email already exists')
            return res.redirect('/register');
        }
        // TODO: Save the user using saveUser()
        const savedUser = await saveUser(name, email, password);
        // TODO: If save fails, log error and redirect back
        if (!savedUser) {
            req.flash('error', 'Failed to save user');
            return res.redirect('/register');
        }
        // TODO: If successful, log success and redirect (maybe to users list?)
        req.flash('success', 'Registration complete! You can now log in.')
        res.redirect('/users');
    }
    // used try / catch to handle any unexpected errors in the function. 
    catch (error) {
        req.flash('error', 'Error processing registration');
        return res.redirect('/register');
    }
};

/**
 * Display all registered users
 */
const showAllUsers = async (req, res) => {
    
    // TODO: Get all users using getAllUsers()
    const allRegisteredUsers = await getAllUsers();

        const user = req.session.user;

    // res.locals.currentUser = user;
    // Check if user is logged in via session
    if (req.session && req.session.user) {
        // User is authenticated - set UI state and continue
        res.locals.isLoggedIn = true;
        res.locals.currentUser = {
            id: user.id,
            role_name: user.role_name
        };
    } 
    // TODO: Add registration-specific styles
    addRegistrationSpecificStyles(res);
    // TODO: Render the users list view (forms/registration/list) with the user data
    res.render('forms/registration/list', {
        title: 'Registered Users',
        allRegisteredUsers: allRegisteredUsers
    });
};

/**
 * Display the edit account form
 * Users can edit their own account, admins can edit any account
 */
const showEditAccountForm = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;
    
    if (!currentUser) {
        req.flash('error', 'User not found.')
        return res.redirect('/users');
    };
    // TODO: Retrieve the target user from the database using getUserById
    const targetUser = await getUserById(targetUserId);
    // TODO: Check if the target user exists
    if (!targetUser) {
        // If not, set flash message and redirect to /users
        req.flash('error', 'User not found.')
        return res.redirect('/users');
    };

    // TODO: Determine if current user can edit this account
    // Users can edit their own (currentUser.id === targetUserId)
    // Admins can edit anyone (currentUser.role_name === 'admin')
    const isUser = currentUser.id === targetUserId;
    const isAdmin = currentUser.role_name === 'admin';
    // TODO: If current user cannot edit, set flash message and redirect
    if (!(isUser || isAdmin)) {
        req.flash('error', 'You do not have permission to edit this account.')
        return res.redirect('/');
    };

    // TODO: Render the edit form, passing the target user data
    addRegistrationSpecificStyles(res);
    res.render('forms/registration/edit', {
        title: 'Edit Account',
        user: targetUser
    });
};

/**
 * Process account edit form submission
 */
const processEditAccount = async (req, res) => {
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
        req.flash('error', 'Please correct the errors in the form.')
        // console.log(errors.array())
        return res.redirect(`/users/${req.params.id}/edit`);
    }

    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;
    const { name, email } = req.body;

    // TODO: Retrieve the target user to verify they exist
    const targetUser = await getUserById(targetUserId);
    // If not found, set flash message and redirect to /users
    if (!targetUser) {
        req.flash('error', 'User not found')
        return res.redirect('/users');
    }

    // TODO: Check edit permissions (same as showEditAccountForm)
    // If cannot edit, set flash message and redirect
    const isAdmin = currentUser.role_name === 'admin';
    const isUser = currentUser.id === targetUserId;

    if (!(isAdmin || isUser)) {
        req.flash('error', "You don't have permission to edit this account")
        return res.redirect('users');
    }

    // TODO: Check if the new email already exists for a DIFFERENT user
    // Hint: You need to verify the email isn't taken by someone else,
    // but it's okay if it matches the target user's current email
    // If email is taken, set flash message and redirect back to edit form    
    
    if (await emailExists(email)) {
        console.log(email, targetUser.email)
        req.flash('error', 'Email not available')
        return res.redirect(`/users/${req.params.id}/edit`);
    }


    // TODO: Update the user in the database using updateUser
    // If update fails, set flash message and redirect back to edit form
    const updatedUser = await updateUser(targetUserId, name, email);
    if (!updatedUser) {
        req.flash('error','Update failed');
        return res.redirect(`/users/${req.params.id}/edit`);
    }

    // TODO: If the current user edited their own account, update their session
    // Hint: Update req.session.user with the new name and email
    // const editingOwnAccount = targetUser === currentUser.id;
    // const adminEditingAccount = currentUser.role_name === 'admin';
    if (isUser) {
        req.session.user = {
            ...req.session.use,
            name: updatedUser.name,
            email: updatedUser.email
        }
    }

    // Success! Set flash message and redirect
    req.flash('success', 'Account updated successfully.');
    return res.redirect('/users');
};

/**
 * Delete a user account (admin only)
 */
const processDeleteAccount = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;

    if (!currentUser) {
        req.flash('error','Not logged in');
        return res.redirect('/login');
    }

    // TODO: Verify current user is an admin
    // Only admins should be able to delete accounts
    // If not admin, set flash message and redirect
    const isAdmin = currentUser.role_name === 'admin';
    if (!isAdmin) {
        req.flash('error','Need further permissions to access page.')
        return res.redirect('/')
    }

    // TODO: Prevent admins from deleting their own account
    // If targetUserId === currentUser.id, set flash message and redirect
    if (targetUserId === currentUser.id) {
        req.flash('error','You cannot delete your own account.')
        return res.redirect('/dashboard');
    }

    // TODO: Delete the user using deleteUser function
    // If delete fails, set flash message and redirect
    const deletedUser = await deleteUser(targetUserId);
    if (!deletedUser) {
        req.flash('error', 'User deletion failed')
        return res.redirect('/dashboard');
    }

    // Success! Set flash message and redirect
    req.flash('success', 'Account deleted successfully.')
    return res.redirect('/users');
};

export { 
    showRegistrationForm, 
    processRegistration, 
    showAllUsers, 
    registrationValidation,
    showEditAccountForm,
    processEditAccount,
    processDeleteAccount,
    updateAccountValidation
};