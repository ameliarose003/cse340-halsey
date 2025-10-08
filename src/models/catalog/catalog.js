// Enhanced course data object
const courses = {
    'CS121': {
        id: 'CS121',
        title: 'Introduction to Programming',
        department: 'Computer Science',
        description: 'Learn programming fundamentals using JavaScript and basic web development concepts.',
        credits: 3,
        sections: [
            { time: '9:00 AM', room: 'STC 392', professor: 'Brother Jack' },
            { time: '2:00 PM', room: 'STC 394', professor: 'Sister Enkey' },
            { time: '11:00 AM', room: 'STC 390', professor: 'Brother Keers' }
        ]
    },
    'CS162': {
        id: 'CS162',
        title: 'Introduction to Computer Science',
        department: 'Computer Science', 
        description: 'Object-oriented programming concepts and software development practices.',
        credits: 3,
        sections: [
            { time: '10:00 AM', room: 'STC 392', professor: 'Brother Miller' },
            { time: '1:00 PM', room: 'STC 394', professor: 'Brother Jack' },
            { time: '3:00 PM', room: 'STC 390', professor: 'Sister Anderson' }
        ]
    },
    'CS235': {
        id: 'CS235',
        title: 'Data Structures and Algorithms',
        department: 'Computer Science',
        description: 'Advanced programming concepts including data structures, algorithms, and complexity analysis.',
        credits: 3,
        sections: [
            { time: '8:00 AM', room: 'STC 392', professor: 'Brother Keers' },
            { time: '12:00 PM', room: 'STC 394', professor: 'Brother Miller' }
        ]
    },
    'MATH110': {
        id: 'MATH110',
        title: 'College Algebra',
        department: 'Mathematics',
        description: 'Fundamental algebraic concepts including functions, graphing, and problem solving.',
        credits: 4,
        sections: [
            { time: '8:00 AM', room: 'MC 301', professor: 'Sister Anderson' },
            { time: '1:00 PM', room: 'MC 305', professor: 'Brother Miller' },
            { time: '3:00 PM', room: 'MC 307', professor: 'Brother Thompson' }
        ]
    },
    'MATH111': {
        id: 'MATH111',
        title: 'Trigonometry',
        department: 'Mathematics',
        description: 'Trigonometric functions, identities, and applications to real-world problems.',
        credits: 3,
        sections: [
            { time: '9:00 AM', room: 'MC 301', professor: 'Brother Thompson' },
            { time: '2:00 PM', room: 'MC 305', professor: 'Sister Anderson' }
        ]
    },
    'ENG101': {
        id: 'ENG101',
        title: 'Academic Writing',
        department: 'English',
        description: 'Develop writing skills for academic and professional communication.',
        credits: 3,
        sections: [
            { time: '10:00 AM', room: 'GEB 201', professor: 'Sister Anderson' },
            { time: '12:00 PM', room: 'GEB 205', professor: 'Brother Davis' },
            { time: '4:00 PM', room: 'GEB 203', professor: 'Sister Enkey' }
        ]
    },
    'ENG102': {
        id: 'ENG102', 
        title: 'Composition and Literature',
        department: 'English',
        description: 'Advanced writing skills through the study of literature and critical analysis.',
        credits: 3,
        sections: [
            { time: '11:00 AM', room: 'GEB 201', professor: 'Brother Davis' },
            { time: '1:00 PM', room: 'GEB 205', professor: 'Sister Enkey' }
        ]
    },
    'HIST105': {
        id: 'HIST105',
        title: 'World History',
        department: 'History',
        description: 'Survey of world civilizations from ancient times to the present.',
        credits: 3,
        sections: [
            { time: '9:00 AM', room: 'GEB 301', professor: 'Brother Wilson' },
            { time: '2:00 PM', room: 'GEB 305', professor: 'Sister Roberts' }
        ]
    }
};

// Model functions that handle all data access

const getAllCourses = () => {
    return courses;
};

const getCourseById = (courseId) => {
    return courses[courseId] || null;
};

const getSortedSections = (sections, sortBy) => {
    const sortedSections = [...sections];

    switch (sortBy) {
        case 'professor':
            return sortedSections.sort((a, b) => a.professor.localeCompare(b.professor));
        case 'room':
            return sortedSections.sort((a, b) => a.room.localeCompare(b.room));
        case 'time':
        default:
            return sortedSections; // Keep original order
    }
};

const getCoursesByDepartment = () => {
    const departments = {};

    Object.values(courses).forEach(course => {
        if (!departments[course.department]) {
            departments[course.department] = [];
        }
        departments[course.department].push(course);
    });

    return departments;
};

export { getAllCourses, getCourseById, getSortedSections, getCoursesByDepartment };