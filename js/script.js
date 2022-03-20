const listsContainer = document.querySelector(".lists");
const newListForm = document.querySelector(".new-list");
const newListInput = document.querySelector(".new-list_list-name");

let lists = [
  { id: 1, name: "Home" },
  { id: 2, name: "Music" },
];

newListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName === null || listName === "") return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  render();
});

function createList(listName) {
  return { id: Date.now().toString(), name: listName, tasks: [] };
}

function render() {
  clearElement(listsContainer);

  lists.forEach((list) => {
    const newList = document.createElement("li");
    const listName = document.createElement("h3");
    const taskCounter = document.createElement("p");

    newList.classList.add("lists_list");
    listName.classList.add("lists_list-name");
    taskCounter.classList.add("lists_task-counter");

    newList.dataset.listId = list.id;
    listName.innerText = list.name;
    taskCounter.innerText = "5 tasks"; //need to automate

    newList.appendChild(listName);
    newList.appendChild(taskCounter);

    listsContainer.appendChild(newList);
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();
