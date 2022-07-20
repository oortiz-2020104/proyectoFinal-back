'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

app.use(helmet()); //Seguridad de Express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors()); //Aceptar solicitudes

const userRoutes = require('../src/routes/user.routes')
const categoryRoutes = require('../src/routes/category.routes')

//Configuración de rutas
app.use('/user', userRoutes);
app.use('/category', categoryRoutes);

module.exports = app;