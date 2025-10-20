import { getAllCourses, getCourseBySlug } from '../../models/catalog/courses.js';
import { getSortedSections } from '../../models/catalog/catalog.js';

// Route handler for the course catalog list page
const catalogPage = async (req, res) => {
    const courses = await getAllCourses();

    res.render('catalog/catalog', {
        title: 'Course Catalog',
        courses: courses
    });
};

// Route handler for individual course detail pages
const courseDetailPage = async (req, res, next) => {
    const courseSlug = req.params.courseId;
    const course = await getCourseBySlug(courseSlug);
    
    // If course doesn't exist, create 404 error
    if (!course || Object.keys(course).length === 0) {
        const err = new Error(`Course ${courseSlug} not found`);
        err.status = 404;
        return next(err);
    }

    // Handle sorting if requested
    const sortBy = req.query.sort || 'time';
    const sections = await getSortedSections(courseSlug, sortBy);

    res.render('catalog/course-detail', {
        title: `${course.course_code} - ${course.name}`,
        course: course,
        sections: sections,
        currentSort: sortBy
    });
};

export { catalogPage, courseDetailPage };