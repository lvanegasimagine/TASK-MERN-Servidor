const Proyecto = require("../models/proyecto.model");
const { validationResult } = require("express-validator");

const crearProyecto = async (req, res) => {
  //Revisa si hay errores

  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const proyecto = new Proyecto(req.body);
    // guardando el creador via JWT
    proyecto.creador = req.usuario.id;
    proyecto.save();

    res.status(200).json(proyecto);
  } catch (error) {
    res.status(500).json({ error });
  }
};

const obtenerProyecto = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({
      creado: -1,
    });

    res.status(200).json({ proyectos });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const actualizarProyecto = async(req, res) => {
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    const {nombre} = req.body;

    const nuevoProyecto = {};

    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        let proyecto = await Proyecto.findById(req.params.id);

        if(!proyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, {$set: nuevoProyecto}, {new: true});

        res.status(200).json({proyecto});
    } catch (error) {
        res.status(500).json({error})
    }
}

const eliminarProyecto = async(req, res) => {
    try {
        let proyecto = await Proyecto.findById(req.params.id);

        if(!proyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        proyecto = await Proyecto.findOneAndRemove({_id: req.params.id});

        res.status(200).json({msg: 'Proyecto Eliminados'});
    } catch (error) {
        res.status(500).json({error})
    }
}

module.exports = {
  crearProyecto,
  obtenerProyecto,
  actualizarProyecto,
  eliminarProyecto
};
