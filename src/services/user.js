const { Op } = require('sequelize');

const User = require('../models/user');
const Course = require('../models/course');
const Enrollment = require('./../models/enrollment');
const hashPassword = require('./../utils/hashPassword');
const bcrypt = require('bcrypt');

const courseService = require('./course');

exports.getOne = async (identifier, getPassword) => {
    try {
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: identifier },
                    { username: identifier },
                    { id: identifier }
                ]
            }
        });
        if (user) {
            if (!getPassword) {
                user.password = undefined;
            }
        }
        return user;
    } catch (error) {
        console.error('Error retrieving user:', error.message);
        return;
    }
};

exports.create = async (data) => {
    try {
        const { firstName, lastName, email, password, role, dateOfBirth, nationality } = data;
        let username = firstName.substring(0, 1).toLowerCase() + lastName.substring(0, 1).toLowerCase() + Math.floor(Math.random() * 1000) + role.charAt(0).toUpperCase();
        const DOB = new Date(dateOfBirth);
        const currentTime = new Date();
        if (currentTime < DOB) {
            throw new Error('Date of birth must be earlier than current time.')
        }
        const user = await User.create({
            username,
            firstName,
            lastName,
            email,
            password,
            role,
            dateOfBirth,
            nationality
        });
        return user;
    } catch (error) {
        console.log(error);
        return;
    }
};

exports.getAll = async () => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        return users;
    } catch (error) {
        console.log(error);
        return;
    }
};

exports.deleteUser = async (data) => {
    try {
        if (data.role !== 'admin' && data.id != data.source)
            throw new Error('You are not authorized to delete this user');
        let isDeleted = await User.destroy({
            where: {
                id: data.id
            }
        });
        return isDeleted;
    } catch (error) {
        console.log(error);
        return;
    }
};

exports.update = async (data) => {
    try {
        if (data.role !== 'admin' && data.source !== data.id)
            throw new Error('You are not authorized to update this user');
        const updated = {
            ...data
        };
        delete updated.source;
        delete updated.id;
        if (updated.dateOfBirth) {
            const DOB = new Date(updated.dateOfBirth);
            const currentTime = new Date();
            if (currentTime < DOB) {
                throw new Error('Date of birth must be earlier than current time.')
            }
        }
        if (updated.verifiedToken) {
            if (updated.verified)
                delete updated.verified;
        }
        if (updated.username) {
            const existingUsername = await this.getOne(updated.username);
            if (existingUsername) {
                throw new Error('Username already exists.');
            }
        }
        if (updated.email) {
            const existingEmail = await this.getOne(updated.email);
            if (existingEmail) {
                throw new Error('Email already exists.');
            }
        }
        const isUpdated = await User.update(updated, {
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

exports.changePassword = async (info) => {
    try {
        const { oldPassword, newPassword, id } = info;
        const user = await this.getOne(id, true);
        if (!user)
            throw new Error("User doesn't exist.");
        const match = await bcrypt.compare(oldPassword, user.password)
        if (!match) {
            throw new Error('Incorrect password');
        }
        if (oldPassword == newPassword)
            throw new Error("New password can't be the same as old password");
        const newUser = await User.update({ password: newPassword }, {
            where: {
                id
            }
        });
        return newUser;
    } catch (error) {
        console.log(error);
        return;
    }
};

exports.getCourses = async (userId) => {
    try {
        const user = await this.getOne(userId);
        if (!user)
            throw new Error("User doesn't exist.");
        let enrollment;
        if (user.role === 'admin') {
            enrollment = courseService.getAll();
        }
        else if (user.role === 'student') {
            enrollment = await this.getStudentCourses(user.id);
        }
        else if (user.role === 'teacher') {
            enrollment = await this.getTeacherCourses(user.id);
        }
        return enrollment;
    } catch (error) {
        console.log(error);
        return;
    }
};

exports.getStudentCourses = async (userId) => {
    try {
        const user = await this.getOne(userId);
        if (!user)
            throw new Error("User doesn't exist.");
        if (user.role !== 'student')
            throw new Error("You are not authorized to view this resource.");
        const enrollment = await Enrollment.findAll({
            where: {
                userId
            },
            include: [Course]
        });
        return enrollment;
    } catch (error) {
        console.log(error);
        return;
    }
};

exports.getTeacherCourses = async (userId) => {
    try {
        const user = await this.getOne(userId);
        if (!user)
            throw new Error("User doesn't exist.");
        if (user.role !== 'teacher')
            throw new Error("You are not authorized to view this resource.");
        const courses = await Course.findAll({
            where: {
                instructor: userId
            }
        });
        return courses;
    } catch (error) {
        console.log(error);
        return;
    }
};

exports.getTeachers = async () => {
    try {
        const teachers = await User.findAll({
            where: {
                role: "teacher",
            },
            include: {
                model: Course,
                as: 'taughtCourses',
            }
        });
        return teachers;
    }
    catch (error) {
        console.log(error);
        return;
    }
};