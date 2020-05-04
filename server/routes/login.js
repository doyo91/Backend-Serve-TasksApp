const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Google
const CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

const User = require('../models/User');


// ****************************
// Login de Google
// ****************************
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}



router.post('/google', async (req, res) => {

    let token = req.body.token;

    let googleUser = await verify(token)
    .catch(e => {
        return res.status(403).json({
            ok: false,
            message: 'Token no válido',
            errors: e
        });
    });

    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar users',
                errors: err
            });
        }

        if (userDB) {
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    message: 'Debe de usar su autenticación normal',
                    errors: err
                });
            } else {
                const token = jwt.sign({ user: userDB }, process.env.SEED, { expiresIn: 14400 });// 4 horas

                res.status(200).json({
                    ok: true,
                    user: userDB,
                    id: userDB._id,
                    token
                });
            }
        } else {
            // user no existe hay que crearlo
            let user = new User();

            user.nombre = googleUser.nombre;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = googleUser.google;
            user.password = ':(';

            user.save((err, userDB) => {
                const token = jwt.sign({ user: userDB }, process.env.SEED, { expiresIn: 14400 });// 4 horas

                res.status(200).json({
                    ok: true,
                    user: userDB,
                    id: user._id,
                    token
                });
            })
        }
    });
});


// ****************************
// Login normal
// ****************************
router.post('/', (req, res) => {
    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar users',
                errors: err
            });
        }

        // Comprobar si existe user
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                message: 'Email o Password incorrecto',
                errors: { message: 'Email o Password incorrecto' }
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Email o Password incorrecto',
                errors: { message: 'Email o Password incorrecto' }
            });
        }

        // Crear token
        userDB.password = ':('; // para no imprimirla
        const token = jwt.sign({ user: userDB }, process.env.SEED, { expiresIn: 14400 });// 4 horas

        res.status(200).json({
            ok: true,
            user: userDB,
            id: userDB._id,
            token
        });
    });

});



module.exports = router;