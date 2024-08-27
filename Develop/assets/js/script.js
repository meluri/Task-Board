// Initialize localStorage if it's empty
let taskList = JSON.parse(localStorage.getItem('tasks')) || [];
let nextId = JSON.parse(localStorage.getItem('nextId')) || 1;

// Function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Function to create a task card
function createTaskCard(task) {
  const deadline = dayjs(task.deadline).format('MMMM D, YYYY');
  return `
    <div class="task-card card mb-2" data-id="${task.id}">
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.description}</p>
        <p class="card-text"><small class="text-muted">Due: ${deadline}</small></p>
        <button class="btn btn-danger btn-sm delete-task">Delete</button>
      </div>
    </div>`;
}

// Function to render the task list
function renderTaskList() {
  $('#todo-cards').empty();
  $('#in-progress-cards').empty();
  $('#done-cards').empty();

  taskList.forEach(task => {
    const taskCard = createTaskCard(task);
    if (task.status === 'todo') {
      $('#todo-cards').append(taskCard);
    } else if (task.status === 'in-progress') {
      $('#in-progress-cards').append(taskCard);
    } else if (task.status === 'done') {
      $('#done-cards').append(taskCard);
    }
  });

  // Add drag and drop functionality
  $(".task-card").draggable({
    revert: "invalid",
    helper: "clone"
  });

  // Add delete functionality
  $(".delete-task").on('click', function () {
    const id = $(this).closest('.task-card').data('id');
    deleteTask(id);
  });
}

// Handle form submission for adding new tasks
$('#task-form').on('submit', function (e) {
  e.preventDefault();

  const title = $('#task-title').val();
  const description = $('#task-description').val();
  const deadline = $('#task-deadline').val();

  const newTask = {
    id: generateTaskId(),
    title,
    description,
    deadline,
    status: 'todo' // Default to "To Do"
  };

  taskList.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(taskList));
  localStorage.setItem('nextId', JSON.stringify(nextId));

  renderTaskList();
  $('#formModal').modal('hide');
  $('#task-form')[0].reset();
});

// Handle task deletion
function deleteTask(id) {
  taskList = taskList.filter(task => task.id !== id);
  localStorage.setItem('tasks', JSON.stringify(taskList));
  renderTaskList();
}

// Initialize swim lanes with droppable functionality
$(".lane").droppable({
  accept: ".task-card",
  drop: function (event, ui) {
    const taskId = $(ui.draggable).data('id');
    const newStatus = $(this).attr('id') === 'to-do' ? 'todo' :
                      $(this).attr('id') === 'in-progress' ? 'in-progress' : 'done';
    
    taskList = taskList.map(task => {
      if (task.id === taskId) {
        task.status = newStatus;
      }
      return task;
    });

    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
  }
});

// Initial rendering of tasks from localStorage
$(document).ready(function () {
  renderTaskList();
});
