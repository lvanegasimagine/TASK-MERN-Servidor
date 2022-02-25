const router = require('express').Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const { crearTarea, obtenerTarea, actualizarTarea, eliminarTarea } = require('../controller/tarea.controller');

router.post('/', auth, [ check('nombre', 'El nombre es obligatorio').not().isEmpty(), check('proyecto', 'El proyecto es obligatorio').not().isEmpty()], crearTarea);
router.get('/', auth, obtenerTarea)
router.put('/:id', auth, actualizarTarea)
router.delete('/:id', auth, eliminarTarea)
module.exports = router;