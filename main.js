import { SESSION_KEYS, FILTERS } from "./constants.js";
import { getSessionItem, setSessionItem } from "./utility.js";

const todoList = [
  {
    id: 0,
    completed: false,
    title: "do the dishes",
  },
  {
    id: 1,
    completed: true,
    title: "homework",
  },
  {
    id: 2,
    completed: false,
    title: "cleaning",
  },
];

setSessionItem(SESSION_KEYS.TODO_LIST, todoList);

document.addEventListener("DOMContentLoaded", () => {
  const addTodoBtn = document.querySelector("#add-todo-btn");
  const inputEl = document.querySelector("#add-input");
  const allFilter = document.querySelector("#all-filter");
  const activeFilter = document.querySelector("#active-filter");
  const completedFilter = document.querySelector("#completed-filter");

  addTodoBtn.addEventListener("click", () => {
    const sessionStorageData = getSessionItem(SESSION_KEYS.TODO_LIST);
    const inputVal = inputEl.value;
    if (inputVal.length > 0) {
      const newItem = {
        id: sessionStorageData.at(-1).id + 1,
        completed: false,
        title: inputVal,
      };

      const newSessionData = [...sessionStorageData, newItem];

      setSessionItem(SESSION_KEYS.TODO_LIST, newSessionData);

      renderList();
    }
  });

  allFilter.addEventListener("click", () => {
    setSessionItem(SESSION_KEYS.ITEMS_FILTER, FILTERS.ALL);
    renderList();
  });

  activeFilter.addEventListener("click", () => {
    setSessionItem(SESSION_KEYS.ITEMS_FILTER, FILTERS.ACTIVE);
    renderList();
  });

  completedFilter.addEventListener("click", () => {
    setSessionItem(SESSION_KEYS.ITEMS_FILTER, FILTERS.COMPLETED);
    renderList();
  });

  renderList();
});

const renderList = () => {
  let dataToRender;

  switch (getSessionItem(SESSION_KEYS.ITEMS_FILTER)) {
    case FILTERS.ALL:
      dataToRender = getAllFilterItems();
      break;
    case FILTERS.ACTIVE:
      dataToRender = getActiveFilterItems();
      break;
    case FILTERS.COMPLETED:
      dataToRender = getCompletedFilterItems();
      break;
    default:
      dataToRender = getAllFilterItems();
      break;
  }

  if (!dataToRender) {
    return null;
  }

  const todoContainer = document.querySelector(".todo");
  todoContainer.innerHTML = "";

  dataToRender.forEach((item) => {
    const div = document.createElement("div");
    const para = document.createElement("p");
    const deleteBtn = document.createElement("button");
    const doneBtn = document.createElement("button");
    const node = document.createTextNode(item.title);
    doneBtn.innerHTML = item.completed ? "Undone" : "Done";
    deleteBtn.innerHTML = "Delete";

    deleteBtn.classList.add("btn");
    doneBtn.classList.add("btn");
    div.classList.add("todo-item");
    para.classList.add("text");

    if (item.completed) {
      para.classList.add("done");
    } else {
      para.classList.remove("done");
    }

    deleteBtn.addEventListener("click", () => {
      deleteHandler(item);
    });

    doneBtn.addEventListener("click", () => {
      changeCompletedState(item);
    });

    para.append(node);
    div.append(para);
    div.append(deleteBtn);
    div.append(doneBtn);

    todoContainer.append(div);
  });
};

const deleteHandler = (item) => {
  const sessionData = getSessionItem(SESSION_KEYS.TODO_LIST);
  const itemIdx = sessionData?.findIndex((todo) => todo.id === item.id);
  sessionData.splice(itemIdx, 1);
  setSessionItem(SESSION_KEYS.TODO_LIST, sessionData);
  renderList();
};

const changeCompletedState = (item) => {
  const sessionData = getSessionItem(SESSION_KEYS.TODO_LIST);
  const itemIdx = sessionData?.findIndex((todo) => todo.id === item.id);
  const updatedItem = { ...item, completed: !item.completed };
  sessionData.splice(itemIdx, 1, updatedItem);
  setSessionItem(SESSION_KEYS.TODO_LIST, sessionData);
  renderList();
};

const getAllFilterItems = () => {
  return getSessionItem(SESSION_KEYS.TODO_LIST);
};

const getActiveFilterItems = () => {
  return getSessionItem(SESSION_KEYS.TODO_LIST).filter(
    (item) => !item.completed
  );
};

const getCompletedFilterItems = () => {
  return getSessionItem(SESSION_KEYS.TODO_LIST).filter(
    (item) => item.completed
  );
};
