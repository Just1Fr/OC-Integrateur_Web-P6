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

async function fillGallery() {
    const gallery = document.querySelector(".gallery");
    if (gallery) {
        gallery.innerHTML = "";
        const works = await getWorks();
        if (works) {
            for (let i = 0; i < works.length; i++) {
                gallery.appendChild(
                    createWorkItem(works[i]["title"], works[i]["imageUrl"] )
                );
            }
        }
    }
}

fillGallery();