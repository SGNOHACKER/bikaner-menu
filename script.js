const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
const whatsappNumber = "919876543210";

let currentCategory = "all";
let selectedItem = null;
const cart = [];

function formatPrice(price) {
    return `\u20B9${price}`;
}

function openBottomSheet(item) {
    const bottomSheet = document.getElementById("bottomSheet");
    const backdrop = document.getElementById("backdrop");

    selectedItem = item;

    document.getElementById("sheetImage").src = item.image || DEFAULT_IMAGE;
    document.getElementById("sheetName").textContent = item.name;
    document.getElementById("sheetPrice").textContent = formatPrice(item.price);
    document.getElementById("sheetFullDesc").textContent = item.fullDescription || item.description || "";

    const ingredientsList = document.getElementById("sheetIngredients");
    ingredientsList.innerHTML = "";

    if (item.ingredients && item.ingredients.length > 0) {
        item.ingredients.forEach(ingredient => {
            const li = document.createElement("li");
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        });
    } else {
        const li = document.createElement("li");
        li.textContent = "Ingredients details not available.";
        ingredientsList.appendChild(li);
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
    }, 250);
}

function addToCart(item) {
    cart.push(item);
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function clearCart() {
    cart.length = 0;
    renderCart();
}

function renderCart() {
    const cartList = document.getElementById("cartList");
    const emptyCart = document.getElementById("emptyCart");
    const cartTotal = document.getElementById("cartTotal");
    const cartCount = document.getElementById("cartCount");

    cartList.innerHTML = "";

    if (cart.length === 0) {
        emptyCart.style.display = "block";
    } else {
        emptyCart.style.display = "none";
    }

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <div>
                <strong>${index + 1}. ${item.name}</strong>
                <span>${formatPrice(item.price)}</span>
            </div>
            <button class="remove-btn" data-index="${index}">Remove</button>
        `;

        cartList.appendChild(cartItem);
    });

    cartTotal.textContent = formatPrice(total);
    cartCount.textContent = cart.length;

    cartList.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", event => {
            removeFromCart(Number(event.currentTarget.dataset.index));
        });
    });
}

function buildWhatsAppMessage() {
    let total = 0;
    let orderLines = "";

    cart.forEach((item, index) => {
        total += item.price;
        orderLines += `${index + 1}. ${item.name} - ${formatPrice(item.price)}\n`;
    });

    return `Hi, I would like to place this order.\n\n${orderLines}\nWould you like to add a drink or dessert?\n\nTotal: ${formatPrice(total)}\n\nPlease confirm availability. Thanks!`;
}

function placeWhatsAppOrder() {
    if (cart.length === 0) {
        alert("Please add at least one item to your order.");
        return;
    }

    const successMessage = document.getElementById("successMessage");
    const encodedMessage = encodeURIComponent(buildWhatsAppMessage());
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    successMessage.style.display = "block";

    setTimeout(() => {
        window.location.href = whatsappUrl;
    }, 1000);
}

function renderMenu(items) {
    const grid = document.getElementById("menu-grid");
    grid.innerHTML = "";

    if (!items || items.length === 0) {
        grid.innerHTML = "<p style='text-align:center; padding: 40px; color: var(--primary);'>No dishes found in this category.</p>";
        return;
    }

    items.forEach(item => {
        const div = document.createElement("div");
        div.className = "menu-item";

        div.innerHTML = `
            <div class="menu-item-content">
                <div class="menu-item-header">
                    <h3>${item.name}</h3>
                    <div class="veg-indicator ${item.veg ? "veg" : "non-veg"}"></div>
                </div>
                <div class="price">${formatPrice(item.price)}</div>
                <div class="description">${item.description || ""}</div>
                ${item.special ? "<div class='chef-special'>Chef's Special</div>" : ""}
            </div>
            <img src="${item.image || DEFAULT_IMAGE}" onerror="this.src='${DEFAULT_IMAGE}'" loading="lazy" alt="${item.name}">
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
    renderCart();

    document.querySelectorAll(".nav-tab").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".nav-tab").forEach(tab => tab.classList.remove("active"));
            button.classList.add("active");
            currentCategory = button.dataset.category;
            filterMenu();
        });
    });

    document.getElementById("search").addEventListener("input", filterMenu);
    document.getElementById("closeBtn").addEventListener("click", closeBottomSheet);
    document.getElementById("backdrop").addEventListener("click", closeBottomSheet);
    document.getElementById("addToCartBtn").addEventListener("click", () => {
        if (selectedItem) {
            addToCart(selectedItem);
            closeBottomSheet();
            document.getElementById("cart").scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
    document.getElementById("clearCartBtn").addEventListener("click", clearCart);
    document.getElementById("whatsappOrderBtn").addEventListener("click", placeWhatsAppOrder);
    document.getElementById("viewMenuBtn").addEventListener("click", () => {
        document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
    });
});
