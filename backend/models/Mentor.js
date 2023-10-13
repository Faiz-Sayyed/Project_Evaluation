const mongoose = require('mongoose');

const mentor = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    students: [String]
})

module.exports = mongoose.model('Mentor', mentor);