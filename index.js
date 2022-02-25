const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

const app = express();

const usuarioRoutes = require('./routes/usuario.routes');
const authRoutes = require('./routes/auth.routes');
const proyectoRoutes = require('./routes/proyecto.routes');
const tareaRoutes = require('./routes/tarea.routes');

conectarDB();

app.use(express.json({extended: true}));
app.use(cors());
const PORT = process.env.PORT || 4000

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/tareas', tareaRoutes);

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(PORT, () => console.log(`El servidor esta funcionando en el puerto ${PORT}!`))