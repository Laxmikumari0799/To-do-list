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

            const taskItem = document.createElement('li');
            taskItem.className = 'task';
            taskItem.innerHTML = `
                <input type="text" value="${taskText}" readonly>
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">🗑️</button>
            `;

            tasksList.appendChild(taskItem);
            inputField.value = '';

            // Add task to local storage
            saveTask(day.id, taskText);

            // Add event listeners for edit and delete buttons
            const editButton = taskItem.querySelector('.edit-btn');
            const deleteButton = taskItem.querySelector('.delete-btn');

            editButton.addEventListener('click', () => {
                const taskInput = taskItem.querySelector('input[type="text"]');
                if (editButton.textContent === '✏️') {
                    taskInput.removeAttribute('readonly');
                    taskInput.focus();
                    editButton.textContent = '✔️';
                } else {
                    taskInput.setAttribute('readonly', true);
                    editButton.textContent = '✏️';
                    updateTask(day.id, taskInput.value);
                }
            });

            deleteButton.addEventListener('click', () => {
                tasksList.removeChild(taskItem);
                deleteTask(day.id, taskText);
            });
        });
    });

    // Load tasks from local storage
    loadTasks();
});

function saveTask(day, task) {
    let tasks = JSON.parse(localStorage.getItem(day)) || [];
    tasks.push(task);
    localStorage.setItem(day, JSON.stringify(tasks));
}

function updateTask(day, updatedTask) {
    let tasks = JSON.parse(localStorage.getItem(day));
    tasks = tasks.map(task => (task === updatedTask ? updatedTask : task));
    localStorage.setItem(day, JSON.stringify(tasks));
}

function deleteTask(day, taskToDelete) {
    let tasks = JSON.parse(localStorage.getItem(day));
    tasks = tasks.filter(task => task !== taskToDelete);
    localStorage.setItem(day, JSON.stringify(tasks));
}

function loadTasks() {
    const days = document.querySelectorAll('.day');
    days.forEach(day => {
        const tasks = JSON.parse(localStorage.getItem(day.id)) || [];
        const tasksList = day.querySelector('.tasks');
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task';
            taskItem.innerHTML = `
                <input type="text" value="${task}" readonly>
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">🗑️</button>
            `;
            tasksList.appendChild(taskItem);

            // Add event listeners for edit and delete buttons
            const editButton = taskItem.querySelector('.edit-btn');
            const deleteButton = taskItem.querySelector('.delete-btn');

            editButton.addEventListener('click', () => {
                const taskInput = taskItem.querySelector('input[type="text"]');
                if (editButton.textContent === '✏️') {
                    taskInput.removeAttribute('readonly');
                    taskInput.focus();
                    editButton.textContent = '✔️';
                } else {
                    taskInput.setAttribute('readonly', true);
                    editButton.textContent = '✏️';
                    updateTask(day.id, taskInput.value);
                }
            });

            deleteButton.addEventListener('click', () => {
                tasksList.removeChild(taskItem);
                deleteTask(day.id, task);
            });
        });
    });
}
