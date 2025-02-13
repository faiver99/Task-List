const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const editModal = document.getElementById('editModal');
const deleteModal = document.getElementById('deleteModal'); // Modal de confirmación
const editTaskInput = document.getElementById('editTaskInput');
const saveEditBtn = document.getElementById('saveEditBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const closeBtn = document.querySelector('.close-btn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn'); // Botón "Eliminar"
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn'); // Botón "Cancelar"

let currentTaskElement = null; // Variable para almacenar la tarea que se está editando o eliminando

// Cargar tareas desde localStorage al iniciar la aplicación
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => {
        addTaskToDOM(task.text, task.completed);
    });
}

// Guardar tareas en localStorage
function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        const text = li.querySelector('span').textContent; // Obtener el texto del <span>
        const completed = li.classList.contains('completed');
        tasks.push({ text, completed });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Función para agregar una nueva tarea al DOM
function addTaskToDOM(text, completed = false) {
    const li = document.createElement('li');

    // Crear un <span> para el texto de la tarea
    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = text;

    if (completed) {
        li.classList.add('completed');
    }

    // Botón para eliminar la tarea
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
        openDeleteModal(li); // Abrir la vista emergente de confirmación
    });

    // Botón para editar la tarea
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', () => {
        openEditModal(li); // Abrir la vista emergente de edición
    });

    // Añadir el <span> y los botones al <li>
    li.appendChild(taskTextSpan);
    li.appendChild(deleteBtn);
    li.appendChild(editBtn);

    taskList.appendChild(li);
}

// Función para abrir la vista emergente de edición
function openEditModal(taskElement) {
    currentTaskElement = taskElement; // Almacenar la tarea actual
    const taskTextSpan = taskElement.querySelector('span'); // Obtener el texto del <span>
    editTaskInput.value = taskTextSpan.textContent; // Rellenar el campo con el texto actual
    editModal.style.display = 'block'; // Mostrar la vista emergente
}

// Función para abrir la vista emergente de confirmación
function openDeleteModal(taskElement) {
    currentTaskElement = taskElement; // Almacenar la tarea actual
    deleteModal.style.display = 'block'; // Mostrar la vista emergente
}

// Función para cerrar la vista emergente
function closeModal(modal) {
    modal.style.display = 'none'; // Ocultar la vista emergente
}

// Función para guardar los cambios realizados en la edición
function saveEdit() {
    const newText = editTaskInput.value.trim();
    if (newText !== '') {
        // Guardar el estado de completado antes de actualizar el texto
        const isCompleted = currentTaskElement.classList.contains('completed');

        // Actualizar el texto dentro del <span>
        const taskTextSpan = currentTaskElement.querySelector('span');
        taskTextSpan.textContent = newText;

        // Restaurar el estado de completado
        if (isCompleted) {
            currentTaskElement.classList.add('completed');
        } else {
            currentTaskElement.classList.remove('completed');
        }

        saveTasks(); // Guardar cambios en localStorage
        closeModal(editModal); // Cerrar la vista emergente
    } else {
        alert('El campo no puede estar vacío.');
    }
}

// Función para eliminar la tarea
function deleteTask() {
    taskList.removeChild(currentTaskElement); // Eliminar la tarea del DOM
    saveTasks(); // Guardar cambios en localStorage
    closeModal(deleteModal); // Cerrar la vista emergente
}

// Eventos
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        addTaskToDOM(taskText);
        saveTasks();
        taskInput.value = '';
    } else {
        alert('Por favor, ingresa una tarea.');
    }
});

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTaskBtn.click();
    }
});

saveEditBtn.addEventListener('click', saveEdit);

cancelEditBtn.addEventListener('click', () => {
    closeModal(editModal);
});

cancelDeleteBtn.addEventListener('click', () => {
    closeModal(deleteModal);
});

confirmDeleteBtn.addEventListener('click', deleteTask);

closeBtn.addEventListener('click', () => {
    closeModal(editModal);
});

// Cerrar la vista emergente si se hace clic fuera de ella
window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        closeModal(editModal);
    }
    if (e.target === deleteModal) {
        closeModal(deleteModal);
    }
});

// Cargar tareas al iniciar la aplicación
loadTasks();