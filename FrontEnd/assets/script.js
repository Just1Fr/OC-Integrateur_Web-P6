/////////////
// Gallery //
/////////////

async function updateWorks() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const works = await reponse.json();
    localStorage.setItem("works", JSON.stringify(works));
}

async function getWorks() {
    const worksCached = localStorage.getItem("works");
    if (worksCached) {
        return JSON.parse(worksCached)
    } else {
        await updateWorks();
        return JSON.parse(localStorage.getItem("works"))
    }
}

function createWorkItem(title, imgSrc, id) {
    const figure = document.createElement("figure");
    figure.classList = id;

    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = title;
    figure.appendChild(img);

    const figcaption = document.createElement("figcaption");
    figcaption.innerText = title;
    figure.appendChild(figcaption);

    return figure
}

async function fillGallery(categoryId = 0) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    const works = await getWorks();
    if (works) {
        // Default "All" filter
        if (categoryId === 0) {
            for (let i = 0; i < works.length; i++) {
                gallery.appendChild(
                    createWorkItem(works[i].title, works[i].imageUrl, works[i].id)
                );
            }
        } else {
            // Add filtered elements
            for (let i = 0; i < works.length; i++) {
                if (works[i].category.id === categoryId) {
                    gallery.appendChild(
                        createWorkItem(works[i].title, works[i].imageUrl, works[i].id)
                    );
                }
            }
        }
    }
}

fillGallery();

/////////////
// Filters //
/////////////

async function getCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const categories = await reponse.json();
    return categories
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

        fillGallery(categoryId);
    }
}

async function createFilterSection() {
    const filters = document.querySelector(".filters");
    filters.innerHTML = "";
    const categories = await getCategories();
    if (categories) {
        filters.appendChild(
            createFilterItem(0, "Tous")
        ).classList = "filter selected";

        for (let i = 0; i < categories.length; i++) {
            filters.appendChild(
                createFilterItem(categories[i].id, categories[i].name)
            );
        }

        const filterElements = document.querySelectorAll(".filter");
        filterElements.forEach(element => {
            element.addEventListener("click", toggleFilter);
        });
    }
}

createFilterSection();

///////////////
// Logged in //
///////////////

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    location.reload();
}

async function deleteWork(id) {
    const token = localStorage.getItem("token");
    if (token) {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "accept": "*/*",
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.ok) {
            await updateWorks();
        }
    }
}

function closeModal(modal) {
    modal.style.display = "none";
    document.querySelector("body").style.overflow = "scroll";
    fillGallery();
    createFilterSection();
}

async function showModal() {
    const body = document.querySelector("body");
    body.style.overflow = "hidden";

    const modal = document.getElementById("modify-modal");
    modal.style.display = "flex";

    const gallery = document.querySelector("#modify-modal .gallery");
    gallery.innerHTML = "";
    
    const works = await getWorks();
    for (let i = 0; i < works.length; i++) {
        const id = works[i].id;
        const item = document.createElement("div");
        item.classList = `item ${id}`;
        
        const deleteBtn = document.createElement("button");
        deleteBtn.classList = `delete-btn ${id}`;
        deleteBtn.innerHTML = 
            `<svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9C8.35714 9.70915 7.78058 10.2857 7.07143 10.2857H1.92857C1.21942 10.2857 0.642857 9.70915 0.642857 9V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V8.67857C2.25 8.85536 2.39464 9 2.57143 9C2.74821 9 2.89286 8.85536 2.89286 8.67857V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V8.67857C4.17857 8.85536 4.32321 9 4.5 9C4.67679 9 4.82143 8.85536 4.82143 8.67857V4.17857C4.82143 4.00179 4.67679 3.85714 4.5 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V8.67857C6.10714 8.85536 6.25179 9 6.42857 9C6.60536 9 6.75 8.85536 6.75 8.67857V4.17857C6.75 4.00179 6.60536 3.85714 6.42857 3.85714Z" fill="white"/>
            </svg>`;
        item.appendChild(deleteBtn);
        deleteBtn.addEventListener("click", async () => {
            gallery.removeChild(item);
            await deleteWork(id);
        });
        
        const img = document.createElement("img");
        img.src = works[i].imageUrl;
        img.alt = works[i].title;
        item.appendChild(img);

        gallery.appendChild(item);
    }
}

function loggedIn() {
    // Modify button
    const modifyBtn = document.getElementById("modify-btn");
    modifyBtn.style.display = "block";
    modifyBtn.addEventListener("click", showModal);

    // Close modal
    const modal = document.getElementById("modify-modal");
    document.querySelector("#modify-modal .close-btn")
        .addEventListener("click", () => {
            closeModal(modal);
        });
    document.getElementById("modify-modal")
        .addEventListener("click", function(event) {
            if (event.target === this) {
                closeModal(modal);
            }
        });
    
    // Log out button
    const loginBtn = document.getElementById("login-btn");
    loginBtn.innerText = "logout";
    loginBtn.addEventListener("click", logout);
}

function checkLoginStatus() {
    const token = localStorage.getItem("token");

    if (token) {
        loggedIn();
    } else {
        // Redirect to login page
        document.getElementById("login-btn")
            .addEventListener("click", () => {
                window.location.href = 'login.html';
            });
    }
}

checkLoginStatus();