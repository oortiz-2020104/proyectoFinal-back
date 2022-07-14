'use strict'
const mongoose = require('mongoose')

const tripSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    name: String,
    starecho "# proyectoFinal" >> README.md
    git init
    git add README.md
    git commit -m "first commit"
    git branch -M main
    git remote add origin https://github.com/oortiz-2020104/proyectoFinal.git
    git push -u origin maintDate: Date,
    endDate: Date
});

module.exports = mongoose.model('trip', tripSchema)