const TODOS = [];
const RENDER_EVENT = "render-todo";
const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";

const generateTodoObject = (id, task, timestamp, isCompleted) => ({
  id,
  task,
  timestamp,
  isCompleted,
});

const generateId = () => +new Date();

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
};

const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      TODOS.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const addTodo = () => {
  const textTodo = document.getElementById("title").value;
  const timestamp = document.getElementById("date").value;
  const generatedID = generateId();
  const todoObject = generateTodoObject(
    generatedID,
    textTodo,
    timestamp,
    false
  );

  TODOS.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const findTodo = (todoId) => {
  for (const todoItem of TODOS) {
    if (todoItem.id === todoId) return todoItem;
  }
  return null;
};

const saveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(TODOS);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

const addTaskToCompleted = (todoId) => {
  const todoTarget = findTodo(todoId);

  if (todoTarget != null) {
    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
};

const findTodoIndex = (todoId) => {
  for (const index in TODOS) {
    if (TODOS[index].id === todoId) {
      return index;
    }
  }

  return -1;
};

const removeTaskFromCompleted = (todoId) => {
  const todoTarget = findTodoIndex(todoId);

  if (todoTarget === -1) return;

  TODOS.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const undoTaskFromCompleted = (todoId) => {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const makeTodo = (todoObject) => {
  const textTitle = document.createElement("h2");
  textTitle.innerText = todoObject.task;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = todoObject.timestamp;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `todo-${todoObject.id}`);

  if (todoObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", () =>
      undoTaskFromCompleted(todoObject.id)
    );

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", () =>
      removeTaskFromCompleted(todoObject.id)
    );

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", () =>
      addTaskToCompleted(todoObject.id)
    );

    container.append(checkButton);
  }

  return container;
};

document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTodo();
  });

  isStorageExist() && loadDataFromStorage();
});

document.addEventListener(RENDER_EVENT, () => {
  const uncompletedTODOList = document.getElementById("todos");
  uncompletedTODOList.innerHTML = "";

  const completedTODOList = document.getElementById("finished");
  completedTODOList.innerHTML = "";

  for (const todoItem of TODOS) {
    const todoElement = makeTodo(todoItem);
    !todoItem.isCompleted
      ? uncompletedTODOList.append(todoElement)
      : completedTODOList.append(todoElement);
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log(localStorage.getItem(STORAGE_KEY));
});
