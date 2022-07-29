'use strict'

const express = require('express');
const api = express.Router();
const turisticCenterController = require('../controllers/turisticCenter.controller');
const midAuth = require('../services/auth');

const connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({ uploadDir: './uploads/turisticsCenters' });

//* Admnistrador
api.get('/testTuristicCenter', [midAuth.ensureAuth, midAuth.isAdmin], turisticCenterController.testTuristicCenter);

api.get('/getTuristicsCenters_OnlyAdmin', [midAuth.ensureAuth, midAuth.isAdmin], turisticCenterController.getTuristicsCenters_OnlyAdmin)
api.get('/getTuristicCenter_OnlyAdmin/:idTuristicCenter', [midAuth.ensureAuth, midAuth.isAdmin], turisticCenterController.getTuristicCenter_OnlyAdmin)

api.put('/updateTuristicCenter_OnlyAdmin/:idTuristicCenter', [midAuth.ensureAuth, midAuth.isAdmin], turisticCenterController.updateTuristicCenter_OnlyAdmin)

api.delete('/deleteTuristicCenter_OnlyAdmin/:idTuristicCenter', [midAuth.ensureAuth, midAuth.isAdmin], turisticCenterController.deleteTuristicCenter_OnlyAdmin)

//* Contribuidor
api.post('/addTuristicCenter', [midAuth.ensureAuth, midAuth.isContributor], turisticCenterController.addTuristicCenter)

api.get('/getTuristicsCenters', [midAuth.ensureAuth, midAuth.isContributor], turisticCenterController.getTuristicsCenters)
api.get('/getTuristicCenter/:idTuristicCenter', [midAuth.ensureAuth, midAuth.isContributor], turisticCenterController.getTuristicCenter)

api.put('/updateTuristicCenter/:idTuristicCenter', [midAuth.ensureAuth, midAuth.isContributor], turisticCenterController.updateTuristicCenter)

api.delete('/deleteTuristicCenter/:idTuristicCenter', [midAuth.ensureAuth, midAuth.isContributor], turisticCenterController.deleteTuristicCenter)

api.post('/uploadImageTuristicCenter/:idTuristicCenter', [midAuth.ensureAuth, midAuth.isContributor, upload], turisticCenterController.uploadImageTuristicCenter);

//* Usuarios registrados

//* Usuarios no registrados
api.get('/getImageTuristicCenter/:fileName', upload, turisticCenterController.getImageTuristicCenter);

module.exports = api;