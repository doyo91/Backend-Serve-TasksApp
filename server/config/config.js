// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno de desarrollo
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Google
process.env.CLIENT_ID='1062407316809-dv8apnp91f64vo1rht2si9tnbe463vl8.apps.googleusercontent.com';

// Expiración del token
process.env.CADUCIDAD_TOKEN = '24h';

// SEED autenticación token
process.env.SEED = process.env.SEED || '34hjklfs45241kmlt54gn';

// Conexión base de datos (MongoDB)
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/appMeanSamuelEdibo';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;