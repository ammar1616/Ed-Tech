const { DataTypes } = require('sequelize');

const sequelize = require('../configurations/database');
const hashPassword = require('./../utils/hashPassword');
const Course = require('./course');

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    role: {
        type: DataTypes.ENUM('student', 'teacher', 'admin'),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    nationality: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subscription: {
        type: DataTypes.ENUM('free', 'standard', 'premium', 'corporate'),
        allowNull: false,
        defaultValue: 'free'
    },
    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    verifiedToken: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'users',
    timestamps: true
});

User.beforeCreate(hashPassword);
User.beforeBulkUpdate(hashPassword);

User.hasMany(Course, { as: 'taughtCourses', foreignKey: 'instructor' });
Course.belongsTo(User , {foreignKey: 'instructor'})

module.exports = User;