document.addEventListener('DOMContentLoaded', () => {
    const days = document.querySelectorAll('.day');

    days.forEach(day => {
        const addButton = day.querySelector('.add-btn');
        const inputField = day.querySelector('input[type="text"]');
        const tasksList = day.querySelector('.tasks');

        addButton.addEventListener('click', () => {
            const taskText = inputField.value.trim();
            if (taskText === '') {
                alert('Task cannot be empty');
                return;
            }

            addTask(day.id, taskText);
            inputField.value = '';
        });
    });

    // Load tasks from local storage
    loadTasks();
});

function addTask(day, taskText, isCompleted = false) {
    const tasksList = document.querySelector(`#${day} .tasks`);
    const taskItem = document.createElement('li');
    taskItem.className = `task ${isCompleted ? 'completed' : ''}`;
    taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${isCompleted ? 'checked' : ''}>
        <input type="text" class="task-text" value="${taskText}" readonly>
        <button class="edit-btn">✏️</button>
        <button class="delete-btn">🗑️</button>
    `;

    tasksList.appendChild(taskItem);

    const checkbox = taskItem.querySelector('.task-checkbox');
    const editButton = taskItem.querySelector('.edit-btn');
    const deleteButton = taskItem.querySelector('.delete-btn');

    checkbox.addEventListener('change', () => {
        taskItem.classList.toggle('completed');
        updateTask(day, taskText, taskItem.classList.contains('completed'));
    });

    editButton.addEventListener('click', () => {
        const taskInput = taskItem.querySelector('.task-text');
        if (editButton.textContent === '✏️') {
            taskInput.removeAttribute('readonly');
            taskInput.focus();
            editButton.textContent = '✔️';
        } else {
            taskInput.setAttribute('readonly', true);
            editButton.textContent = '✏️';
            updateTask(day, taskInput.value, checkbox.checked);
        }
    });

    deleteButton.addEventListener('click', () => {
        tasksList.removeChild(taskItem);
        deleteTask(day, taskText);
    });

    saveTask(day, taskText, isCompleted);
}

function saveTask(day, taskText, isCompleted) {
    let tasks = JSON.parse(localStorage.getItem(day)) || [];
    tasks.push({ text: taskText, completed: isCompleted });
    localStorage.setItem(day, JSON.stringify(tasks));
}

function updateTask(day, updatedTaskText, isCompleted) {
    let tasks = JSON.parse(localStorage.getItem(day));
    tasks = tasks.map(task => (task.text === updatedTaskText ? { text: updatedTaskText, completed: isCompleted } : task));
    localStorage.setItem(day, JSON.stringify(tasks));
}

function deleteTask(day, taskText) {
    let tasks = JSON.parse(localStorage.getItem(day));
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem(day, JSON.stringify(tasks));
}

function loadTasks() {
    const days = document.querySelectorAll('.day');
    days.forEach(day => {
        const tasks = JSON.parse(localStorage.getItem(day.id)) || [];
        tasks.forEach(task => addTask(day.id, task.text, task.completed));
    });
}
