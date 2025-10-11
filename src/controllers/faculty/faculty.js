// Create src/controllers/faculty/faculty.js with route handlers for faculty list and detail pages. Follow the same pattern you used for the course controllers:


// Import the faculty model functions
import { getFacultyById, getSortedFaculty } from '../../models/faculty/faculty.js';

// Create a facultyListPage function that renders the faculty list page
const facultyListPage = (req, res) => {
    const sortBy = req.query.sort || 'department';
    const faculty = getSortedFaculty(sortBy);
    
    res.render('faculty/list', {
        title: 'Faculty',
        faculty: faculty,
        currentSort: sortBy
    });
};

// Create a facultyDetailPage function that uses route parameters to look up individual faculty
const facultyDetailPage = (req, res, next) => {
    const facultyId = req.params.facultyId;
    const faculty = getFacultyById(facultyId);

    // Include proper error handling for invalid faculty IDs
    if (!faculty) {
        const err = new Error(`Faculty ${facultyId} not found`);
        err.status = 404;
        return next(err);
    }
    
    
    res.render('faculty/detail', {
        title: `${faculty.name} - ${faculty.title}`,
        faculty: faculty
    });
}
// Export both functions
export { facultyDetailPage, facultyListPage };