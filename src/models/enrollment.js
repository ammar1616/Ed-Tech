const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../configurations/database');

const User = require('./user');
const Course = require('./course');

const Enrollment = sequelize.define('Enrollment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    courseId: {
        type: DataTypes.INTEGER,
        references: {
            model: Course,
            key: 'id'
        }
    },
    progress: {
        type: DataTypes.ENUM("ongoing", "completed"),
        allowNull: false,
        defaultValue: "ongoing"
    }
}, {
    tableName: 'enrollments',
    timestamps: true
});

Enrollment.belongsTo(User, { foreignKey: "userId" });
Enrollment.belongsTo(Course, { foreignKey: "courseId" });

// //lets think about onDelete and onUpdate
User.belongsToMany(Course, { through: Enrollment, foreignKey: "userId", as: "courses" });
Course.belongsToMany(User, { through: Enrollment, foreignKey: "courseId", as: "users" });

module.exports = Enrollment;