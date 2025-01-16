// Step 1: Get references to the HTML elements
const newItemInput = document.getElementById("newItem"); // Input box
const categorySelect = document.getElementById("categorySelect"); // Add Item Category
const filterCategory = document.getElementById("filterCategory"); // Filter Category
const filterButton = document.getElementById("filterButton"); // Filter Button
const addItemButton = document.getElementById("addItem"); // Add button
const todoList = document.getElementById("todoList"); // Unordered list
const clearCompletedButton = document.getElementById("clearCompleted"); // Clear Completed Button
const taskCountDisplay = document.getElementById("taskCount"); // Display task count
const completedCountDisplay = document.getElementById("completedCount"); // Display completed tasks count

// Function to save the list to localStorage
function saveList() {
  const items = [];
  document.querySelectorAll("#todoList li").forEach((item) => {
    items.push({
      text: item.firstChild.textContent.trim(),
      category: item.getAttribute("data-category"),
      completed: item.classList.contains("completed"),
    });
  });
  localStorage.setItem("todoList", JSON.stringify(items));
  updateTaskCounts(); // Update task counts when the list is saved
}

// Function to load the list from localStorage
function loadList() {
  const savedItems = JSON.parse(localStorage.getItem("todoList")) || [];
  savedItems.forEach((item) => {
    addItemToDOM(item.text, item.category, item.completed);
  });
  updateTaskCounts(); // Update task counts after loading
}

// Function to update task counts
function updateTaskCounts() {
  const totalTasks = document.querySelectorAll("#todoList li").length;
  const completedTasks = document.querySelectorAll("#todoList li.completed").length;
  taskCountDisplay.textContent = `Total Tasks: ${totalTasks}`;
  completedCountDisplay.textContent = `Completed Tasks: ${completedTasks}`;
}

// Function to add an item to the DOM
function addItemToDOM(text, category, completed = false) {
  const listItem = document.createElement("li");
  listItem.textContent = text;
  listItem.setAttribute("data-category", category);

  // Mark item as completed if needed
  if (completed) {
    listItem.classList.add("completed");
  }

  const categorySpan = document.createElement("span");
  categorySpan.textContent = ` [${category}]`;
  categorySpan.style.color = "blue";
  listItem.appendChild(categorySpan);

  // Add toggle completed event
  listItem.addEventListener("click", () => {
    listItem.classList.toggle("completed");
    saveList(); // Save the updated list
  });

  // Add delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.style.marginLeft = "10px";

  // Delete the item and save the updated list
  deleteButton.addEventListener("click", () => {
    const confirmed = confirm("Are you sure you want to delete this task?");
  if (confirmed) {
    todoList.removeChild(listItem);
    saveList(); // Save the updated list after deletion
  }
  });

  // Add edit functionality
  listItem.addEventListener("dblclick", () => {
    const newText = prompt("Edit task:", listItem.firstChild.textContent.trim());
    const newCategory = prompt("Edit category:", category);
    
    if (newText !== null && newText.trim() !== "") {
      listItem.firstChild.textContent = newText.trim();
      listItem.setAttribute("data-category", newCategory);
      saveList(); // Save the updated list
    }
  });

  // Append delete button and add the item to the list
  listItem.appendChild(deleteButton);
  todoList.appendChild(listItem);
  updateTaskCounts(); // Update task counts when an item is added
}

// Add new items to the to-do list
addItemButton.addEventListener("click", () => {
  const newItemText = newItemInput.value.trim();
  const category = categorySelect.value;

  if (newItemText !== "") {
    addItemToDOM(newItemText, category);
    saveList(); // Save the updated list
    newItemInput.value = ""; // Clear the input
  } else {
    alert("Please enter an item!");
  }
});

// Clear completed tasks
clearCompletedButton.addEventListener("click", () => {
  document.querySelectorAll("#todoList li.completed").forEach((item) => {
    todoList.removeChild(item);
  });
  saveList(); // Save the updated list
});

// Filter tasks based on the selected category
filterButton.addEventListener("click", () => {
  const selectedCategory = filterCategory.value;
  document.querySelectorAll("#todoList li").forEach((item) => {
    const itemCategory = item.getAttribute("data-category");
    if (selectedCategory === "All" || selectedCategory === itemCategory) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
});


// Load the list when the page is loaded
window.addEventListener("load", loadList);

// Dark mode toggle function
const darkModeToggle = document.getElementById("darkModeToggle");

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.querySelector("section").classList.toggle("dark-mode");
  document.querySelectorAll("input, select, button").forEach((element) => {
    element.classList.toggle("dark-mode");
  });
  document.querySelectorAll("#todoList li").forEach((item) => {
    item.classList.toggle("dark-mode");
  });
});

