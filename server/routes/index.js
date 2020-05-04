const express = require("express");

const app = express();

// Ruta comprobación
app.get("/", (req, res) => {
    res.send("REST-Server funcionando!");
});

// Import de Rutas
const appRoute = require('./app');
const userRoute = require('./user');
const taskRoute = require('./task');
const loginRoute = require('./login');
const imgRoute = require('./img');
const searchRoute = require('./search');
const uploadRoute = require('./upload');

// Rutas (middlewares)
app.use('/api/login', loginRoute);
app.use('/api/users', userRoute);
/* app.use('/api/tasks', taskRoute);
app.use('/api/search', searchRoute);
app.use('/api/images', imgRoute);
app.use('/api/upload', uploadRoute); */

app.use('/', appRoute);


module.exports = app;