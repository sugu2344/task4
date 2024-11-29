let expenses = [];
let totalAmount = 0;

const categorySelect = document.getElementById("category");
const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");
const dateInput = document.getElementById("date");
const addBtn = document.getElementById("add-btn");
const resetBtn = document.getElementById("reset-btn");

const expenseData = document.getElementById("expense-data");
const TotalExpenseAmount = document.getElementById("Total-expense-amount");

function updateTotal() {
  TotalExpenseAmount.textContent = totalAmount.toFixed(2);
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

  const newExpense = { category, amount, description, date };
  expenses.push(newExpense);
  totalAmount += amount;

  const newRow = expenseData.insertRow();
  newRow.insertCell().textContent = expenseData.rows.length;
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
    totalAmount -= expenses[index].amount;
    expenses.splice(index, 1);
    expenseData.deleteRow(index);
    updateTotal();
  });
  actionCell.appendChild(deleteBtn);

  updateTotal();

  amountInput.value = "";
  descriptionInput.value = "";
  dateInput.value = "";
  categorySelect.value = "income";
});

resetBtn.addEventListener("click", function () {
  amountInput.value = "";
  descriptionInput.value = "";
  dateInput.value = "";
  categorySelect.value = "income";
});
