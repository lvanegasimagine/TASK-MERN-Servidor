const Usuario = require('../models/usuario.model');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const autenticarUsuario = async(req, res) => {

    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    // extraer el email y password
    const {email, password} = req.body;

    try {
        let usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({msg: 'El usuario no existe'});
        }

        //Revisar el password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);

        if(!passCorrecto){
            res.status(400).json({msg: 'Contraseña invalida'});
        }

        // Generar Token
        const payload = {
            usuario: {
                id: usuario.id
            }
        }

        jwt.sign(payload, process.env.SECRET,{
            expiresIn: 3600
        }, (error, token) =>{
            if(error) throw error;

            res.status(200).json({token, msg: 'Login exitoso'})
        })
    } catch (error) {
        res.status(500).json({error})
    }

}

const usuarioAutenticado = async(req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');

        res.status(200).json({usuario})
    } catch (error) {
        res.status(500).json({error})
    }
}
module.exports = {autenticarUsuario, usuarioAutenticado};