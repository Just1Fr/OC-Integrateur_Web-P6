import {svg_elem, html_elem} from "/scripts/elements.js";
import {getWorks, getCategories, deleteWork, uploadWork} from "/scripts/api_requests.js";
import {createWorkItem} from "/scripts/gallery.js";

function showModal() {
    document.querySelector("body").style.overflow = "hidden";
    document.querySelector(".modal").style.display = "flex";

    document.querySelector(".modal")
        .addEventListener("click", function(event) {
            if (event.target === this) {
                closeModal();
            }
        });
}

function closeModal() {
    document.querySelector("body").style.overflow = "scroll";

    const modal = document.querySelector(".modal");
    modal.style.display = "none";
    modal.removeEventListener("click", function(event) {
            if (event.target === this) {
                closeModal();
            }
        });

    const backBtn = document.querySelector(".modal .back-btn");
    backBtn.style.display = "none";
    backBtn.removeEventListener("click", deleteWorkModal);
}

/////////////////
// Delete work //
/////////////////

export async function deleteWorkModal() {
    // Modal gallery
    const gallery = document.querySelector(".modal .box");
    gallery.innerHTML = "";
    gallery.classList = "box gallery"

    // Works in modal gallery
    const works = await getWorks();
    for (let i = 0; i < works.length; i++) {
        const id = works[i].id;
        const item = document.createElement("div");
        item.classList = `item ${id}`;
        
        const deleteBtn = document.createElement("button");
        deleteBtn.classList = `delete-btn ${id}`;
        deleteBtn.innerHTML = svg_elem.DELETE_SVG;
        item.appendChild(deleteBtn);
        deleteBtn.addEventListener("click", () => {
            if (deleteWork(id)) {
                // Remove work from gallery
                gallery.removeChild(item);
                document.querySelector("#portfolio .gallery").removeChild(
                    document.querySelector(`#portfolio .gallery figure[class="${id}"]`)
                );
            }
        });
        
        const img = document.createElement("img");
        img.src = works[i].imageUrl;
        img.alt = works[i].title;
        item.appendChild(img);

        gallery.appendChild(item);
    }

    // Title
    document.querySelector(".modal .title").innerText = "Galerie photo";

    // Add picture button
    const addPictureBtn = document.getElementById("modal-main-btn");
    addPictureBtn.innerText = "Ajouter une photo";
    addPictureBtn.disabled = false;
    addPictureBtn.removeEventListener("click", submitWork);
    addPictureBtn.addEventListener("click", addWorkModal);

    // Back button
    const backBtn = document.querySelector(".modal .back-btn");
    backBtn.style.display = "none";
    backBtn.removeEventListener("click", deleteWorkModal);

    // Close button
    document.querySelector(".modal .close-btn").addEventListener("click", closeModal);

    showModal();
}

//////////////
// Add work //
//////////////

async function submitWork() {
    const result = await uploadWork(
        document.getElementById("new-work-title").value.trim(),
        document.getElementById("new-work-category").selectedOptions[0].id.replace("option-", ""),
        document.getElementById("new-work-img").files[0]
    );
    if (result) {
        // Add new work to gallery
        document.querySelector("#portfolio .gallery").appendChild(
            createWorkItem(result.title, result.imageUrl, result.id)
        );
    }
    addWorkModal();
}

function checkInputs(form) {
    const inputs = form.querySelectorAll("input");
    let allFilled = true;
    let i = 0;
    while (allFilled && i < inputs.length) {
        allFilled = !!inputs[i].value;
        i++;
    }
    document.getElementById("modal-main-btn").disabled = !allFilled;
}

function previewImg(file, preview) {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        preview.src = reader.result;
        preview.style.display = "block";
    });

    if (file) {
        reader.readAsDataURL(file); // Read as a Base64 string
        document.querySelectorAll("#add-picture-form .hideOnPreview")
            .forEach(elem => {elem.style.display = "none"});
        checkInputs(document.getElementById("add-picture-form"));
    }
}

function createCategoryOption(id, name) {
    const option = document.createElement("option");
    option.id = "option-" + id;
    option.value = name;
    option.innerText = name;
    return option;
}

async function addWorkModal() {
    // Modal form
    const formContainer = document.querySelector(".modal .box");
    formContainer.innerHTML = "";
    formContainer.classList = "box form-container";
    formContainer.innerHTML = html_elem.UPLOAD_FORM;

    // Title
    document.querySelector(".modal .title").innerText = "Ajout photo";

    // Submit button
    const submitBtn = document.getElementById("modal-main-btn");
    submitBtn.innerText = "Valider";
    submitBtn.disabled = true;
    submitBtn.removeEventListener("click", addWorkModal);
    submitBtn.addEventListener("click", submitWork);

    // Back button
    const backBtn = document.querySelector(".modal .back-btn");
    backBtn.style.display = "flex";
    backBtn.addEventListener("click", deleteWorkModal);

    // Category selection
    const selectInput = document.getElementById("new-work-category");
    const categories = await getCategories();
    categories.forEach(category => {
        const option =  createCategoryOption(category.id, category.name);
        selectInput.appendChild(option);
    });

    // Image input
    const imgInput = document.getElementById("new-work-img");
    const imgPreview = document.getElementById("new-work-preview");
    imgInput.addEventListener("change", () => {previewImg(imgInput.files[0], imgPreview)});

    // Title input
    const titleInput = document.getElementById("new-work-title");
    titleInput.addEventListener("input", () => {
        if (titleInput.value && titleInput.value.trim().length > 2) {
            checkInputs(document.getElementById("add-picture-form"));
        } else {
            submitBtn.disabled = true;
        }
    });

    showModal();
}