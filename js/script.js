const listsContainer = document.querySelector(".lists");
const newListForm = document.querySelector(".lists_list-creator");
const newListInput = document.querySelector(".list-creator_list-name");

const tasksSection = document.querySelector(".section-tasks");
const tasksContainer = document.querySelector(".tasks");
const tasksListName = document.querySelector(".tasks_list-name");
const tasksCounterString = document.querySelector(".tasks_tasks-counter");
const taskTemplate = document.getElementById("task-template");
const newTaskForm = document.querySelector(".tasks_task-creator");
const newTaskInput = document.querySelector(".task-creator_task-name");

const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

let selectedList = lists.find((list) => list.id === selectedListId) || null;

render();

listsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("lists_delete-list-btn")) {
    const clickedListId = e.target.closest(".lists_list").dataset.listId;

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

  if (e.target.closest(".lists_list").tagName.toLowerCase() === "li") {
    selectedListId = e.target.closest(".lists_list").dataset.listId;
    saveAndRender();
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
  currentList.tasks.push(task);
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
    const checkbox = taskElement.querySelector("input");
    const label = taskElement.querySelector("label");

    checkbox.id = task.id;
    checkbox.checked = task.complete;

    label.htmlFor = task.id;
    label.append(task.name);

    tasksContainer.appendChild(taskElement);
  });
}

function getTaskCount(list) {
  const incompleteTasksCount = list.tasks.filter(
    (task) => !task.complete
  ).length;
  const taskString = incompleteTasksCount === 1 ? "task" : "tasks";
  return `${incompleteTasksCount} ${taskString} remaining`;
}

function renderLists() {
  lists.forEach((list) => {
    const listElement = document.createElement("li");
    const listName = document.createElement("h3");
    const taskCounter = document.createElement("p");
    const deleteListBtn = document.createElement("div");

    listElement.classList.add("lists_list");
    listName.classList.add("lists_list-name");
    taskCounter.classList.add("lists_tasks-counter", "tasks-counter");
    deleteListBtn.classList.add("lists_delete-list-btn");

    listElement.dataset.listId = list.id;
    listName.innerText = list.name;
    taskCounter.innerText = getTaskCount(list);
    deleteListBtn.innerText = "X";

    if (listElement.dataset.listId === selectedListId) {
      listElement.classList.add("lists_list__active");
    }

    listElement.appendChild(listName);
    listElement.appendChild(taskCounter);
    listElement.appendChild(deleteListBtn);

    listsContainer.appendChild(listElement);
  });
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
