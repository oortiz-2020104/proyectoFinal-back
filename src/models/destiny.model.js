'use strict'
const mongoose = require('mongoose')

const destinySchema = mongoose.Schema({
    trip: {
        type: mongoose.Schema.ObjectId,
        ref: 'trip'
    },
    turisticCenter: {
        type: mongoose.Schema.ObjectId,
        ref: 'turisticCenter'
    },
    startDate: Date,
    endDate: Date
});

module.exports = mongoose.model('destiny', destinySchema)