'use strict'

const express = require('express');
const api = express.Router();
const destinyController = require('../controllers/destiny.controller');
const midAuth = require('../services/auth');

//* Admnistrador
api.get('/testDestiny', [midAuth.ensureAuth, midAuth.isAdmin], destinyController.testDestiny);

//* Usuarios registrados
api.post('/addDestiny/:idTrip/:idTuristicCenter', [midAuth.ensureAuth, midAuth.isClient], destinyController.addDestiny);

api.get('/getDestinies/:idTrip', [midAuth.ensureAuth, midAuth.isClient], destinyController.getDestinies)
api.get('/getDestiny/:idTrip/:idDestiny', [midAuth.ensureAuth, midAuth.isClient], destinyController.getDestiny)

api.get('/getDestiny/:idTrip/:idDestiny', [midAuth.ensureAuth, midAuth.isClient], destinyController.getDestiny)

api.put('/updateDestiny/:idTrip/:idDestiny', [midAuth.ensureAuth, midAuth.isClient], destinyController.updateDestiny)
api.delete('/deleteDestiny/:idTrip/:idDestiny', [midAuth.ensureAuth, midAuth.isClient], destinyController.deleteDestiny)

module.exports = api;