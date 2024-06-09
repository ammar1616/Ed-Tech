const userService = require('../services/user');

exports.getOne = async (req, res) => {
    try {
        const identifier = req.params.id;
        const user = await userService.getOne(identifier);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        //should we make user.password = undefined here?
        res.status(200).json({ message: "User Retrieved Successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAll();
        if (!users) {
            return res.status(404).json({ error: 'There are no users yet' });
        }
        res.status(200).json({ message: "Users Retrieved Successfully", users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.getOne(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const data = {
            id,
            source: req.user.id,
            role: req.user.role
        };
        const deleted = await userService.deleteUser(data);
        if (!deleted) {
            return res.status(501).json({ error: 'fail to delete user' });
        }
        res.status(200).json({ message: "User deleted Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.getOne(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const data = {
            ...req.validatedBody
        };
        data.id = user.id;
        data.source = req.user.id;
        const updated = await userService.update(data);
        if (!updated || !updated[0]) {
            return res.status(501).json({ error: 'fail to update user' });
        }
        res.status(200).json({ message: "User updated Successfully", updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { id } = req.user;
        const { newPassword, oldPassword } = req.body;
        const info = {
            id,
            newPassword,
            oldPassword
        };
        const newUser = await userService.changePassword(info);
        if (!newUser)
            return res.status(400).json({ msg: "Password update failed." });
        res.status(500).json({ msg: "Password changed successfully." });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "Internal Server Error." });
    }
};

exports.create = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, dateOfBirth, nationality } = req.body;
        const data = {
            firstName,
            lastName,
            email,
            password,
            role,
            dateOfBirth,
            nationality,
        };
        const existingUser = await userService.getOne(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }
        const user = await userService.create(data);
        if (!user) {
            return res.status(400).json({ error: 'User creation failed' });
        }
        user.password = undefined;
        res.status(201).json({ message: 'User added successfully', user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getCourses = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await userService.getOne(id);
        if (!user)
            return res.status(400).json({ message: "User doesn't exist." });
        const courses = await userService.getCourses(id);
        if (!courses)
            return res.status(400).json({ message: "Not enrolled in any courses" })
        res.status(400).json({ message: "Retrieved courses successfully. ", courses })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getTeachers = async (req, res) => {
    try {
        const teachers = await userService.getTeachers();
        if (!teachers) {
            return res.status(404).json({ error: 'There are no teachers yet' });
        }
        res.status(200).json({ message: "teachers Retrieved Successfully", teachers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
