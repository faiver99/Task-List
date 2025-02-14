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
require('dotenv').config();

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

    // Botón para eliminar la tarea
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => openDeleteModal(li));

    // Botón para editar la tarea
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', () => openEditModal(li));

    // Marcar tarea como completada
    li.addEventListener('click', async () => {
        li.classList.toggle('completed');
        const isCompleted = li.classList.contains('completed');
        try {
            await fetch(`${API_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, completed: isCompleted }),
            });
        } catch (error) {
            console.error('Error al actualizar la tarea:', error.message);
        }
    });

    li.appendChild(taskTextSpan);
    li.appendChild(deleteBtn);
    li.appendChild(editBtn);

    taskList.appendChild(li);
}

// Agregar una nueva tarea
addTaskBtn.addEventListener('click', async () => {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
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
            taskInput.value = '';
        } catch (error) {
            console.error('Error al agregar la tarea:', error.message);
            alert('No se pudo agregar la tarea. Inténtalo de nuevo.');
        }
    } else {
        alert('Por favor, ingresa una tarea.');
    }
});

// Guardar cambios de edición
saveEditBtn.addEventListener('click', async () => {
    const newText = editTaskInput.value.trim();
    if (newText !== '') {
        try {
            const taskId = currentTaskElement.dataset.id;
            const isCompleted = currentTaskElement.classList.contains('completed');
            const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newText, completed: isCompleted }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al editar la tarea');
            }

            const updatedTask = await response.json();
            const taskTextSpan = currentTaskElement.querySelector('span');
            taskTextSpan.textContent = updatedTask.text;
            closeModal(editModal);
        } catch (error) {
            console.error('Error al editar la tarea:', error.message);
            alert('No se pudo editar la tarea. Inténtalo de nuevo.');
        }
    } else {
        alert('El campo no puede estar vacío.');
    }
});

// Eliminar una tarea
confirmDeleteBtn.addEventListener('click', async () => {
    try {
        const taskId = currentTaskElement.dataset.id;
        const response = await fetch(`${API_URL}/tasks/${taskId}`, { method: 'DELETE' });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al eliminar la tarea');
        }

        taskList.removeChild(currentTaskElement);
        closeModal(deleteModal);
    } catch (error) {
        console.error('Error al eliminar la tarea:', error.message);
        alert('No se pudo eliminar la tarea. Inténtalo de nuevo.');
    }
});

// Cerrar modales
function closeModal(modal) {
    modal.style.display = 'none';
}

cancelEditBtn.addEventListener('click', () => closeModal(editModal));
cancelDeleteBtn.addEventListener('click', () => closeModal(deleteModal));
closeBtn.addEventListener('click', () => closeModal(editModal));

window.addEventListener('click', (e) => {
    if (e.target === editModal) closeModal(editModal);
    if (e.target === deleteModal) closeModal(deleteModal);
});

// Abrir la vista emergente de edición
function openEditModal(taskElement) {
    currentTaskElement = taskElement;
    const taskTextSpan = taskElement.querySelector('span');
    editTaskInput.value = taskTextSpan.textContent;
    editModal.style.display = 'block';
}

// Abrir la vista emergente de confirmación
function openDeleteModal(taskElement) {
    currentTaskElement = taskElement;
    deleteModal.style.display = 'block';
}

// Cargar tareas al iniciar la aplicación
loadTasks();