// Load tasks from localStorage when the page loads
document.addEventListener("DOMContentLoaded", loadTasks);

function toggleTheme() {
  const html = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");

  if (html.getAttribute("data-theme") === "dark") {
    html.removeAttribute("data-theme");
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "light");
  } else {
    html.setAttribute("data-theme", "dark");
    themeToggle.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  }
}

function addTask() {
  const input = document.getElementById("task-input");
  const todoList = document.getElementById("todo-list");

  if (input.value.trim() === "") return;

  const li = document.createElement("li");
  li.className = "todo-item";

  li.innerHTML = `
    <div class="todo-content">
      <input type="checkbox" class="task-checkbox" onclick="updateDeleteButtonState()">
      <span>${input.value}</span>
    </div>
    <button onclick="deleteTask(this)" class="delete-btn">🗑️</button>
  `;

  todoList.appendChild(li);
  input.value = "";
  updateDeleteButtonState();
}

function toggleSelectAll() {
  const selectAllCheckbox = document.getElementById("select-all");
  const todoItems = document.querySelectorAll(".task-checkbox");

  todoItems.forEach((checkbox) => {
    checkbox.checked = selectAllCheckbox.checked;
    const todoItem = checkbox.closest(".todo-item");
    todoItem.classList.toggle("selected", selectAllCheckbox.checked);
  });

  updateDeleteButtonState();
}

function updateDeleteButtonState() {
  const deleteSelectedBtn = document.getElementById("delete-selected");
  const selectedItems = document.querySelectorAll(".task-checkbox:checked");
  deleteSelectedBtn.disabled = selectedItems.length === 0;
}

function deleteTask(button) {
  const todoItem = button.closest(".todo-item");
  todoItem.classList.add("fade-out");

  setTimeout(() => {
    todoItem.remove();
    updateDeleteButtonState();
    // Update select all checkbox state
    updateSelectAllState();
  }, 300);
}

function deleteSelected() {
  const selectedItems = document.querySelectorAll(".task-checkbox:checked");

  if (selectedItems.length === 0) return;

  const confirmMessage =
    selectedItems.length === 1
      ? "Delete this task?"
      : `Delete ${selectedItems.length} tasks?`;

  if (confirm(confirmMessage)) {
    selectedItems.forEach((checkbox) => {
      const todoItem = checkbox.closest(".todo-item");
      todoItem.classList.add("fade-out");
      setTimeout(() => todoItem.remove(), 300);
    });

    document.getElementById("select-all").checked = false;
    updateDeleteButtonState();
  }
}

function updateSelectAllState() {
  const selectAllCheckbox = document.getElementById("select-all");
  const allCheckboxes = document.querySelectorAll(".task-checkbox");
  const allChecked = document.querySelectorAll(".task-checkbox:checked");

  selectAllCheckbox.checked =
    allCheckboxes.length > 0 && allCheckboxes.length === allChecked.length;
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll(".todo-item").forEach((li) => {
    tasks.push({
      id: parseInt(li.dataset.id),
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => createTaskElement(task));
}

// Add task when Enter key is pressed
document
  .getElementById("task-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTask();
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    document.getElementById("theme-toggle").textContent = "☀️";
  }
});

// Add theme toggle event listener
document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
