'use strict'

const express = require('express');
const api = express.Router();
const turisticCenterController = require('../controllers/turisticCenter.controller');
const midAuth = require('../services/auth');

//* Admnistrador
api.get('/testTuristicCenter', [midAuth.ensureAuth, midAuth.isAdmin], turisticCenterController.testTuristicCenter);

//* Contribuidor
api.post('/addTuristicCenter', [midAuth.ensureAuth, midAuth.isContributor], turisticCenterController.addTuristicCenter)

api.get('/getTuristicsCenters', [midAuth.ensureAuth, midAuth.isContributor], turisticCenterController.getTuristicsCenters)
api.get('/getTuristicCenter/:idTuristicCenter', [midAuth.ensureAuth, midAuth.isContributor], turisticCenterController.getTuristicCenter)

api.put('/updateTuristicCenter/:idTuristicCenter', [midAuth.ensureAuth, midAuth.isContributor], turisticCenterController.updateTuristicCenter)

//* Usuarios registrados

//* Usuarios no registrados


module.exports = api;