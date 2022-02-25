const Tarea = require("../models/tarea.model");
const Proyecto = require("../models/proyecto.model");
const { validationResult } = require("express-validator");

const crearTarea = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const { proyecto } = req.body;
    // validar si existe el proyecto
    const proyectoExist = await Proyecto.findById({ _id: proyecto });

    if (!proyectoExist) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Confirmar si el proyecto actual es de el user actual
    if (proyectoExist.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    // Crear tarea
    const tarea = new Tarea(req.body);

    await tarea.save();

    res.status(200).json({ tarea });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const obtenerTarea = async (req, res) => {
  try {
    const { proyecto } = req.query;

    const proyectoExist = await Proyecto.findById({ _id: proyecto });

    if (!proyectoExist) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    if (proyectoExist.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    const tareas = await Tarea.find({proyecto}).sort({creado: -1});

    res.status(200).json({tareas})
  } catch (error) {
    res.status(500).json({ error });
  }
};

const actualizarTarea = async(req, res) => {
  try {
    const {proyecto, nombre, estado} = req.body;
    
    // Si existe la tarea
    let tarea = await Tarea.findById({_id: req.params.id});

    if(!tarea){
      return res.status(401).json({ msg: "Tarea no existe" });
    }

    const proyectoExist = await Proyecto.findById({ _id: proyecto });

    if (proyectoExist.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    //Nueva info
    const nuevaTarea = {};
    nuevaTarea.nombre = nombre;
    nuevaTarea.estado = estado;


    // guardarTarea
    tarea = await Tarea.findByIdAndUpdate({_id: req.params.id}, nuevaTarea, {new: true});

    res.status(200).json({tarea})
  } catch (error) {
    res.status(500).json({error})
  }
}

const eliminarTarea = async(req, res) => {
  try {
    const { proyecto } = req.query;
    
    // Si existe la tarea
    let tareaExist = await Tarea.findById({_id: req.params.id});

    if(!tareaExist){
      return res.status(401).json({ msg: "Tarea no existe" });
    }

    const proyectoExist = await Proyecto.findById({ _id: proyecto });

    if (proyectoExist.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    // Eliminar

    await Tarea.findByIdAndRemove({_id: req.params.id});

    res.status(200).json({msg: 'Tarea Eliminada'});
  } catch (error) {
    res.status(500).json({error})
  }
}

module.exports = {
  crearTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea
};
