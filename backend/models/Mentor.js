const mongoose = require('mongoose');

const mentor = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    students: [{
        type: mongoose.Types.ObjectId,
        ref: 'Student'
    }]
})

module.exports = mongoose.model('Mentor', mentor);