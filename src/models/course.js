const { DataTypes } = require('sequelize');
const sequelize = require('../configurations/database');
const User = require('./user');

const Course = sequelize.define('course', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM("Programming Languages", "Web Development", "Mobile Development", "Artificial Intelligence",
            "Software Design", "Data Science"),
        allowNull: false
    },
    materials: {
        type: DataTypes.STRING
    },
    instructor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    level: {
        type: DataTypes.ENUM("Beginner", "Intermediate", "Advanced"),
        allowNull: false
    },
    sections: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'declined'),
        allowNull: false,
        defaultValue: 'pending'
    }
}, {
    tableName: 'courses',
    timestamps: true
});

module.exports = Course;

