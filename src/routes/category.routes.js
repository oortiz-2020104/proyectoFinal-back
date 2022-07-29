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

//* Contribuidor
api.get('/getCategories_OnlyContributor', [midAuth.ensureAuth, midAuth.isContributor], categoryController.getCategories_OnlyContributor);

//* Usuarios no registrados
api.get('/getCategories_NoClient', categoryController.getCategories_NoClient);

//* Usuarios registrados
api.get('/getCategories_OnlyClient', [midAuth.ensureAuth, midAuth.isClient], categoryController.getCategories_OnlyClient);

module.exports = api;