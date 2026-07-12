const cookies = [
    { id: 1, name: "Chocolate Chip", desc: "Classic vanilla dough loaded with chocolate chips.", price: 25, image: "images/chocolate-chip.jpg", rating: 4.8, badge: "Bestseller" },
    { id: 2, name: "Double Chocolate", desc: "Rich cocoa dough with chunks of dark chocolate.", price: 28, image: "images/double-chocolate.jpg", rating: 4.7 },
    { id: 3, name: "Oatmeal Raisin", desc: "Chewy oats mixed with sweet, plump raisins.", price: 22, image: "images/oatmeal-raisin.jpg", rating: 4.4 },
    { id: 4, name: "Peanut Butter", desc: "Soft, nutty, and topped with a peanut butter swirl.", price: 24, image: "images/peanut-butter.jpg", rating: 4.6 },
    { id: 5, name: "White Choc Macadamia", desc: "Buttery cookie with white chocolate and macadamia nuts.", price: 30, image: "images/white-choc-macadamia.jpg", rating: 4.9, badge: "New" },
    { id: 6, name: "Red Velvet", desc: "Cocoa-kissed dough with cream cheese chips.", price: 27, image: "images/red-velvet.jpg", rating: 4.5 },
];

function renderStars(rating) {
    const full = Math.round(rating);
    return "★".repeat(full) + "☆".repeat(5 - full);
}

let cart = [];

function renderCookies() {
    const grid = document.getElementById("cookie-grid");
    grid.innerHTML = cookies
        .map(
            (cookie) => `
        <div class="cookie-card">
            <div class="cookie-image-wrap">
                <img class="cookie-image" src="${cookie.image}" alt="${cookie.name}">
                ${cookie.badge ? `<span class="badge">${cookie.badge}</span>` : ""}
            </div>
            <h3>${cookie.name}</h3>
            <p class="rating"><span class="stars">${renderStars(cookie.rating)}</span> ${cookie.rating.toFixed(1)}</p>
            <p class="cookie-desc">${cookie.desc}</p>
            <div class="cookie-footer">
                <span class="price">R${cookie.price.toFixed(2)}</span>
                <button class="add-btn" data-id="${cookie.id}">Add to Cart</button>
            </div>
        </div>
    `
        )
        .join("");
}

function addToCart(id) {
    const existing = cart.find((item) => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        const cookie = cookies.find((c) => c.id === id);
        cart.push({ ...cookie, quantity: 1 });
    }
    renderCart();
}

function changeQuantity(id, delta) {
    const item = cart.find((item) => item.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter((item) => item.id !== id);
    }
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    renderCart();
}

function renderCart() {
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        totalEl.textContent = "Total: R0.00";
        return;
    }

    container.innerHTML = cart
        .map(
            (item) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">R${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" data-action="decrease" data-id="${item.id}">−</button>
                <span class="qty">${item.quantity}</span>
                <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
                <button class="remove-btn" data-id="${item.id}">✕</button>
            </div>
        </div>
    `
        )
        .join("");

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalEl.textContent = `Total: R${total.toFixed(2)}`;
}

document.getElementById("cookie-grid").addEventListener("click", (e) => {
    if (e.target.classList.contains("add-btn")) {
        addToCart(Number(e.target.dataset.id));
    }
});

document.getElementById("cart-items").addEventListener("click", (e) => {
    const id = Number(e.target.dataset.id);
    if (e.target.classList.contains("remove-btn")) {
        removeFromCart(id);
    } else if (e.target.dataset.action === "increase") {
        changeQuantity(id, 1);
    } else if (e.target.dataset.action === "decrease") {
        changeQuantity(id, -1);
    }
});

document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    alert("Thank you for your order! 🍪");
    cart = [];
    renderCart();
});

renderCookies();
renderCart();
