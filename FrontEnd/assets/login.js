
async function tryLogin(email, password) {
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
    switch (response.status) {
        case 200:
            console.log("User logged in");
            const result = await response.json();
            console.log(result);
            break;
        case 401:
            console.log("Incorrect password");
            break;
        case 404:
            console.log("User not found");
            break;
        default:
            console.error("Unknown error");
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

    const email = document.getElementById("email").value;
    if (!isEmailValid(email)) {
        console.error("Email invalide");
        return
    }

    const password = document.getElementById("password").value;
    if (!password) {
        console.error("Mot de passe invalide");
        return
    }

    tryLogin(email, password);
});