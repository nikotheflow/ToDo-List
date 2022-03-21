const listsContainer = document.querySelector(".lists");
const newListForm = document.querySelector(".new-list");
const newListInput = document.querySelector(".new-list_list-name");

const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

listsContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "ul") return;

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

function createList(listName) {
  return { id: Date.now().toString(), name: listName, tasks: [] };
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

function render() {
  clearElement(listsContainer);

  lists.forEach((list) => {
    const listElement = document.createElement("li");
    const listName = document.createElement("h3");
    const taskCounter = document.createElement("p");
    const deleteListBtn = document.createElement("div");

    listElement.classList.add("lists_list");
    listName.classList.add("lists_list-name");
    taskCounter.classList.add("lists_task-counter");
    deleteListBtn.classList.add("lists_delete-list-btn");

    listElement.dataset.listId = list.id;
    listName.innerText = list.name;
    taskCounter.innerText = "5 tasks"; //need to automate
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

render();
