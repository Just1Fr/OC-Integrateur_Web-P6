/////////////
// Gallery //
/////////////

async function getWorks() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const works = await reponse.json();
    return works
}

function createWorkItem(title, imgSrc) {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = title;
    figure.appendChild(img);

    const figcaption = document.createElement("figcaption");
    figcaption.innerText = title;
    figure.appendChild(figcaption);

    return figure
}

async function fillGallery(categoryId) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    const works = await getWorks();
    if (works) {
        // Default "All" filter
        if (categoryId === 0) {
            for (let i = 0; i < works.length; i++) {
                gallery.appendChild(
                    createWorkItem(works[i].title, works[i].imageUrl)
                )
            }
        } else {
            for (let i = 0; i < works.length; i++) {
                // Add filtered elements
                if (works[i].category.id === categoryId) {
                    gallery.appendChild(
                        createWorkItem(works[i].title, works[i].imageUrl)
                    )
                }
            }
        }
    }
}

// Initalize gallery
fillGallery(0);

/////////////
// Filters //
/////////////

async function getCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const works = await reponse.json();
    return works
}

function createFilterItem(id, title) {
    const filter = document.createElement("span");
    filter.classList = "filter";
    filter.id = "filter-" + id;
    filter.innerText = title;
    return filter
}

function toggleFilter(event) {
    if (!event.currentTarget.classList.contains("selected")) {
        document.querySelector(".filter.selected").classList.remove("selected");
        event.currentTarget.classList.add("selected");

        const categoryId = parseInt(
            event.currentTarget.id.replace("filter-", "")
        );

        fillGallery(categoryId)
    }
}

function addFilterClick() {
    const filterElements = document.querySelectorAll(".filter");
    filterElements.forEach(element => {
        element.addEventListener("click", toggleFilter);
    });
}

async function createFilterSection() {
    const filters = document.querySelector(".filters");
    const categories = await getCategories();
    if (categories) {
        filters.appendChild(
            createFilterItem(0, "Tous")
        ).classList = "filter selected";

        for (let i = 0; i < categories.length; i++) {
            filters.appendChild(
                createFilterItem(categories[i].id, categories[i].name)
            )
        }

        addFilterClick();
    }
}

// Initalize filters
createFilterSection();

////////////////
// User login //
////////////////

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    location.reload();
}

function refreshLoggedIn() {
    // Add modify button when logged in
    document.getElementById("modify-btn")
    .innerHTML =
    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5229 1.68576L13.8939 2.05679C14.1821 2.34503 14.1821 2.81113 13.8939 3.0963L13.0016 3.99169L11.5879 2.57808L12.4803 1.68576C12.7685 1.39751 13.2346 1.39751 13.5198 1.68576H13.5229ZM6.43332 7.73578L10.5484 3.61759L11.9621 5.03121L7.84387 9.14633C7.75494 9.23525 7.64455 9.29964 7.52496 9.33337L5.73111 9.84546L6.2432 8.05162C6.27693 7.93203 6.34133 7.82164 6.43025 7.73271L6.43332 7.73578ZM11.4408 0.646245L5.39074 6.6932C5.12397 6.95998 4.93078 7.28808 4.82959 7.64685L3.9526 10.7133C3.879 10.9708 3.94953 11.2468 4.13965 11.4369C4.32977 11.627 4.60574 11.6976 4.86332 11.624L7.92973 10.747C8.29156 10.6427 8.61967 10.4495 8.88338 10.1858L14.9334 4.13888C15.7951 3.27722 15.7951 1.87894 14.9334 1.01728L14.5624 0.646245C13.7007 -0.215415 12.3024 -0.215415 11.4408 0.646245ZM2.69844 1.84214C1.20816 1.84214 0 3.05031 0 4.54058V12.8812C0 14.3715 1.20816 15.5796 2.69844 15.5796H11.0391C12.5293 15.5796 13.7375 14.3715 13.7375 12.8812V9.44683C13.7375 9.039 13.4094 8.71089 13.0016 8.71089C12.5937 8.71089 12.2656 9.039 12.2656 9.44683V12.8812C12.2656 13.5589 11.7167 14.1078 11.0391 14.1078H2.69844C2.02076 14.1078 1.47188 13.5589 1.47188 12.8812V4.54058C1.47188 3.86291 2.02076 3.31402 2.69844 3.31402H6.13281C6.54065 3.31402 6.86875 2.98591 6.86875 2.57808C6.86875 2.17025 6.54065 1.84214 6.13281 1.84214H2.69844Z" fill="black"/>
    </svg>
    modifier`;

    // Log out when clicked
    const loginBtn = document.getElementById("login-btn");
    loginBtn.innerText = "logout";
    loginBtn.addEventListener("click", logout);
}

// Check for token in localStorage
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    // If logged in
    if (token) {
        refreshLoggedIn();
    } else {
        // Redirect to login page when clicked
        document.getElementById("login-btn")
            .addEventListener("click", () => {
                window.location.href = 'login.html';
            })
    }
});