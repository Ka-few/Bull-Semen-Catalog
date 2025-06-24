'use strict'
let addNewBull = document.getElementById('add-btn');
let bullContainer = document.getElementById('bull-container');

//add the create a new entry event, show and hide the form
addNewBull.addEventListener("click", () => {
  const isHidden = bullContainer.style.display === "none";
  bullContainer.style.display = isHidden ? "block" : "none";
  addNewBull.textContent = isHidden ? "Hide Form" : "Add New Bull";
});




