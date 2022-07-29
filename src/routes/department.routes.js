'use strict'

const express = require('express');
const api = express.Router();
const departmentController = require('../controllers/department.controller');
const midAuth = require('../services/auth');

//* Admnistrador
api.get('/testDepartment', [midAuth.ensureAuth, midAuth.isAdmin], departmentController.testDepartment);

api.post('/addDepartment', [midAuth.ensureAuth, midAuth.isAdmin], departmentController.addDepartment);

api.get('/getDepartments', [midAuth.ensureAuth, midAuth.isAdmin], departmentController.getDepartments);
api.get('/getDepartment/:idDepartment', [midAuth.ensureAuth, midAuth.isAdmin], departmentController.getDepartment);

api.put('/updateDepartment/:idDepartment', [midAuth.ensureAuth, midAuth.isAdmin], departmentController.updateDepartment);

api.delete('/deleteDepartment/:idDepartment', [midAuth.ensureAuth, midAuth.isAdmin], departmentController.deleteDepartment);

//* Contribuidor
api.get('/getDepartments_OnlyContributor', [midAuth.ensureAuth, midAuth.isContributor], departmentController.getDepartments_OnlyContributor);

//* Usuarios no registrados
api.get('/getDepartments_NoClient', departmentController.getDepartments_NoClient);

//* Usuarios registrados
api.get('/getDepartments_OnlyClient', [midAuth.ensureAuth, midAuth.isClient], departmentController.getDepartments_OnlyClient);

module.exports = api;