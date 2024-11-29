let expenses = [];
let totalIncome = 0;
let totalExpense = 0;

const categorySelect = document.getElementById("category");
const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");
const dateInput = document.getElementById("date");
const addBtn = document.getElementById("add-btn");
const resetBtn = document.getElementById("reset-btn");
const expenseData = document.getElementById("expense-data");
const totalIncomeCell = document.getElementById("Total-income-amount");
const totalExpenseCell = document.getElementById("Total-expense-amount");
const netValueCell = document.getElementById("net-value");
const applyFilterBtn = document.getElementById("apply-filter-btn");

let isEditing = false;
let editIndex = -1;
function saveToLocalStorage() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}
function loadFromLocalStorage() {
  const storedExpenses = localStorage.getItem("expenses");
  if (storedExpenses) {
    expenses = JSON.parse(storedExpenses);
    renderTable(expenses);
  }
}

function updateTotalsAndSave() {
  updateTotals();
  saveToLocalStorage();
}

function updateTotals() {
  totalIncome = expenses
    .filter((expense) => expense.category === "income")
    .reduce((sum, expense) => sum + expense.amount, 0);
  totalExpense = expenses
    .filter((expense) => expense.category === "expense")
    .reduce((sum, expense) => sum + expense.amount, 0);

  totalIncomeCell.textContent = totalIncome.toFixed(2);
  totalExpenseCell.textContent = totalExpense.toFixed(2);
  netValueCell.textContent = (totalIncome - totalExpense).toFixed(2);
}

function clearForm() {
  categorySelect.value = "income";
  amountInput.value = "";
  descriptionInput.value = "";
  dateInput.value = "";
}
function renderTable(filteredExpenses) {
  expenseData.innerHTML = "";
  filteredExpenses.forEach((expense, index) => {
    const newRow = expenseData.insertRow();
    newRow.insertCell().textContent = index + 1;
    newRow.insertCell().textContent =
      expense.category === "income" ? expense.amount.toFixed(2) : "- -";
    newRow.insertCell().textContent =
      expense.category === "expense" ? expense.amount.toFixed(2) : "- -";
    newRow.insertCell().textContent = expense.description;
    newRow.insertCell().textContent = expense.date;

    const actionCell = newRow.insertCell();
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => {
      expenses.splice(index, 1);
      renderTable(expenses);
      updateTotalsAndSave();
    });
    actionCell.appendChild(deleteBtn);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener("click", () => {
      categorySelect.value = expense.category;
      amountInput.value = expense.amount;
      descriptionInput.value = expense.description;
      dateInput.value = expense.date;

      isEditing = true;
      editIndex = index;
      addBtn.textContent = "Update";
    });
    actionCell.appendChild(editBtn);
  });

  updateTotals();
}

addBtn.addEventListener("click", () => {
  const category = categorySelect.value;
  const amount = Number(amountInput.value);
  const description = descriptionInput.value;
  const date = dateInput.value;

  if (!amount || amount <= 0 || !description || !date) {
    alert("Please fill all fields with valid data.");
    return;
  }

  if (isEditing) {
    expenses[editIndex] = { category, amount, description, date };
    isEditing = false;
    editIndex = -1;
    addBtn.textContent = "Add";
  } else {
    expenses.push({ category, amount, description, date });
  }

  clearForm();
  renderTable(expenses);
  updateTotalsAndSave();
});
resetBtn.addEventListener("click", clearForm);
applyFilterBtn.addEventListener("click", () => {
  const selectedFilter = document.querySelector(
    'input[name="filter"]:checked'
  ).value;
  const filteredExpenses = expenses.filter(
    (expense) => selectedFilter === "all" || expense.category === selectedFilter
  );
  renderTable(filteredExpenses);
});

document.addEventListener("DOMContentLoaded", loadFromLocalStorage);
