require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Inicializar Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error('No se encontró la variable de entorno MONGO_URI');
    process.exit(1); // Detener el servidor si falta la URI
}

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch((error) => {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1); // Detener el servidor si falla la conexión
});

// Definir el esquema de la tarea
const taskSchema = new mongoose.Schema({
    text: String,
    completed: Boolean,
});

// Crear el modelo
const Task = mongoose.model('Task', taskSchema);

// Rutas
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
});

app.post('/tasks', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'El texto de la tarea es obligatorio' });
    }
    try {
        const newTask = new Task({ text, completed: false });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar la tarea' });
    }
});

app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { text, completed },
            { new: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        res.json({ message: 'Tarea eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});