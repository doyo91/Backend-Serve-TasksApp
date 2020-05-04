const router = require('express').Router();
const bcrypt = require('bcrypt');

/* const {verificaToken} = require('../middlewares/auth'); */


const User = require('../models/User');


// ****************************
// Obtener todos los usuarios
// ****************************
router.get('/', async (req, res, next) => {


    let skip = req.query.skip || 0;
    skip = Number(skip);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    try {
        const users = await User.find({}, 'name email img role')
                            .skip(skip)
                            .limit(limit);
        const countDocs = await User.countDocuments({state: true});
        
        return res.status(200).json({
            ok: true,
            users: users,
            totalUsers: countDocs
        });

    } catch (err) {
        return res.status(500).json({
            ok: false,
            message: 'Error cargando users',
            errors: err
        });
    }  
});


// ****************************
// Crear usuario
// ****************************
router.post('/', async (req, res, next) => {
    const body = req.body;

    const user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    try {
        const userSaved = await user.save();
        userSaved.password = ':(';

        return res.status(201).json({
            ok :true,
            user: userSaved,
            //usertoken: req.user
        });
    } catch (err) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error al crear usuario',
            errors: err
        });
    }
    
});


// ****************************
// Actualizar usuario por ID
// ****************************
router.put('/:id', async (req, res) => {
    let id = req.params.id;
    let body = req.body;

    try {

        const user = await User.findById(id);

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;
        
        try {
            const userUpdated = await user.save();
            userUpdated.password = ':(';

            return res.status(200).json({
                ok :true,
                user: userUpdated
            });
        } catch (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al actualizar usuario',
                errors: err
            });
        }

    } catch (err) {
        if(!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id' + id + 'no existe',
                errors: { message: 'No existe un usuario con ese ID'}
            });
        } 

        return res.status(500).json({
            ok: false,
            mensaje: 'Error al buscar usuario',
            errors: err
        });
    }
});


// ****************************
// Borrar usuario mediante ID
// ****************************
router.delete('/:id', async (req, res) => {
    let id = req.params.id;


    try {
        
        const userDeleted = await User.findByIdAndDelete(id);

        return res.status(200).json({
            ok :true,
            user: userDeleted
        });

    } catch (err) {

        if(!userDeleted) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: {message: 'No existe un usuario con ese ID'}
            });
        }

        return res.status(500).json({
            ok: false,
            mensaje: 'Error al borrar usuario',
            errors: err
        });
    }
});


module.exports = router;