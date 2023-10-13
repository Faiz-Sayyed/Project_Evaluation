const express = require('express');
const router = express.Router();

const Mentor = require('../models/Mentor');

router.get('/getMentors', async (req, res) => {
    const allMentors = await Mentor.find({});
    res.status(200).json(allMentors);
})

router.post('/addMentor', async (req, res) => {
    await Mentor.create(req.body)

    const allMentors = await Mentor.find({});
    res.status(200).json(allMentors);
})

router.patch('/updateMentor', async (req, res) => {
    await Mentor.findByIdAndUpdate(req.body.id, req.body);

    const allMentors = await Mentor.find({});
    res.status(200).json(allMentors);
})

router.delete('/deleteMentor', async (req, res) => {
    await Mentor.findByIdAndDelete(req.body.id);

    const allMentors = await Mentor.find({});
    res.status(200).json(allMentors);
})

module.exports = router;