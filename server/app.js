require("./config/config");

const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Inicialización 
const app = express();

// CORS
app.use(cors());

// BodyParser (middlewares)
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Configuración global de Rutas
app.use(require("./routes"));



// Conexion a la base de datos
mongoose.connect(
    process.env.URLDB,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    (err, res) => {
      if (err) throw err;
      console.log("Base de datos: \x1b[32mconectada y en funcionamiento\x1b[0m");
    }
);

// Puerto
app.listen(process.env.PORT, () => {
    console.log(`Servidor \x1b[32mONLINE\x1b[0m en el puerto: \x1b[33m${process.env.PORT}\x1b[0m`);
});

