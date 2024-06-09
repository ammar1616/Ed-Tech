const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const sequelize = require('./configurations/database');

const app = express();
app.use(bodyParser.json());

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(compression());
app.use(cors());

const authRoutes = require('./routes/authentication');
const userRoutes = require('./routes/user');
const courseRoutes = require('./routes/course');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/courses', courseRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Ed-Tech!' });
});

app.use((req, res) => {
    res.status(404).json({ error: "Not found " });
});

sequelize.sync().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
});