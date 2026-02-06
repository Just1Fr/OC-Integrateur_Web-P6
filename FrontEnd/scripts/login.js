// Redirect to homepage if already logged in
if (localStorage.getItem('token')) {
    window.location.href = '/index.html';
}

async function tryLogin(email, password) {
    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        });

        if (!response.ok) {
            loginError(response.status);
        } else {
            const result = await response.json();
            localStorage.setItem('token', result.token);
            localStorage.setItem('userId', result.userId);
            window.location.href = '/index.html';
        }

    }  catch {
        console.error("Failed to log in");
    }
}

function loginError(status) {
    switch (status) {
        case 401:
        case 404:
            const warning = document.querySelector("#login-form > .input.submit > .warning");
            warning.innerText = "Erreur dans l’identifiant ou le mot de passe";
            warning.style.display = "block";
            break;

        default:
            const error = document.querySelector("#login-form > .input.submit > .warning");
            error.innerText = "Erreur";
            error.style.display = "block";
            break;
    }
}

// Simple email validation
function isEmailValid(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

// Click on log in button
document.getElementById("submit")
    .addEventListener("click", event => {
        event.preventDefault();

        // Verify if email is valid
        const email = document.getElementById("email").value;
        if (!isEmailValid(email)) {
            document.querySelector("#login-form > .input.email > .warning")
                .style.display = "block";
            return;
        } else {
            document.querySelector("#login-form > .input.email > .warning")
                .style.display = "none";
        }

        // Verify if password is not empty
        const password = document.getElementById("password").value;
        if (!password) {
            document.querySelector("#login-form > .input.password > .warning")
                .style.display = "block";
            return;
        } else {
            document.querySelector("#login-form > .input.password > .warning")
                .style.display = "none";
        }

        tryLogin(email, password);
    });