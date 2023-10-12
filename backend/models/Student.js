const mongoose = require('mongoose');

const student = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    project: {
        type: String,
        required: true,
    },
    mentor: {
        type: mongoose.Types.ObjectId,
        ref: 'Mentor',
    },
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
    },
    isSubmitted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Student', student);