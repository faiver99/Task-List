# To-Do List App - Frontend

Este es el código del frontend de una aplicación de lista de tareas (To-Do List) que interactúa con un backend para gestionar las tareas. A continuación se describe el funcionamiento del código JavaScript.

## Descripción General

Este script permite a los usuarios agregar, editar y eliminar tareas en una lista. La lista de tareas se sincroniza con un backend a través de una API REST. El backend se encuentra en la URL proporcionada en la constante `API_URL`.

### Funcionalidades

1. **Cargar Tareas:** Al cargar la página, el script obtiene las tareas existentes desde el backend y las muestra en la interfaz de usuario.
2. **Agregar Nueva Tarea:** Permite agregar nuevas tareas a la lista mediante un formulario de entrada.
3. **Editar Tareas:** Permite editar el texto de una tarea seleccionada.
4. **Eliminar Tareas:** Permite eliminar una tarea de la lista.

## Detalle del Código

### 1. Variables y Elementos del DOM

El código selecciona varios elementos del DOM para manipular la interfaz de usuario:

```javascript
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
const closeBtns = document.querySelectorAll('.close-btn');
const errorMessage = document.getElementById('errorMessage');
