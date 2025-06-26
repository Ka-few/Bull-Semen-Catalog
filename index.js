'use strict'
let addNewBull = document.getElementById('add-btn')
let bullContainer = document.getElementById('bull-container')

//add the create a new entry event, show and hide the form
addNewBull.addEventListener("click", () => {
  const isHidden = bullContainer.style.display === "none"
  bullContainer.style.display = isHidden ? "block" : "none"
  addNewBull.textContent = isHidden ? "Hide Form" : "Add New Bull"
});

// this calls fetchBulls()after the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  fetchBulls();
  let addBullForm = document.getElementById('add-bull-form')

  addBullForm.addEventListener('submit', function(e) {
    e.preventDefault();

    //create bull entry object to be posted to the server
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

    //post the bull entry to the server
    fetch("https://bull-semen-catalog-2.onrender.com/bulls", {
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
        //display success message after a successful addition of a bull entry
        const successMessage = document.getElementById('success-message')
        successMessage.style.display = 'block'
        //hide success message after 2 seconds
        setTimeout(()=> {
            successMessage.style.display = "none"
        }, 2000)
    })
    .catch(error => {
        console.error("There was an error adding the bull entry", error)
    })
  })
});

//this function gets the list of bulls in the server.
function fetchBulls() {
  fetch("https://bull-semen-catalog-2.onrender.com/bulls")
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
  
  //create a bull card for presenting the bull information
  bulls.forEach(bull => {
    const bullCard = document.createElement("div")
    bullCard.className = "bull-card"

    const detailsId = `details-${bull.id}`

    bullCard.innerHTML = `
      <h3 class="bull-name toggle-trigger">${bull.name}</h3>
      <img src="${bull.image}" alt="${bull.name}" width="200" class="toggle-trigger" style="cursor: pointer; border-radius: 6px;">
      <div class="bull-details">
      <p><strong>Breed:</strong> ${bull.breed}</p>
      <p><strong>Price:</strong> KES ${bull.price}</p>
      <p><strong>Milk Per Day:</strong> ${bull.milkPerDay} Liters</p>
      <p><strong>Traits:</strong> ${bull.traits}</p>
      <p><strong>Sire:</strong> ${bull.sire}</p>
      <p><strong>Dam:</strong> ${bull.dam}</p>
      <p><strong>Breeder:</strong> ${bull.breeder}</p>
      <p><strong>DOB:</strong> ${bull.dob}</p>
      <button class ="delete-btn" data-id="${bull.id}">Delete</button>
      </div>
    `;

    bullList.appendChild(bullCard)
  })

  //Handling the collapsible behavior
  const triggers = document.querySelectorAll(".toggle-trigger")

  triggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const bullCard = trigger.closest(".bull-card")
      const details = bullCard.querySelector(".bull-details")

      // Hide all other details
      document.querySelectorAll(".bull-details").forEach(section => {
        if (section !== details) section.style.display = "none"
      });

        
        //show selected bull's details
        const isVisible = details.style.display === 'block'
        details.style.display = isVisible ? 'none' : 'block' 
    })

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
    fetch(`https://bull-semen-catalog-2.onrender.com/bulls/${id}`, {
        method: "DELETE"
    })
    .then(()=> {
        fetchBulls() //refresh the bull list after deletion
    })
    .catch(error => {
        console.error("there was an error deleting bull entry", error)
    })
}




