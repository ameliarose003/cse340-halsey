import { getFacultyBySlug, getSortedFaculty } from '../../models/faculty/faculty.js';

/**
 * Helper function to add styles specific to the faculty pages only
 */
const addFacultySpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/faculty.css">');
};

const facultyListPage = async (req, res) => {
    // Default to sorting by name if no valid sort option is provided
    const validSortOptions = ['name', 'department', 'title'];
    const sortBy = validSortOptions.includes(req.query.sort) ? req.query.sort : 'name';

    // Fetch sorted faculty list
    const facultyList = await getSortedFaculty(sortBy);

    addFacultySpecificStyles(res);

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

    addFacultySpecificStyles(res);

    res.render('faculty/detail', { 
        title: facultyMember.name,
        facultyMember
    });

};


// Export both functions
export { facultyDetailPage, facultyListPage };