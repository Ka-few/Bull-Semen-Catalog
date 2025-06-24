'use strict'
let loginForm = document.getElementById('login-form')
let logSection = document.getElementById('login-section')
let mainContainer = document.getElementById('main-cont')
let userRole = document.getElementById('user-role')
let loginError = document.getElementById('login-error')
let adminPanel = document.getElementById('admin-panel')

//login event handler
loginForm.addEventListener('submit', function(e){
    e.preventDefault()

    const userName = document.getElementById('username').value
    const pass = document.getElementById('password').value

    //login fetch
    fetch(`http://localhost:3000/users?username=${userName}&password=${pass}`)
        .then(res=>res.json())
        .then(users=>{
            if (users.length > 0) {
                const user = users[0]
                logSection.style.display = 'none'
                mainContainer.style.display = 'block'
                userRole.textContent = user.role

                //if user is admin show admin control panel
                if (user.role === 'admin') {
                    adminPanel.style.diplay = 'block'
                }
                
            } else {
                loginError.textContent = 'Your Username and Password do not match! Please try again'
            }
        })
        .catch(err=>{
            loginError.textContent = 'There was an error connecting to the server'
            console.log(err)
        })
})