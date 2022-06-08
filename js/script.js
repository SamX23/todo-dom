const TODOS = [];

const RENDER_EVENT = "render-todo";

const generateTodoObject = (id, task, timestamp, isCompleted) => ({
  id,
  task,
  timestamp,
  isCompleted,
});

const generateId = () => +new Date();

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

  return container;
};

document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTodo();
  });
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById("todos");
  uncompletedTODOList.innerHTML = "";

  for (const todoItem of TODOS) {
    const todoElement = makeTodo(todoItem);
    uncompletedTODOList.append(todoElement);
  }
});
