export async function getWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        return await response.json();

    } catch {
        console.error("Failed to fetch works");
    }
}

export async function getCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        return await response.json();
    
    }  catch {
        console.error("Failed to fetch categories");
    }
}

export async function deleteWork(id) {
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

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        if (window.works) {
            const i = window.works.findIndex(item => item.id === id);
            if (i !== -1) {
                window.works.splice(i, 1);
            }
        }

        return true
    }
}

export async function uploadWork(title, categoryId, image) {
    const token = localStorage.getItem("token");
    if (token) {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);
        formData.append("category", categoryId);

        try {
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}`);
            }

            const result = await response.json();
            
            if (window.works) {
                const categories = !window.categories ? await getCategories() : window.categories;
                const i = categories.findIndex(item => item.id == result.categoryId);
                result.category = categories[i];
                window.works.push(result);
            }

            return result;

        }  catch {
            console.error("Failed to upload work");
        }
    }
}