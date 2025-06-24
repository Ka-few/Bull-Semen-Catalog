'use strict'
let addNewBull = document.getElementById('add-btn');
let bullContainer = document.getElementById('bull-container');

//add the create a new entry event, show and hide the form
addNewBull.addEventListener("click", () => {
  const isHidden = bullContainer.style.display === "none";
  bullContainer.style.display = isHidden ? "block" : "none";
  addNewBull.textContent = isHidden ? "Hide Form" : "Add New Bull";
});

// this calls fetchBulls()after the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  fetchBulls();
});

//this function gets the list of bulls in the server.
function fetchBulls() {
  fetch("http://localhost:3000/bulls")
    .then(response => response.json())
    .then(bulls => {
      displayBulls(bulls);
    })
    .catch(error => {
      console.error("Error fetching bulls:", error);
    });
}

//this function displays the list of bulls available in the server
function displayBulls(bulls) {
  const bullList = document.getElementById("bull-list");
  bullList.innerHTML = ""; // Clear any existing bulls

  bulls.forEach(bull => {
    const bullCard = document.createElement("div");
    bullCard.className = "bull-card";

    bullCard.innerHTML = `
      <img src="${bull.image}" alt="${bull.name}" width="200">
      <h3>${bull.name}</h3>
      <p><strong>Breed:</strong> ${bull.breed}</p>
      <p><strong>Price:</strong> KES ${bull.price}</p>
      <p><strong>Milk Per Day:</strong> ${bull.milkPerDay} Liters</p>
      <p><strong>Traits:</strong> ${bull.traits}</p>
      <p><strong>Sire:</strong> ${bull.sire}</p>
      <p><strong>Dam:</strong> ${bull.dam}</p>
      <p><strong>Breeder:</strong> ${bull.breeder}</p>
      <p><strong>DOB:</strong> ${bull.dob}</p>
    `;

    bullList.appendChild(bullCard);
  });
}




