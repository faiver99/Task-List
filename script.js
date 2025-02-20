
// URL del backend (actualiza esta URL con la de tu backend en Render)
const API_URL = 'https://task-list-7hz5.onrender.com';


// Seleccionar elementos del DOM
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const editModal = document.getElementById('editModal');
const deleteModal = document.getElementById('deleteModal');
const editTaskInput = document.getElementById('editTaskInput');
const saveEditBtn = document.getElementById('saveEditBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const closeBtn = document.querySelector('.close-btn');
// require('dotenv').config();

let currentTaskElement = null; // Variable para almacenar la tarea que se está editando o eliminando

// URL del backend (actualiza esta URL con la de tu backend en Render)
// const API_URL = 'https://task-list-7hz5.onrender.com';

// Cargar tareas desde el backend
async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`);
        if (!response.ok) {
            throw new Error('Error al cargar las tareas');
        }
        const tasks = await response.json();
        taskList.innerHTML = ''; // Limpiar la lista
        tasks.forEach(task => addTaskToDOM(task._id, task.text, task.completed));
    } catch (error) {
        console.error('Error al cargar las tareas:', error.message);
    }
}

// Función para agregar una nueva tarea al DOM
function addTaskToDOM(id, text, completed = false) {
    const li = document.createElement('li');
    li.dataset.id = id;

    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = text;

    if (completed) {
        li.classList.add('completed');
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => openDeleteModal(li));

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', () => openEditModal(li));

    li.appendChild(taskTextSpan);
    li.appendChild(deleteBtn);
    li.appendChild(editBtn);

    taskList.appendChild(li);
}


// Agregar una nueva tarea
addTaskBtn.addEventListener('click', async () => {
    const taskText = taskInput.value.trim();

    // Limpiar el mensaje de error
    errorMessage.style.display = 'none';

    if (taskText === '') {
        // Mostrar el mensaje de error si el campo está vacío
        errorMessage.style.display = 'block';
        return; // Detener la ejecución
    }

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: taskText }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al agregar la tarea');
        }

        const newTask = await response.json();
        addTaskToDOM(newTask._id, newTask.text, newTask.completed);
        taskInput.value = ''; // Limpiar el campo de entrada
    } catch (error) {
        console.error('Error al agregar la tarea:', error.message);
        alert('No se pudo agregar la tarea. Inténtalo de nuevo.');
    }
});

// Cargar tareas al iniciar la aplicación
loadTasks();
