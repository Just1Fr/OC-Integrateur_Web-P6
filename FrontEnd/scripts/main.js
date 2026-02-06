import {html_elem} from "/scripts/elements.js";
import {fillGallery, createFilterSection} from "/scripts/gallery.js";
import {deleteWorkModal} from "/scripts/modals.js";

checkLoginStatus();
fillGallery();

function checkLoginStatus() {
    const token = localStorage.getItem("token");

    if (token) {
        loggedIn();
    } else {
        createFilterSection();
        // Redirect to login page
        document.getElementById("login-btn")
            .addEventListener("click", () => {
                window.location.href = '/pages/login.html';
            });
    }
}

function loggedIn() {
    // Banner
    const banner = document.querySelector(".banner");
    banner.innerHTML = html_elem.EDIT_BANNER;
    banner.style.display = "flex";

    document.querySelector(".filters").innerHTML = "";

    // Modify button
    const modifyBtn = document.getElementById("modify-btn");
    modifyBtn.innerHTML = html_elem.MODIFY_BUTTON;
    modifyBtn.style.display = "block";
    modifyBtn.addEventListener("click", deleteWorkModal);

    // Logout button
    const loginBtn = document.getElementById("login-btn");
    loginBtn.innerText = "logout";
    loginBtn.addEventListener("click", logout);
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    location.reload();
}