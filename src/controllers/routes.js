import { Router } from 'express';


// Create a new router instance
const router = Router();

import { addDemoHeaders } from '../middleware/demo/headers.js';
import { catalogPage, courseDetailPage } from './catalog/catalog.js';
import { facultyDetailPage, facultyListPage } from './faculty/faculty.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';
import { showContactForm, processContactForm, showContactResponses, contactValidation } from './forms/contact.js';
import { showRegistrationForm, processRegistration, showAllUsers,showEditAccountForm,
    processEditAccount, processDeleteAccount, registrationValidation, updateAccountValidation } from './forms/registration.js';
import { requireLogin, requireRole } from '../middleware/auth.js';
import { 
    showLoginForm, 
    processLogin, 
    processLogout, 
    showDashboard, 
    loginValidation 
} from './forms/login.js';

// Home and basic pages
router.get('/', homePage);
router.get('/about', aboutPage);

// Course catalog routes
router.get('/catalog', catalogPage);
router.get('/catalog/:courseId', courseDetailPage);

// Faculty routes
router.get('/faculty', facultyListPage);
router.get('/faculty/:facultyId', facultyDetailPage);

// Contact form routes
router.get('/contact', showContactForm);
router.post('/contact', contactValidation, processContactForm);
router.get('/contact/responses', requireLogin, showContactResponses);

// User registration routes
router.get('/register', showRegistrationForm);
router.post('/register', registrationValidation, processRegistration);
//How do I get my users page to work both without being logged in and while logged in???
router.get('/users', showAllUsers);

// Account management routes
router.get('/users/:id/edit', requireLogin, showEditAccountForm);
router.post('/users/:id/update', requireLogin, updateAccountValidation, processEditAccount);
router.post('/users/:id/delete', requireRole('admin'), processDeleteAccount);

// Authentication routes
router.get('/login', showLoginForm);
router.post('/login', loginValidation, processLogin);
router.get('/logout', processLogout);

// Protected routes (require authentication)
router.get('/dashboard', requireLogin, showDashboard);

// Demo page with special middleware
router.get('/demo', addDemoHeaders, demoPage);

// Route to trigger a test error
router.get('/test-error', testErrorPage);

export default router;


// Create Faculty Routes
// Update your src/routes.js file to include the faculty routes:

// Import your faculty controllers
// Add a /faculty route for the faculty list
// Add a /faculty/:facultyId route for individual faculty details
