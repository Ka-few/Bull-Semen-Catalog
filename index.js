'use strict';

let addNewBull = document.getElementById('add-btn');
let bullContainer = document.getElementById('bull-container');

// LOGIN HANDLER
document.getElementById("login-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  attemptLogin(username, password);
});

function attemptLogin(username, password) {
  fetch(`https://bull-semen-catalog-2.onrender.com/users?username=${encodeURIComponent(username)}`)
    .then(res => res.json())
    .then(users => {
      if (users.length === 0) {
        showLoginError("Invalid username");
      } else {
        const user = users[0];
        if (user.password === password) {
          startApp(user.role);
        } else {
          showLoginError("Incorrect password");
        }
      }
    })
    .catch(err => {
      console.error("Login failed", err);
      showLoginError("Server error. Try again.");
    });
}

function showLoginError(message) {
  const errorDiv = document.getElementById("login-error");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
}

function startApp(userType) {
  window.currentUser = userType;
  document.getElementById("app-content").style.display = "block";
  document.getElementById("login-container").style.display = "none";
  fetchBulls();
}

// REGISTRATION HANDLER
document.getElementById("show-register-btn").addEventListener("click", () => {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("register-container").style.display = "block";
});

document.getElementById("back-to-login").addEventListener("click", () => {
  document.getElementById("register-container").style.display = "none";
  document.getElementById("login-container").style.display = "block";
});

document.getElementById("register-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("reg-username").value.trim();
  const password = document.getElementById("reg-password").value;
  const role = document.getElementById("reg-role").value;

  fetch(`https://bull-semen-catalog-2.onrender.com/users?username=${encodeURIComponent(username)}`)
    .then(res => res.json())
    .then(users => {
      if (users.length > 0) {
        alert("Username already exists!");
      } else {
        fetch(`https://bull-semen-catalog-2.onrender.com/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, role })
        })
        .then(() => {
          alert("Registration successful! Please log in.");
          document.getElementById("register-container").style.display = "none";
          document.getElementById("login-container").style.display = "block";
        });
      }
    });
});

// LOGOUT
document.getElementById("logout-btn").addEventListener("click", () => {
  window.currentUser = null;
  document.getElementById("app-content").style.display = "none";
  document.getElementById("login-container").style.display = "block";
  document.getElementById("bull-list").innerHTML = "";
});

// TOGGLE ADD FORM
addNewBull.addEventListener("click", () => {
  const isHidden = bullContainer.style.display === "none";
  bullContainer.style.display = isHidden ? "block" : "none";
  addNewBull.textContent = isHidden ? "Hide Form" : "Add New Bull";
});

// ADD / UPDATE BULL
document.getElementById('add-bull-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const form = this;
  const bullData = {
    name: form['bull-name'].value,
    breed: form['bull-breed'].value,
    price: form['bull-price'].value,
    traits: form['bull-traits'].value,
    milkPerDay: form['bull-milk'].value,
    sire: form['bull-sire'].value,
    dam: form['bull-dam'].value,
    breeder: form['bull-breeder'].value,
    dob: form['bull-dob'].value,
    image: form['bull-image'].value
  };

  const editingId = form.dataset.editingId;
  const url = editingId
    ? `https://bull-semen-catalog-2.onrender.com/bulls/${editingId}`
    : `https://bull-semen-catalog-2.onrender.com/bulls`;
  const method = editingId ? 'PATCH' : 'POST';

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bullData)
  })
  .then(res => res.json())
  .then(() => {
    form.dataset.editingId = "";
    form.reset();
    form.querySelector('button[type="submit"]').textContent = "Add Bull";
    document.getElementById('cancel-edit-btn').style.display = 'none';
    fetchBulls();
  });
});

// CANCEL EDIT
document.getElementById('cancel-edit-btn').addEventListener('click', function() {
  const form = document.getElementById('add-bull-form');
  form.reset();
  form.dataset.editingId = "";
  form.querySelector('button[type="submit"]').textContent = "Add Bull";
  this.style.display = 'none';
});
document.getElementById('cancel-edit-btn').style.display = 'none';

// FETCH & DISPLAY BULLS
function fetchBulls() {
  fetch("https://bull-semen-catalog-2.onrender.com/bulls")
    .then(res => res.json())
    .then(displayBulls);
}

function displayBulls(bulls) {
  const bullList = document.getElementById("bull-list");
  bullList.innerHTML = "";

  bulls.forEach(bull => {
    const bullCard = document.createElement("div");
    bullCard.className = "bull-card";
    bullCard.innerHTML = `
      <h3 class="bull-name toggle-trigger">${bull.name}</h3>
      <img src="${bull.image}" alt="${bull.name}" class="toggle-trigger" style="cursor:pointer; border-radius:6px;">
      <div class="bull-details">
        <p><strong>Breed:</strong> ${bull.breed}</p>
        <p><strong>Price:</strong> KES ${bull.price}</p>
        <p><strong>Milk Per Day:</strong> ${bull.milkPerDay} Liters</p>
        <p><strong>Traits:</strong> ${bull.traits}</p>
        <p><strong>Sire:</strong> ${bull.sire}</p>
        <p><strong>Dam:</strong> ${bull.dam}</p>
        <p><strong>Breeder:</strong> ${bull.breeder}</p>
        <p><strong>DOB:</strong> ${bull.dob}</p>
        <button class="favorite-btn">${isFavorite(bull.id) ? '★ Remove from Favorites' : '☆ Add to Favorites'}</button>
        ${window.currentUser === "admin" ? `
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        ` : ""}
      </div>
    `;

    bullList.appendChild(bullCard);

    // Collapsible
    bullCard.querySelectorAll('.toggle-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const details = bullCard.querySelector('.bull-details');
        const isVisible = details.style.display === 'block';
        document.querySelectorAll('.bull-details').forEach(d => d.style.display = 'none');
        details.style.display = isVisible ? 'none' : 'block';
      });
    });

    // Favorite
    const favBtn = bullCard.querySelector('.favorite-btn');
    favBtn.addEventListener('click', () => {
      toggleFavorite(bull.id, favBtn);
    });

    // Admin actions
    if (window.currentUser === "admin") {
      bullCard.querySelector('.edit-btn').addEventListener('click', () => {
        prefillForm(bull);
        bullContainer.style.display = "block";
        addNewBull.textContent = "Hide Form";
        document.getElementById('cancel-edit-btn').style.display = 'inline-block';
      });

      bullCard.querySelector('.delete-btn').addEventListener('click', () => {
        if (confirm("Are you sure you want to delete this Bull record?")) {
          fetch(`https://bull-semen-catalog-2.onrender.com/bulls/${bull.id}`, { method: "DELETE" })
            .then(() => fetchBulls());
        }
      });
    }
  });
}

// TOGGLE FAVORITES VIEW
document.getElementById('toggle-favorites-btn').addEventListener('click', function() {
  const showingFavorites = this.dataset.showingFavorites === 'true';
  if (showingFavorites) {
    this.textContent = 'Show Favorites';
    fetchBulls();
  } else {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    fetch("https://bull-semen-catalog-2.onrender.com/bulls")
      .then(res => res.json())
      .then(bulls => {
        const favBulls = bulls.filter(b => favorites.includes(b.id));
        displayBulls(favBulls);
        this.textContent = 'Show All';
      });
  }
  this.dataset.showingFavorites = (!showingFavorites).toString();
});

// PREFILL FORM FOR EDITING
function prefillForm(bull) {
  const form = document.getElementById('add-bull-form');
  form['bull-name'].value = bull.name;
  form['bull-breed'].value = bull.breed;
  form['bull-price'].value = bull.price;
  form['bull-traits'].value = bull.traits;
  form['bull-milk'].value = bull.milkPerDay;
  form['bull-sire'].value = bull.sire;
  form['bull-dam'].value = bull.dam;
  form['bull-breeder'].value = bull.breeder;
  form['bull-dob'].value = bull.dob;
  form['bull-image'].value = bull.image;
  form.dataset.editingId = bull.id;
  form.querySelector('button[type="submit"]').textContent = "Update Bull";
}

// FAVORITES UTILS
function isFavorite(id) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  return favorites.includes(id);
}

function toggleFavorite(id, button) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
    if (button) button.textContent = '☆ Add to Favorites';
  } else {
    favorites.push(id);
    if (button) button.textContent = '★ Remove from Favorites';
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
}
