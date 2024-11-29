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
// localstorage
function saveToLocalStorage() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}
function FromLocalStorage() {
  const storedExpenses = localStorage.getItem("expenses");
  if (storedExpenses) {
    expenses = JSON.parse(storedExpenses);
    Table(expenses);
  }
}
// display values of income & expense
function updateTotal() {
  totalIncome = expenses
    .filter((expense) => expense.category === "income")
    .reduce((sum, expense) => sum + expense.amount, 0);
  totalExpense = expenses
    .filter((expense) => expense.category === "expense")
    .reduce((sum, expense) => sum + expense.amount, 0);

  totalIncomeCell.textContent = `Total Income: ₹ ${totalIncome.toFixed(2)}`;
  totalExpenseCell.textContent = `Total Expense: ₹ ${totalExpense.toFixed(2)}`;
  netValueCell.textContent = `Net Balance: ₹ ${(
    totalIncome - totalExpense
  ).toFixed(2)}`;
}
// reset form

function clearForm() {
  categorySelect.value = "income";
  amountInput.value = "";
  descriptionInput.value = "";
  dateInput.value = "";
}
// table creation
function Table(filteredExpenses) {
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
    // delete button inside table
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.backgroundColor = "red";
    deleteBtn.style.color = "white";
    deleteBtn.style.border = "none";
    deleteBtn.style.padding = "5px 10px";
    deleteBtn.style.borderRadius = "5px";
    deleteBtn.addEventListener("click", () => {
      expenses.splice(index, 1);
      Table(expenses);
      updateTotal();
      saveToLocalStorage();
    });
    actionCell.appendChild(deleteBtn);

    // edit button inside table
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.style.backgroundColor = "blue";
    editBtn.style.color = "white";
    editBtn.style.border = "none";
    editBtn.style.padding = "5px 10px";
    editBtn.style.borderRadius = "5px";
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

  updateTotal();
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
  Table(expenses);
  saveToLocalStorage();
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

document.addEventListener("DOMContentLoaded", FromLocalStorage);
