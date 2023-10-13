const mongoose = require('mongoose');

const student = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    project: {
        type: String,
        required: true,
    },
    mentorID: String,
    mentorName: String,
    scores: {
        Ideation: {
            type: Number,
            default: 0
        },
        Execution: {
            type: Number,
            default: 0
        },
        Presentation: {
            type: Number,
            default: 0
        }
    }
})

module.exports = mongoose.model('Student', student);