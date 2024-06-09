const courseService = require('./../services/course');
const userService = require('./../services/user');

exports.getOne = async (req, res) => {
    try {
        const identifier = req.params.id;
        const course = await courseService.getOne(identifier);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json({ message: "Course Retrieved Successfully", course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.create = async (req, res) => {
    try {
        const { name, code, description, category, materials, instructor, level, sections, duration } = req.body;
        const data = {
            name,
            code,
            description,
            category,
            materials,
            instructor,
            level,
            sections,
            duration
        };
        const existingUser = await userService.getOne(instructor);
        if (!existingUser)
            return res.status(400).json({ message: "Instructor doesn't exist." });
        const { role } = req.user;
        if (role == 'admin')
            data.status = "approved";
        const course = await courseService.create(data);
        if (!course)
            return res.status(400).json({ error: 'Course creation failed' });
        res.status(200).json({ message: "Course created successfully", course })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.deleteCourse = async (req, res) => {
    try {
        const identifier = req.params.id;
        const numOfDeletedCourses = await courseService.delete(identifier);
        if (numOfDeletedCourses == 0) {
            return res.status(404).json({ error: 'Course Deletion failed.' });
        }
        res.status(200).json({ message: "Course Deleted Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getCourseStudents = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const teacher = await userService.getOne(userId);
        if (!teacher)
            return res.status(400).json({ message: "Teacher doesn't exist." });
        const course = await courseService.getOne(id);
        if (!course)
            return res.status(400).json({ message: "Course doesn't exist." });
        if (course.instructor !== userId)
            return res.status(400).json({ message: "You are not the instructor of this course." });
        const enrolledStudents = await courseService.getCourseStudents(id);
        if (enrolledStudents.length == 0)
            return res.status(400).json({ message: "No enrolled students" })
        res.status(200).json({ message: "Retrieved students successfully.", enrolledStudents })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.enroll = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.body;
        const data = {
            userId,
            courseId
        }
        const user = await userService.getOne(userId);
        if (!user)
            return res.status(400).json({ message: "User doesn't exist." });
        const course = await courseService.getOne(courseId);
        if (!course)
            return res.status(400).json({ message: "Course doesn't exist." });
        if (course.status !== 'approved')
            return res.status(400).json({ message: "Course not available yet." });
        const alreadyEnrolled = await courseService.getOneEnrollment(data);
        if (alreadyEnrolled)
            return res.status(400).json({ message: "User already enrolled." });
        const enrollment = await courseService.enroll(data);
        if (!enrollment)
            return res.status(400).json({ error: 'Enrollment failed' });
        res.status(500).json({ message: "User enrolled successfully.", enrollment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.withdraw = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;
        const data = {
            userId,
            courseId
        }
        const user = await userService.getOne(userId);
        if (!user)
            return res.status(400).json({ message: "User doesn't exist." });
        const course = await courseService.getOne(courseId);
        if (!course)
            return res.status(400).json({ message: "Course doesn't exist." });
        if (course.status !== 'approved')
            return res.status(400).json({ message: "Course not available yet." });
        const alreadyEnrolled = await courseService.getOneEnrollment(data);
        if (!alreadyEnrolled)
            return res.status(400).json({ message: "User not enrolled." });
        const numOfDeletedEnrollments = await courseService.withdraw(data);
        if (numOfDeletedEnrollments == 0)
            return res.status(400).json({ error: 'Withdrawal failed.' });
        res.status(500).json({ message: "User withdrew successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAll = async (req, res) => {
    try {
        const courses = await courseService.getAll();
        if (!courses)
            return res.status(400).json({ message: "No courses available" });
        res.status(200).json({ message: "Retrieved courses successfully.", courses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getPendingCourses = async (req, res) => {
    try {
        const courses = await courseService.getPendingCourses();
        if (courses.length == 0)
            return res.status(400).json({ message: "No pending courses available" });
        res.status(200).json({ message: "Retrieved pending courses successfully.", courses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.approveCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const course = await courseService.getOne(id);
        if (!course)
            return res.status(400).json({ message: "Course doesn't exist." });
        const approvedCourse = await courseService.approveCourse(id, userId);
        if (!approvedCourse)
            return res.status(400).json({ error: 'Course approval failed' });
        res.status(200).json({ message: "Course approved successfully.", approvedCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.declineCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const course = await courseService.getOne(id);
        if (!course)
            return res.status(400).json({ message: "Course doesn't exist." });
        const declinedCourse = await courseService.declineCourse(id, userId);
        if (!declinedCourse)
            return res.status(400).json({ error: 'Course decline failed' });
        res.status(200).json({ message: "Course declined successfully.", declinedCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await courseService.getOne(id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        const data = {
            ...req.validatedBody
        };
        data.id = id;
        data.role = req.user.role;
        const updated = await courseService.update(data);
        if (!updated || !updated[0]) {
            return res.status(501).json({ error: 'fail to update course.' });
        }
        res.status(200).json({ message: "Course updated Successfully", updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getDeclined = async (req, res) => {
    try {
        const courses = await courseService.getDeclined();
        if (!courses)
            return res.status(400).json({ message: "No declined courses available" });
        res.status(200).json({ message: "Retrieved declined courses successfully.", courses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}