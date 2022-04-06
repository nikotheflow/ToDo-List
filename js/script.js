const listsContainer = document.querySelector(".lists");
const listTemplate = document.getElementById("list-template");
const newListForm = document.querySelector(".lists_list-creator");
const newListInput = document.querySelector(".list-creator_list-title");

const tasksSection = document.querySelector(".section-tasks");
const tasksContainer = document.querySelector(".tasks");
const tasksListName = document.querySelector(".tasks__list-title");
const tasksCounterString = document.querySelector(".tasks__tasks-counter");
const taskTemplate = document.getElementById("task-template");
const newTaskForm = document.querySelector(".new-task-form");
const newTaskInput = document.querySelector(".new-task-input");

const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

let selectedList = lists.find((list) => list.id === selectedListId) || null;

render();

listsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const clickedListId = e.target.closest(".list-link").dataset.listId;

    lists = lists.filter((list) => list.id !== clickedListId);

    if (selectedListId === clickedListId) {
      selectedListId = lists[0] ? lists[0].id : null;
    }

    saveAndRender();
    return;
  }

  if (e.target.tagName.toLowerCase() === "ul") {
    return;
  }

  if (e.target.closest(".list-link").tagName.toLowerCase() === "li") {
    selectedListId = e.target.closest(".list-link").dataset.listId;
    selectedList = lists.find((list) => list.id === selectedListId);
    saveAndRender();
  }
});

tasksContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.id
    );
    const selectedTaskIndex = selectedList.tasks.indexOf(selectedTask);

    selectedTask.complete = e.target.checked;

    selectedList.tasks.splice(selectedTaskIndex, 1);

    selectedTask.complete === true
      ? selectedList.tasks.push(selectedTask)
      : selectedList.tasks.unshift(selectedTask);

    saveAndRender();
  }

  if (e.target.tagName.toLowerCase() === "button") {
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.closest(".task").dataset.taskId
    );
    const selectedTaskIndex = selectedList.tasks.indexOf(selectedTask);

    if (e.target.classList.contains("task-delete-btn")) {
      selectedList.tasks.splice(selectedTaskIndex, 1);
      saveAndRender();
    } else if (e.target.classList.contains("task-edit-btn")) {
      console.log(edit);
    }
  }
});

newListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName === null || listName === "") return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
});

newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if (taskName === null || taskName === "") return;

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

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

function render() {
  clearElement(listsContainer);
  renderLists();

  if (selectedListId === null) {
    tasksSection.style.display = "none";
  } else {
    const selectedList = lists.find((list) => list.id === selectedListId);

    tasksSection.style.display = "";
    tasksListName.innerText = selectedList.name;
    tasksCounterString.innerText = getTaskCount(selectedList);
    clearElement(tasksContainer);
    renderTasks(selectedList);
  }
}

function renderTasks(list) {
  list.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const taskItem = taskElement.querySelector("li");
    const checkbox = taskElement.querySelector("input");
    const label = taskElement.querySelector("label");

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
    const listItem = listElement.querySelector("li");
    const listName = listElement.querySelector("h3");
    const taskCounter = listElement.querySelector("p");

    listItem.dataset.listId = list.id;
    listName.innerText = list.name;
    taskCounter.innerText = getTaskCount(list);

    if (listItem.dataset.listId === selectedListId) {
      listItem.classList.add("list-link_active");
    }

    listsContainer.appendChild(listElement);
  });
}

function getTaskCount(list) {
  const incompleteTasksCount = list.tasks.filter(
    (task) => !task.complete
  ).length;
  const taskString = incompleteTasksCount === 1 ? "task" : "tasks";
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
