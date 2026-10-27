
const API_URL = "/api/tasks";

const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const descriptionInput = document.querySelector("#task-description");
const taskList = document.querySelector("#task-list");
const message = document.querySelector("#message");
const submitButton = document.querySelector("#submit-button");
const cancelButton = document.querySelector("#cancel-edit");

let tasks = [];
let editingId = null;

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

async function apiRequest(path = "", options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Request failed (${response.status})`);
  }

  if (response.status === 204) return null;
  return response.json();
}

function makeButton(label, action, extraClass = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `small-button ${extraClass}`.trim();
  button.textContent = label;
  button.addEventListener("click", action);
  return button;
}

function renderTasks() {
  document.querySelector("#total-count").textContent = tasks.length;
  document.querySelector("#pending-count").textContent =
    tasks.filter((task) => !task.completed).length;
  document.querySelector("#completed-count").textContent =
    tasks.filter((task) => task.completed).length;

  taskList.replaceChildren();

  if (tasks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No tasks yet. Add your first task above!";
    taskList.append(empty);
    return;
  }

  for (const task of tasks) {
    const card = document.createElement("article");
    card.className = `task-card ${task.completed ? "completed" : ""}`;

    const top = document.createElement("div");
    top.className = "task-top";

    const title = document.createElement("h3");
    title.className = "task-title";
    title.textContent = task.title;

    const status = document.createElement("span");
    status.className = `status ${task.completed ? "done" : ""}`;
    status.textContent = task.completed ? "Completed" : "Pending";

    top.append(title, status);
    card.append(top);

    if (task.description) {
      const description = document.createElement("p");
      description.className = "task-description";
      description.textContent = task.description;
      card.append(description);
    }

    const actions = document.createElement("div");
    actions.className = "task-actions";

    actions.append(
      makeButton(
        task.completed ? "Mark pending" : "Complete",
        () => updateTask(task.id, { completed: !task.completed })
      ),
      makeButton("Edit", () => beginEdit(task)),
      makeButton("Delete", () => deleteTask(task.id), "delete")
    );

    card.append(actions);
    taskList.append(card);
  }
}

async function loadTasks() {
  taskList.replaceChildren();
  const loading = document.createElement("p");
  loading.className = "empty-state";
  loading.textContent = "Loading tasks...";
  taskList.append(loading);

  try {
    tasks = await apiRequest();
    renderTasks();
  } catch (error) {
    taskList.replaceChildren();
    const errorText = document.createElement("p");
    errorText.className = "empty-state";
    errorText.textContent = error.message;
    taskList.append(errorText);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title) {
    showMessage("Please enter a task title.", true);
    return;
  }

  submitButton.disabled = true;

  try {
    if (editingId) {
      await apiRequest(`/${encodeURIComponent(editingId)}`, {
        method: "PUT",
        body: JSON.stringify({ title, description }),
      });
      showMessage("Task updated successfully.");
    } else {
      await apiRequest("", {
        method: "POST",
        body: JSON.stringify({ title, description }),
      });
      showMessage("Task created successfully.");
    }

    resetForm();
    await loadTasks();
  } catch (error) {
    showMessage(error.message, true);
  } finally {
    submitButton.disabled = false;
  }
});

function beginEdit(task) {
  editingId = task.id;
  titleInput.value = task.title;
  descriptionInput.value = task.description || "";
  submitButton.textContent = "Save changes";
  cancelButton.classList.remove("hidden");
  document.querySelector("#form-heading").textContent = "Edit task";
  titleInput.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  editingId = null;
  form.reset();
  submitButton.textContent = "Add task";
  cancelButton.classList.add("hidden");
  document.querySelector("#form-heading").textContent = "Create a task";
}

cancelButton.addEventListener("click", () => {
  resetForm();
  showMessage("");
});

async function updateTask(id, changes) {
  try {
    await apiRequest(`/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(changes),
    });
    showMessage("Task status updated.");
    await loadTasks();
  } catch (error) {
    showMessage(error.message, true);
  }
}

async function deleteTask(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;

  if (!window.confirm(`Delete "${task.title}"?`)) return;

  try {
    await apiRequest(`/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    showMessage("Task deleted.");
    await loadTasks();
  } catch (error) {
    showMessage(error.message, true);
  }
}

document.querySelector("#refresh-button").addEventListener("click", loadTasks);

loadTasks();
