const router = require('express').Router();

const { updateUserInfo, userInfo, changePasswordValidation } = require('./../validations/user');

const { authorize } = require('../middlewares/authorization');

const { getOne, create, getCourses, getAllUsers, deleteUser, updateUser, changePassword, getTeachers } = require('../controllers/user');
//const { sendVerificationMail, verifyUser } = require('./../controllers/verify');


router.post('/sign-up', userInfo, create);

//yet to be completed (verification via mail)
//router.get('/verify/:token', verifyUser)

//router.post('/verify', authorize(['student']), sendVerificationMail)

router.get('/courses', authorize(['admin', 'student', 'teacher']), getCourses)

router.get('/', authorize(['admin']), getAllUsers)

router.put('/changePassword', authorize(['admin', 'student', 'teacher']), changePasswordValidation, changePassword);

router.get('/teachers', authorize(['admin']), getTeachers)

//i added student and teacher to authorization since anyone can get anyone's profile
//if there is an option to hide certain data to other people then we can add that later
router.get('/:id', authorize(['admin', 'student', 'teacher']), getOne);

router.delete('/:id', authorize(['admin', 'student', 'teacher']), deleteUser);

router.put('/:id', authorize(['admin', 'student', 'teacher']), updateUserInfo, updateUser);

module.exports = router;