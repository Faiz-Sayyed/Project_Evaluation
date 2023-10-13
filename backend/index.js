const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

const students = require('./routes/students');
const mentors = require('./routes/mentors');

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello World!!!");
})

app.use('/api/v1/students', students);
app.use('/api/v1/mentors', mentors);

const PORT = 5000;
const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected:", mongoose.connection.readyState);
        app.listen(PORT, console.log(`Server listening on PORT: ${PORT}`));
    } catch (error) {
        console.log(error);
    }
}

start();