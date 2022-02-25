const router = require('express').Router();
const {check} = require('express-validator');
const auth = require('../middleware/auth');

const { autenticarUsuario, usuarioAutenticado } = require('../controller/auth.controller');

router.post('/',
                [
                    check('email', 'Agrega un email Válido').isEmail(),
                    check('password', 'El password debe ser minimo 6 caracteres').isLength({min: 6}),
                ],
            autenticarUsuario
);

router.get('/', auth, usuarioAutenticado);

router.get('/', () => console.log('aca'))

module.exports = router;