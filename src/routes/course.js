const router = require('express').Router();

const { courseInfo, updateCourseInfo } = require('../validations/course');

const { authorize } = require('../middlewares/authorization');

const { getOne, create, update, enroll, withdraw, getCourseStudents, getAll, deleteCourse, getPendingCourses, approveCourse, declineCourse, getDeclined } = require('./../controllers/course');

router.post('/', authorize(['admin', 'teacher']), courseInfo, create);

router.get('/declined', authorize(['admin']), getDeclined);

router.get('/pending', authorize(['admin']), getPendingCourses);

router.post('/:id/approve', authorize(['admin']), approveCourse);

router.post('/:id/decline', authorize(['admin']), declineCourse);

router.post('/enroll', authorize(['student']), enroll);

router.get('/:id/students', authorize(['admin', 'teacher']), getCourseStudents);

router.delete('/withdraw', authorize(['student']), withdraw);

router.put('/:id', authorize(['admin', 'teacher']), updateCourseInfo, update);

router.delete('/:id', authorize(['admin']), deleteCourse);

router.get('/', authorize(['admin', 'student', 'teacher']), getAll);

router.get('/:id', authorize(['student', 'teacher', 'admin']), getOne);

module.exports = router;