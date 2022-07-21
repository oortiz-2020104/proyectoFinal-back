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

//* Usuarios no registrados

//* Usuarios registrados

module.exports = api;