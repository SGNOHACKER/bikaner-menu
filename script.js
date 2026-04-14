const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";

let currentCategory = "all";

function openBottomSheet(item) {
    const bottomSheet = document.getElementById("bottomSheet");
    const backdrop = document.getElementById("backdrop");
    
    document.getElementById("sheetImage").src = item.image || DEFAULT_IMAGE;
    document.getElementById("sheetName").textContent = item.name;
    document.getElementById("sheetPrice").textContent = `₹${item.price}`;
    document.getElementById("sheetFullDesc").textContent = item.fullDescription || item.description || "";
    
    const ingredientsList = document.getElementById("sheetIngredients");
    ingredientsList.innerHTML = "";
    if (item.ingredients) {
        item.ingredients.forEach(ing => {
            const li = document.createElement("li");
            li.textContent = ing;
            ingredientsList.appendChild(li);
        });
    }

    backdrop.style.display = "block";
    setTimeout(() => {
        bottomSheet.style.transform = "translate(-50%, 0)";
    }, 10);
}

function closeBottomSheet() {
    const bottomSheet = document.getElementById("bottomSheet");
    const backdrop = document.getElementById("backdrop");
    
    bottomSheet.style.transform = "translate(-50%, 100%)";
    setTimeout(() => {
        backdrop.style.display = "none";
    }, 500);
}

function renderMenu(items) {
    const grid = document.getElementById("menu-grid");
    grid.innerHTML = "";

    if (!items || items.length === 0) {
        grid.innerHTML = "<p style='text-align:center; padding: 40px; color: var(--primary);'>No dishes found in this category.</p>";
        return;
    }

    items.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "menu-item visible";
        div.style.animationDelay = `${index * 0.05}s`;

        div.innerHTML = `
            <div class="menu-item-content">
                <div class="menu-item-header">
                    <h3>${item.name}</h3>
                    <div class="veg-indicator ${item.veg ? 'veg' : 'non-veg'}"></div>
                </div>
                <div class="price">₹${item.price}</div>
                <div class="description">${item.description || ""}</div>
                ${item.special ? '<div class="chef-special">Chef\'s Special</div>' : ''}
            </div>
            <img src="${item.image || DEFAULT_IMAGE}" 
                 onerror="this.src='${DEFAULT_IMAGE}'"
                 loading="lazy">
        `;

        div.addEventListener("click", () => openBottomSheet(item));
        grid.appendChild(div);
    });
}

function filterMenu() {
    const query = document.getElementById("search").value.toLowerCase();

    const filtered = menuData.filter(item => {
        const matchCategory = currentCategory === "all" || item.category === currentCategory;
        const matchSearch = item.name.toLowerCase().includes(query);
        return matchCategory && matchSearch;
    });

    renderMenu(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
    if (typeof menuData === "undefined") {
        document.getElementById("menu-grid").innerHTML =
            "<p style='color:red;text-align:center'>Menu failed to load. Please check menuData.js</p>";
        return;
    }

    renderMenu(menuData);

    // Nav tabs
    document.querySelectorAll(".nav-tab").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".nav-tab").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentCategory = btn.dataset.category;
            filterMenu();
        });
    });

    // Search
    document.getElementById("search").addEventListener("input", filterMenu);

    // Bottom Sheet Controls
    document.getElementById("closeBtn").addEventListener("click", closeBottomSheet);
    document.getElementById("backdrop").addEventListener("click", closeBottomSheet);

    // Hero btn scroll
    document.getElementById("viewMenuBtn").addEventListener("click", () => {
        document.getElementById("menu").scrollIntoView({ behavior: 'smooth' });
    });
});