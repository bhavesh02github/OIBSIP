// Get elements
const form = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date-input');
const pendingTasksList = document.getElementById('pending-tasks-list');
const completedTasksList = document.getElementById('completed-tasks-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
  pendingTasksList.innerHTML = '';
  completedTasksList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');

    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = task.text;
    li.appendChild(taskTextSpan);

    const dateAddedSpan = document.createElement('span');
    dateAddedSpan.textContent = task.dateAdded ? `Added on: ${formatDate(task.dateAdded)}` : '';
    li.appendChild(dateAddedSpan);

    if (task.dueDate) {
      const dueDateSpan = document.createElement('span');
      dueDateSpan.textContent = `Due on: ${formatDate(task.dueDate)}`;
      li.appendChild(dueDateSpan);
    }

    if (task.completed) {
      li.classList.add('completed');

      const dateCompletedSpan = document.createElement('span');
      dateCompletedSpan.textContent = task.dateCompleted ? `Completed on: ${formatDate(task.dateCompleted)}` : '';
      li.appendChild(dateCompletedSpan);
    }

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.addEventListener('click', () => {
      toggleTaskStatus(index);
    });

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
      editTask(index);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      deleteTask(index);
    });

    li.appendChild(completeButton);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    if (task.completed) {
      completedTasksList.appendChild(li);
    } else {
      pendingTasksList.appendChild(li);
    }
  });

  // Save tasks to LocalStorage
  saveTasks();
}

// Add a new task
function addTask(text, dueDate) {
  const newTask = {
    text,
    dueDate,
    completed: false,
    dateAdded: new Date().toISOString(),
    dateCompleted: null,
  };

  tasks.push(newTask);
  renderTasks();
}

// Toggle task status (Complete/Incomplete)
function toggleTaskStatus(index) {
  tasks[index].completed = !tasks[index].completed;
  tasks[index].dateCompleted = tasks[index].completed ? new Date().toISOString() : null;
  renderTasks();
}

// Edit task
function editTask(index) {
  const taskToEdit = tasks[index];
  const updatedTaskText = prompt('Edit the task:', taskToEdit.text);
  if (updatedTaskText !== null) {
    const updatedDueDate = prompt('Edit the due date:', taskToEdit.dueDate);
    tasks[index].text = updatedTaskText;
    tasks[index].dueDate = updatedDueDate;
    renderTasks();
  }
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

// Save tasks to LocalStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Format the date and time
function formatDate(dateTimeString) {
  const date = new Date(dateTimeString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  const dueDate = dueDateInput.value.trim();
  if (taskText !== '') {
    addTask(taskText, dueDate);
    taskInput.value = '';
    dueDateInput.value = '';
  }
});

// Initial rendering
renderTasks();
