const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

const userSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Nombre requerido']
    },
    email: {
        type: String,
        required: [true, 'Email requerido'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Contraseña requerida'],
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        enum: validRoles,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    }

});

userSchema.plugin( uniqueValidator, {message: '{PATH} debe de ser único'} )

module.exports = mongoose.model('User', userSchema);
