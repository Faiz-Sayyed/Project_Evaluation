const mongoose = require('mongoose');

const mentor = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    students: [String],
    hasSubmitted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Mentor', mentor);