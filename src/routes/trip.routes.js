'use strict'

const express = require('express');
const api = express.Router();
const tripController = require('../controllers/trip.controller');
const midAuth = require('../services/auth');

//* Admnistrador
api.get('/testTrip', [midAuth.ensureAuth, midAuth.isAdmin], tripController.testTrip);

//* Usuarios registrados
api.post('/addTrip', [midAuth.ensureAuth, midAuth.isClient], tripController.addTrip)

api.get('/getTrips', [midAuth.ensureAuth, midAuth.isClient], tripController.getTrips)
api.get('/getTrip/:idTrip', [midAuth.ensureAuth, midAuth.isClient], tripController.getTrip)

api.put('/updateTrip/:idTrip', [midAuth.ensureAuth, midAuth.isClient], tripController.updateTrip)

api.delete('/deleteTrip/:idTrip', [midAuth.ensureAuth, midAuth.isClient], tripController.deleteTrip)

module.exports = api;