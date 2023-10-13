const express = require('express');
const router = express.Router();

const Student = require('../models/Student');

router.get('/getStudents', async (req, res) => {
    const allStudents = await Student.find({});
    res.status(200).send(allStudents);
})

router.post('/addStudent', async (req, res) => {
    await Student.create(req.body)

    const allStudents = await Student.find({});
    res.status(200).json(allStudents);
})

router.patch('/updateStudent', async (req, res) => {
    await Student.findByIdAndUpdate(req.body.id, req.body);

    const allStudents = await Student.find({});
    res.status(200).json(allStudents);
})

router.delete('/deleteStudent', async (req, res) => {
    await Student.findByIdAndDelete(req.body.id);

    const allStudents = await Student.find({});
    res.status(200).json(allStudents);
})

module.exports = router;