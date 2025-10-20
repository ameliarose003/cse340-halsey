// Create src/controllers/faculty/faculty.js with route handlers for faculty list and detail pages. Follow the same pattern you used for the course controllers:


// Import the faculty model functions
import { getFacultyBySlug, getSortedFaculty } from '../../models/faculty/faculty.js';

const facultyListPage = async (req, res) => {
    // Default to sorting by name if no valid sort option is provided
    const validSortOptions = ['name', 'department', 'title'];
    const sortBy = validSortOptions.includes(req.query.sort) ? req.query.sort : 'name';

    // Fetch sorted faculty list
    const facultyList = await getSortedFaculty(sortBy);

    res.render('faculty/list', { 
        title: 'Faculty Directory',
        currentSort: sortBy,
        facultyList
    });
};

const facultyDetailPage = async (req, res, next) => {
    const facultySlug = req.params.facultyId;
    const facultyMember = await getFacultyBySlug(facultySlug);

    // Handle case where faculty member is not found
    if (!facultyMember || Object.keys(facultyMember).length === 0) {
        const err = new Error('Faculty Member Not Found');
        err.status = 404;
        return next(err);
    }

    res.render('faculty/detail', { 
        title: facultyMember.name,
        facultyMember
    });
};
// Export both functions
export { facultyDetailPage, facultyListPage };