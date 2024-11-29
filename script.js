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

let isEditing = false;
let editIndex = -1;

function updateTotals() {
  // Recalculate the total income and total expenses from the array
  totalIncome = expenses
    .filter((expense) => expense.category === "income")
    .reduce((sum, expense) => sum + expense.amount, 0);
  totalExpense = expenses
    .filter((expense) => expense.category === "expense")
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Update the displayed totals
  totalIncomeCell.textContent = totalIncome.toFixed(2);
  totalExpenseCell.textContent = totalExpense.toFixed(2);

  // Calculate the net value and display it
  const netValue = totalIncome - totalExpense;
  netValueCell.textContent = netValue.toFixed(2);
}

function clearForm() {
  amountInput.value = "";
  descriptionInput.value = "";
  dateInput.value = "";
  categorySelect.value = "income";
}

addBtn.addEventListener("click", function () {
  const category = categorySelect.value;
  const amount = Number(amountInput.value);
  const description = descriptionInput.value;
  const date = dateInput.value;

  if (category === "") {
    alert("Please select a category.");
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }
  if (description === "") {
    alert("Please enter a description.");
    return;
  }
  if (date === "") {
    alert("Please select a date.");
    return;
  }
  if (isEditing) {
    const expense = expenses[editIndex];
    if (expense.category === "income") totalIncome -= expense.amount;
    else totalExpense -= expense.amount;


    expense.category = category;
    expense.amount = amount;
    expense.description = description;
    expense.date = date;
    if (category === "income") totalIncome += amount;
    else totalExpense += amount;
    const row = expenseData.rows[editIndex];
    row.cells[1].textContent =
      category === "income" ? amount.toFixed(2) : "- -";
    row.cells[2].textContent =
      category === "expense" ? amount.toFixed(2) : "- -";
    row.cells[3].textContent = description;
    row.cells[4].textContent = date;

    isEditing = false;
    editIndex = -1;
    addBtn.textContent = "Add";
  } else {
    
    const newExpense = { category, amount, description, date };
    expenses.push(newExpense);


    if (category === "income") totalIncome += amount;
    else totalExpense += amount;

 
    const newRow = expenseData.insertRow();
    newRow.insertCell().textContent = expenseData.rows.length; // S.No
    newRow.insertCell().textContent =
      category === "income" ? amount.toFixed(2) : "- -";
    newRow.insertCell().textContent =
      category === "expense" ? amount.toFixed(2) : "- -";
    newRow.insertCell().textContent = description;
    newRow.insertCell().textContent = date;

   
    const actionCell = newRow.insertCell();


    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", function () {
      const index = Array.from(expenseData.rows).indexOf(newRow);
      const expense = expenses[index];

      if (expense.category === "income") totalIncome -= expense.amount;
      else totalExpense -= expense.amount;

      expenses.splice(index, 1);
      expenseData.deleteRow(index);

      updateTotals(); 
    });
    actionCell.appendChild(deleteBtn); 
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener("click", function () {
      const index = Array.from(expenseData.rows).indexOf(newRow);
      const expense = expenses[index];

      categorySelect.value = expense.category;
      amountInput.value = expense.amount;
      descriptionInput.value = expense.description;
      dateInput.value = expense.date;

      isEditing = true;
      editIndex = index;
      addBtn.textContent = "Update";
    });
    actionCell.appendChild(editBtn);
  }

  updateTotals(); 
  clearForm();
});

resetBtn.addEventListener("click", function () {
  clearForm();
  isEditing = false;
  editIndex = -1;
  addBtn.textContent = "Add";
  updateTotals(); 
});
