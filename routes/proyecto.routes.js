const router = require('express').Router();
const {crearProyecto, obtenerProyecto, actualizarProyecto, eliminarProyecto} = require('../controller/proyecto.controller');
const auth = require('../middleware/auth');
const { check } = require('express-validator')

router.post('/', 
                [
                    check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
                ], 
                auth, crearProyecto);
router.get('/', auth, obtenerProyecto);
router.put('/:id', [ check('nombre', 'El nombre del proyecto es requerido').not().isEmpty()], auth, actualizarProyecto);
router.delete('/:id', auth, eliminarProyecto);


module.exports = router;