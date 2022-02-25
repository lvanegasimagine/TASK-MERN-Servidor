const Usuario = require('../models/usuario.model');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const crearUsuario = async (req,res) => {

    // Validaciones

    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    const {email, password} = req.body;

    try {

        let usuario = await Usuario.findOne({email});
        
        if(usuario){
            return res.status(400).json({
                status: false,
                msg: 'El usuario ya existe'
            });
        }
        usuario = new Usuario(req.body);

        // Encryptar contraseña

        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);
        
        await usuario.save();

        //Creacion de jsonwebtoken

        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // Firmar token
        jwt.sign(payload, process.env.SECRET,{
            // expiresIn: 3600 // 1 hora
            expiresIn: '24h' // 1 dia
        }, (error, token) => {
            if(error) throw error;
            
            res.status(200).json({
                status: true,
                token
            })
        })

        

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error
        })
    }
}

module.exports = {
    crearUsuario
}