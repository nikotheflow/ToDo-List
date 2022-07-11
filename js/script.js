const listsContainer = document.querySelector('.lists');
const listTemplate = document.getElementById('list-template');
const newListForm = document.querySelector('.new-list-form');
const newListInput = document.querySelector('.new-list-input');

const tasksSection = document.querySelector('.section-tasks');
const tasksContainer = document.querySelector('.tasks');
const tasksListName = document.querySelector('.tasks__list-title');
const tasksCounterString = document.querySelector('.tasks__tasks-counter');
const taskTemplate = document.getElementById('task-template');
const newTaskForm = document.querySelector('.new-task-form');
const newTaskInput = document.querySelector('.new-task-input');

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

let selectedList = lists.find((list) => list.id === selectedListId) || '0';

// lists for demonstration functions of ToDo List
if (localStorage.getItem(LOCAL_STORAGE_LIST_KEY) === null) {
  lists = [
    {
      id: '1652105830989',
      name: 'Study',
      tasks: [
        { id: '1652105938571', name: 'Learn javascript', complete: false },
        { id: '1652105949820', name: 'Make a pet project', complete: true },
        { id: '1652105980364', name: 'Listen english lesson', complete: true },
      ],
    },
    {
      id: '1652105833060',
      name: 'Work',
      tasks: [
        { id: '1652105872813', name: 'Write documentation', complete: false },
        {
          id: '1652105906143',
          name: 'Fix bugs with clean lists',
          complete: true,
        },
      ],
    },
    {
      id: '1652105838520',
      name: 'Shop',
      tasks: [
        { id: '1652105856253', name: 'Cheese', complete: false },
        { id: '1652105854450', name: 'Milk', complete: false },
        { id: '1652105850100', name: 'Tomatoes', complete: false },
        { id: '1652105847070', name: 'Cucumber', complete: false },
        { id: '1652105843440', name: 'Broad', complete: false },
      ],
    },
    {
      id: '1652106072223',
      name: 'Test list to remove',
      tasks: [
        { id: '1652106083562', name: 'I want you delete me', complete: false },
        {
          id: '1652106114252',
          name: 'Check, uncheck, delete',
          complete: false,
        },
        {
          id: '1652106093282',
          name: 'I want you check me and delete',
          complete: false,
        },
        { id: '1652106099702', name: 'Just delete me', complete: false },
        {
          id: '1652108354519',
          name: 'And I am just task with very very very super mega hyper giga loooong title',
          complete: false,
        },
        { id: '1652106078582', name: 'Delete me', complete: false },
      ],
    },
  ];

  selectedListId = '1652105830989';

  save();
}

render();

listsContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const clickedListId = e.target.closest('.list-link').dataset.listId;

    lists = lists.filter((list) => list.id !== clickedListId);

    if (selectedListId === clickedListId) {
      selectedListId = lists[0] ? lists[0].id : '0';
    }

    saveAndRender();
    return;
  }

  if (e.target.tagName.toLowerCase() === 'ul') {
    return;
  }

  if (e.target.closest('.list-link').tagName.toLowerCase() === 'li') {
    selectedListId = e.target.closest('.list-link').dataset.listId;
    selectedList = lists.find((list) => list.id === selectedListId);
    saveAndRender();
  }
});

tasksContainer.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'li') {
    const selectedTask = selectedList.tasks.find((task) => task.id === e.target.dataset.taskId);
    const selectedTaskCheckbox = e.target.querySelector('.task-checkbox');

    selectedTaskCheckbox.checked = !selectedTaskCheckbox.checked;

    selectedTask.complete = selectedTaskCheckbox.checked;

    moveTask(selectedTask);
    saveAndRender();
  }

  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedTask = selectedList.tasks.find((task) => task.id === e.target.id);

    selectedTask.complete = e.target.checked;

    moveTask(selectedTask);
    saveAndRender();
  }

  if (e.target.tagName.toLowerCase() === 'button') {
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.closest('.task').dataset.taskId,
    );
    const selectedTaskIndex = selectedList.tasks.indexOf(selectedTask);

    if (e.target.classList.contains('tasks__delete-btn')) {
      selectedList.tasks.splice(selectedTaskIndex, 1);
      saveAndRender();
    }
  }
});

newListForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName === null || listName === '') return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
});

newTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if (taskName === null || taskName === '') return;

  const task = createTask(taskName);
  newTaskInput.value = null;

  const currentList = lists.find((list) => list.id === selectedListId);
  currentList.tasks.unshift(task);
  saveAndRender();
});

function createTask(taskName) {
  return { id: Date.now().toString(), name: taskName, complete: false };
}

function createList(listName) {
  return {
    id: Date.now().toString(),
    name: listName,
    tasks: [],
  };
}

function moveTask(selectedTask) {
  const selectedTaskIndex = selectedList.tasks.indexOf(selectedTask);

  selectedList.tasks.splice(selectedTaskIndex, 1);

  selectedTask.complete === true
    ? selectedList.tasks.push(selectedTask)
    : selectedList.tasks.unshift(selectedTask);
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

function render() {
  clearElement(listsContainer);
  renderLists();

  if (selectedListId === '0') {
    tasksSection.style.display = 'none';
  } else {
    const selectedList = lists.find((list) => list.id === selectedListId);

    tasksSection.style.display = '';
    tasksListName.innerText = selectedList.name;
    tasksCounterString.innerText = getTaskCount(selectedList);
    clearElement(tasksContainer);
    renderTasks(selectedList);
  }
}

function renderTasks(list) {
  list.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const taskItem = taskElement.querySelector('li');
    const checkbox = taskElement.querySelector('input');
    const label = taskElement.querySelector('label');

    taskItem.dataset.taskId = task.id;

    checkbox.id = task.id;
    checkbox.checked = task.complete;

    label.htmlFor = task.id;
    label.append(task.name);

    tasksContainer.appendChild(taskElement);
  });
}

function renderLists() {
  lists.forEach((list) => {
    const listElement = document.importNode(listTemplate.content, true);
    const listItem = listElement.querySelector('li');
    const listName = listElement.querySelector('h3');
    const taskCounter = listElement.querySelector('p');

    listItem.dataset.listId = list.id;
    listName.innerText = list.name;
    taskCounter.innerText = getTaskCount(list);

    if (listItem.dataset.listId === selectedListId) {
      listItem.classList.add('list-link_active');
    }

    listsContainer.appendChild(listElement);
  });
}

function getTaskCount(list) {
  const incompleteTasksCount = list.tasks.filter((task) => !task.complete).length;
  const taskString = incompleteTasksCount === 1 ? 'task' : 'tasks';
  return `${incompleteTasksCount} ${taskString} remaining`;
}

function saveAndRender() {
  save();
  render();
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
