const { Op } = require('sequelize')

const Course = require('../models/course');
const Enrollment = require('../models/enrollment');
const User = require('../models/user');
const userService = require('./user');

exports.getOne = async (identifier) => {
    try {
        const course = await Course.findOne({
            where: {
                [Op.or]: [
                    { id: identifier },
                    { code: identifier }
                ]
            }
        });
        return course;
    } catch (error) {
        console.log(error)
        return;
    }
};

exports.create = async (data) => {
    try {
        const { name, code, description, category, instructor, level, sections, duration, status } = data;
        const teacher = await userService.getOne(instructor);
        if (!teacher)
            throw new Error("Instructor doesn't exist.");
        if (teacher.role !== 'teacher')
            throw new Error("Instructor must be a teacher.");
        const existingCourse = await this.getOne(code);
        if (existingCourse)
            throw new Error("Course already exists.");
        const course = await Course.create({
            name,
            code,
            description,
            category,
            instructor,
            level,
            sections,
            duration,
            status: status ? status : "pending"
        });
        return course;
    } catch (error) {
        console.log(error)
        return;
    }
};

exports.delete = async (identifier) => {
    try {
        const numOfDeletedCourses = await Course.destroy({
            where: {
                [Op.or]: [
                    { id: identifier },
                    { code: identifier }
                ]
            }
        });
        return numOfDeletedCourses;
    } catch (error) {
        console.log(error);
        return;
    }
};

exports.getCourseStudents = async (courseId) => {
    try {
        const enrollment = await Enrollment.findAll({
            where: {
                courseId
            },
            include: [{
                model: User,
                attributes: ['firstName', 'lastName']
            }]
        })
        return enrollment;
    } catch (error) {
        console.log(error);
        return;
    }
};

exports.enroll = async (data) => {
    try {
        const { userId, courseId } = data;
        const enrollment = await Enrollment.create({
            userId,
            courseId
        });
        return enrollment;
    } catch (error) {
        console.log(error);
        return;
    }
};

exports.withdraw = async (identifier) => {
    try {
        let deletedRow = 0;
        if (typeof identifier == "object") {
            const { userId, courseId } = identifier;
            deletedRow = await Enrollment.destroy({
                where: {
                    [Op.and]: [
                        { userId: userId },
                        { courseId: courseId }
                    ]
                }
            });
        } else {
            deletedRow = await Enrollment.destroy({
                where: {
                    id: identifier
                }
            });
        }
        return deletedRow;
    } catch (error) {
        console.log(error);
        return;
    }
};

exports.getOneEnrollment = async (identifier) => {
    try {
        let enrollment;
        // if (typeof identifier == "object") {
        const { userId, courseId } = identifier;
        enrollment = await Enrollment.findOne({
            where: {
                [Op.and]: [
                    { userId: userId },
                    { courseId: courseId }
                ]
            }
        });
        // } else {
        //     enrollment = await Enrollment.findOne({
        //         where: {
        //             id: identifier
        //         }
        //     });
        // }
        return enrollment;
    } catch (error) {
        console.log(error);
        return;
    }
};

exports.getAll = async () => {
    try {
        const courses = await Course.findAll({
            attributes: ['id', 'name', 'code', 'description', 'category', 'instructor', 'level', 'sections', 'duration'],
            where: {
                status: 'approved'
            },
            include: [{
                model: User,
                attributes: ['firstName', 'lastName']
            }]
        })
        return courses;
    } catch (error) {
        console.log(error);
        return;
    }
};

exports.getPendingCourses = async () => {
    try {
        const courses = await Course.findAll({
            where: {
                status: 'pending'
            }
        });
        return courses;
    } catch (error) {
        console.log(error);
        return;
    }
};

exports.approveCourse = async (id, userId) => {
    try {
        const admin = await userService.getOne(userId);
        if (!admin)
            throw new Error("User doesn't exist.");
        if (admin.role !== 'admin')
            throw new Error("User must be an admin.");
        const course = await this.getOne(id);
        if (!course)
            throw new Error("Course doesn't exist.");
        if (course.status !== 'pending')
            throw new Error(`Course already ${course.status}`);
        course.status = 'approved';
        return await course.save();
    } catch (error) {
        console.log(error);
        return;
    }
};

exports.declineCourse = async (id, userId) => {
    try {
        const admin = await userService.getOne(userId);
        if (!admin)
            throw new Error("User doesn't exist.");
        if (admin.role !== 'admin')
            throw new Error("User must be an admin.");
        const course = await this.getOne(id);
        if (!course)
            throw new Error("Course doesn't exist.");
        if (course.status !== 'pending')
            throw new Error(`Course already ${course.status}`);
        course.status = 'declined';
        return await course.save();
    } catch (error) {
        console.log(error);
        return;
    }
};

exports.update = async (data) => {
    try {
        if (data.role !== 'admin') {
            delete data.status;
            delete data.instructor;
        }
        const updated = {
            ...data
        };
        delete updated.id;
        delete updated.role;
        if (updated.code) {
            const course = await this.getOne(updated.code);
            if (course)
                throw new Error("Course code already exists.");
        }
        if (updated.instructor) {
            const instructor = await userService.getOne(updated.instructor);
            if (!instructor)
                throw new Error("Instructor doesn't exist.");
            if (instructor.role !== "teacher")
                throw new Error("User isn't a teacher.");
        }
        const isUpdated = await Course.update(updated, {
            where: {
                id: data.id
            }
        });
        return isUpdated;
    } catch (error) {
        console.log(error);
        return;
    }
};

exports.getDeclined = async () => {
    try {
        const courses = await Course.findAll({
            attributes: ['id', 'name', 'code', 'description', 'category', 'instructor', 'level', 'sections', 'duration'],
            where: {
                status: 'declined'
            },
            include: [{
                model: User,
                attributes: ['firstName', 'lastName']
            }]
        });
        return courses;
    } catch (error) {
        console.log(error);
        return;
    }
}