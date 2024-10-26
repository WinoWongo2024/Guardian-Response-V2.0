// Sample product data
const products = [
    {
        id: 1,
        name: "Product 1",
        price: 99.99,
        rating: 4,
        category: "electronics",
        image: "product1.jpg",
        inStock: true
    },
    {
        id: 2,
        name: "Product 2",
        price: 199.99,
        rating: 5,
        category: "clothing",
        image: "product2.jpg",
        inStock: true
    },
    // Add more products as needed
];

// Global cart array
let cart = [];

// Initializing the app
document.addEventListener("DOMContentLoaded", () => {
    renderProducts(products);
    updateCartCount();
    
    // Event listeners for filters
    document.getElementById("category").addEventListener("change", filterProducts);
    document.getElementById("price").addEventListener("input", updatePriceFilter);
    document.getElementById("rating").addEventListener("change", filterProducts);
});

// Render products
function renderProducts(productList) {
    const productGrid = document.querySelector(".product-grid");
    productGrid.innerHTML = ""; // Clear existing products

    productList.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p class="rating">${"⭐".repeat(product.rating)} (${product.rating})</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        
        productGrid.appendChild(productCard);
    });
}

// Filter products based on selected criteria
function filterProducts() {
    const category = document.getElementById("category").value;
    const maxPrice = document.getElementById("price").value;
    const minRating = document.getElementById("rating").value;

    const filteredProducts = products.filter(product => {
        return (category === "all" || product.category === category) &&
               product.price <= maxPrice &&
               product.rating >= minRating;
    });

    renderProducts(filteredProducts);
}

// Update price range display and filter products
function updatePriceFilter() {
    const price = document.getElementById("price").value;
    document.getElementById("price-value").innerText = `$0 - $${price}`;
    filterProducts();
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartCount();
}

// Update cart item count in header
function updateCartCount() {
    const cartCount = document.querySelector(".cart-count");
    cartCount.innerText = cart.reduce((total, item) => total + item.quantity, 0);
}

// Render the cart items (if there's a cart page or modal, you can expand this function)
function renderCart() {
    const cartContainer = document.getElementById("cart-items");
    if (!cartContainer) return; // Only if there's a cart display area

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <h4>${item.name}</h4>
            <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join("");
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
}
