const routes = require('express').Router();
const {crearUsuario} = require('../controller/usuario.controller')
const {check} = require('express-validator');

routes.post('/', [ check('nombre', 'El nombre es obligatorio').not().isEmpty(),
                   check('email', 'Agrega un email Válido').isEmail(),
                   check('password', 'El password debe ser minimo 6 caracteres').isLength({min: 6}),
                    ], crearUsuario);
module.exports = routes;