// Check login credentials
async function tryLogin(email, password) {
    // Send request to API
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

    // Handle response from API
    switch (response.status) {
        case 200:
            const result = await response.json();
            localStorage.setItem('token', result.token);
            localStorage.setItem('userId', result.userId);
            window.location.href = 'index.html';
            break;

        case 401:
        case 404:
            document.querySelector("#login-form > .warning")
                .innerText = "Erreur dans l’identifiant ou le mot de passe.";
            break;

        default:
            document.querySelector("#login-form > .warning")
                .innerText = "Erreur.";
            break;
    }
}

// Simple email validation
function isEmailValid(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

// Click on log in button
const submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", event => {
    event.preventDefault();

    // Verify if email is valid
    const email = document.getElementById("email").value;
    if (!isEmailValid(email)) {
        console.error("Email invalide");
        document.querySelector("#login-form > .input.email > .warning")
            .innerText = "Email invalide.";
        return
    } else {
        document.querySelector("#login-form > .input.email > .warning")
            .innerText = "";
    }

    // Verify if password is not empty
    const password = document.getElementById("password").value;
    if (!password) {
        console.error("Mot de passe invalide");
        document.querySelector("#login-form > .input.password > .warning")
            .innerText = "Veuillez entrer un mot de passe.";
        return
    } else {
        document.querySelector("#login-form > .input.password > .warning")
            .innerText = "";
    }

    document.querySelector("#login-form > .warning")
        .innerText = "";

    tryLogin(email, password);
});