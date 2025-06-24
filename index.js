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
  let addBullForm = document.getElementById('add-bull-form')

  addBullForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const newBull = {
        name: document.getElementById('bull-name').value,
        breed: document.getElementById('bull-breed').value,
        price: document.getElementById('bull-price').value,
        traits: document.getElementById('bull-traits').value,
        sire: document.getElementById('bull-sire').value,
        dam: document.getElementById('bull-dam').value,
        breeder: document.getElementById('bull-breeder').value,
        dob: document.getElementById('bull-dob').value,
        image: document.getElementById('bull-image').value,
        milkPerDay: document.getElementById('bull-milk').value

    }

    fetch("http://localhost:3000/bulls", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newBull)
    })
    .then(res => res.json())
    .then(addedBull => {
        fetchBulls()
        addBullForm.reset()

        const successMessage = document.getElementById('success-message')
        successMessage.style.display = 'block'

        setTimeout(()=> {
            successMessage.style.display = "none"
        }, 2000)
    })
    .catch(error => {
        console.log("There was an error adding the bull entry", error)
    })
  })
});

//this function gets the list of bulls in the server.
function fetchBulls() {
  fetch("http://localhost:3000/bulls")
    .then(response => response.json())
    .then(bulls => {
      displayBulls(bulls)
    })
    .catch(error => {
      console.error("Error fetching bulls:", error)
    })
}

//this function displays the list of bulls available in the server
function displayBulls(bulls) {
  const bullList = document.getElementById("bull-list")
  bullList.innerHTML = ""; // Clear any existing bulls

  bulls.forEach(bull => {
    const bullCard = document.createElement("div")
    bullCard.className = "bull-card"

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
      <button class ="delete-btn" data-id="${bull.id}">Delete</button>
    `;

    bullList.appendChild(bullCard)
  })

  //add event listeners for delete buttons
  const deleteButtons = document.querySelectorAll('.delete-btn')
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
        const id = this.dataset.id
        deleteBull(id)
    })
  })
}

// function to handle the deleting of a bull entry
function deleteBull(id) {
    //confirmation prompt to prevent accidental deletion
    const confirmDelete = confirm("Are you sure you want to delete this Bull record?")
    
    if (!confirmDelete) return  //if user cancels exit else continue to delete
    fetch(`http://localhost:3000/bulls/${id}`, {
        method: "DELETE"
    })
    .then(()=> {
        fetchBulls() //refresh the bull list after deletion
    })
    .catch(error => {
        console.log("there was an error deleting bull entry", error)
    })
}




