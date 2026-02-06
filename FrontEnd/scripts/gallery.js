import {getWorks, getCategories} from "/scripts/api_requests.js";

/////////////
// Gallery //
/////////////

export function createWorkItem(title, imgSrc, id) {
    const figure = document.createElement("figure");
    figure.classList = id;

    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = title;
    figure.appendChild(img);

    const figcaption = document.createElement("figcaption");
    figcaption.innerText = title;
    figure.appendChild(figcaption);

    return figure;
}

export async function fillGallery(categoryId = 0) {
    const gallery = document.querySelector(".gallery");
    const works = !window.works ? await getWorks() : window.works;
    if (works) {
        gallery.innerHTML = "";
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

/////////////
// Filters //
/////////////

function createFilterItem(id, name) {
    const filter = document.createElement("span");
    filter.classList = "filter";
    filter.id = "filter-" + id;
    filter.innerText = name;
    return filter;
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

export async function createFilterSection() {
    const filters = document.querySelector(".filters");
    const categories = !window.categories ? await getCategories() : window.categories;
    if (categories) {
        filters.innerHTML = "";
        filters.appendChild(
            createFilterItem(0, "Tous")
        ).classList = "filter selected";

        for (let i = 0; i < categories.length; i++) {
            filters.appendChild(
                createFilterItem(categories[i].id, categories[i].name)
            );
        }

        document.querySelectorAll(".filter")
            .forEach(element => {
                element.addEventListener("click", toggleFilter);
            });
    }
}