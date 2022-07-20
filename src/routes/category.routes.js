'use strict'

const express = require('express');
const api = express.Router();
const categoryController = require('../controllers/category.controller');
const midAuth = require('../services/auth');

//* Admnistrador
api.get('/testCategory', [midAuth.ensureAuth, midAuth.isAdmin], categoryController.testCategory);

api.post('/addCategory', [midAuth.ensureAuth, midAuth.isAdmin], categoryController.addCategory);

api.get('/getCategories', [midAuth.ensureAuth, midAuth.isAdmin], categoryController.getCategories);
api.get('/getCategory/:idCategory', [midAuth.ensureAuth, midAuth.isAdmin], categoryController.getCategory);

api.put('/updateCategory/:idCategory', [midAuth.ensureAuth, midAuth.isAdmin], categoryController.updateCategory);

api.delete('/deleteCategory/:idCategory', [midAuth.ensureAuth, midAuth.isAdmin], categoryController.deleteCategory);

//* Usuarios no registrados

//* Usuarios registrados

module.exports = api;