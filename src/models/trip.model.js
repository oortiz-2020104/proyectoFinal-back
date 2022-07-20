'use strict'
const mongoose = require('mongoose')

const tripSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    name: String,
    startDate: Date,
    endDate: Date
});

module.exports = mongoose.model('trip', tripSchema)