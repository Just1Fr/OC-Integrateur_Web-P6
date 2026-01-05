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
                    createWorkItem(works[i]["title"], works[i]["imageUrl"])
                )
            }
        } else {
            for (let i = 0; i < works.length; i++) {
                // Add filtered elements
                if (works[i]["category"]["id"] === categoryId) {
                    gallery.appendChild(
                        createWorkItem(works[i]["title"], works[i]["imageUrl"])
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
                createFilterItem(categories[i]["id"], categories[i]["name"])
            )
        }

        addFilterClick();
    }
}

// Initalize filters
createFilterSection();