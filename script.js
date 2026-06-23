// ===== Menu data (with categories + image keywords) =====
const menuItems = [
  { id: 1,  name: "Classic Burger",   desc: "Juicy beef patty, cheese & lettuce", price: 8.99,  emoji: "🍔", category: "Burgers",  query: "burger" },
  { id: 2,  name: "Chicken Burger",   desc: "Crispy chicken with mayo",           price: 7.99,  emoji: "🍔", category: "Burgers",  query: "chickenburger" },
  { id: 3,  name: "Margherita Pizza", desc: "Fresh tomato, basil & mozzarella",   price: 11.50, emoji: "🍕", category: "Pizza",    query: "pizza" },
  { id: 4,  name: "Pepperoni Pizza",  desc: "Loaded with spicy pepperoni",        price: 13.00, emoji: "🍕", category: "Pizza",    query: "pepperoni,pizza" },
  { id: 5,  name: "Crispy Fries",     desc: "Golden, salted & served hot",        price: 3.99,  emoji: "🍟", category: "Sides",    query: "fries" },
  { id: 6,  name: "Onion Rings",      desc: "Crunchy battered onion rings",       price: 4.49,  emoji: "🧅", category: "Sides",    query: "onionrings" },
  { id: 7,  name: "Sushi Platter",    desc: "Assorted fresh nigiri & rolls",      price: 14.00, emoji: "🍣", category: "Sushi",    query: "sushi" },
  { id: 8,  name: "Taco Trio",        desc: "Three soft tacos, your choice",      price: 7.49,  emoji: "🌮", category: "Mexican",  query: "tacos" },
  { id: 9,  name: "Burrito",          desc: "Stuffed with rice, beans & salsa",   price: 8.49,  emoji: "🌯", category: "Mexican",  query: "burrito" },
  { id: 10, name: "Pasta Bowl",       desc: "Creamy alfredo with herbs",          price: 9.99,  emoji: "🍝", category: "Pasta",    query: "pasta" },
  { id: 11, name: "Fresh Salad",      desc: "Garden greens with dressing",        price: 6.50,  emoji: "🥗", category: "Salads",   query: "salad" },
  { id: 12, name: "Ice Cream",        desc: "Two scoops, choose your flavor",     price: 4.25,  emoji: "🍦", category: "Desserts", query: "icecream" },
  { id: 13, name: "Chocolate Cake",   desc: "Rich, moist chocolate slice",        price: 5.50,  emoji: "🍰", category: "Desserts", query: "chocolatecake" },
  { id: 14, name: "Cola",             desc: "Chilled fizzy drink",                price: 1.99,  emoji: "🥤", category: "Drinks",   query: "cola,soda" },
  { id: 15, name: "Fresh Juice",      desc: "Orange, apple or mango",             price: 2.99,  emoji: "🧃", category: "Drinks",   query: "juice" },
  { id: 16, name: "Coffee",           desc: "Freshly brewed hot coffee",          price: 2.49,  emoji: "☕", category: "Drinks",   query: "coffee" },
];

// Build a food photo URL for a dish (free keyword-based image service).
// The `lock` keeps each dish showing the SAME photo every time it loads.
function imageURL(item) {
  return `https://loremflickr.com/320/240/${item.query}?lock=${item.id}`;
}

// ===== State =====
let cart = loadCart();          // { id: { item, qty } } — loaded from localStorage
let activeCategory = "All";
let searchTerm = "";

// ===== Element references =====
const menuGrid   = document.getElementById("menu-grid");
const categoriesEl = document.getElementById("categories");
const searchInput = document.getElementById("search");
const noResults  = document.getElementById("no-results");
const cartEl     = document.getElementById("cart");
const overlay    = document.getElementById("overlay");
const cartItems  = document.getElementById("cart-items");
const cartCount  = document.getElementById("cart-count");
const cartTotal  = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const modal      = document.getElementById("checkout-modal");
const orderSummary = document.getElementById("order-summary");
const toast      = document.getElementById("toast");

// ===================================================================
// FEATURE 1 + 4: Categories & Search
// ===================================================================
function renderCategories() {
  const cats = ["All", ...new Set(menuItems.map(m => m.category))];
  categoriesEl.innerHTML = cats.map(cat =>
    `<button class="cat-btn ${cat === activeCategory ? "active" : ""}"
             onclick="setCategory('${cat}')">${cat}</button>`
  ).join("");
}

function setCategory(cat) {
  activeCategory = cat;
  renderCategories();
  renderMenu();
}

function renderMenu() {
  const filtered = menuItems.filter(item => {
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  noResults.hidden = filtered.length > 0;

  menuGrid.innerHTML = filtered.map(item => `
    <div class="card">
      <div class="card-img-wrap">
        <img class="card-img" src="${imageURL(item)}" alt="${item.name}" loading="lazy"
             onerror="this.parentElement.innerHTML='<span class=&quot;emoji-fallback&quot;>${item.emoji}</span>'">
      </div>
      <div class="card-body">
        <h3>${item.name}</h3>
        <p class="desc">${item.desc}</p>
        <div class="price">$${item.price.toFixed(2)}</div>
        <button class="add-btn" onclick="addToCart(${item.id})">Add to Cart</button>
      </div>
    </div>
  `).join("");
}

searchInput.addEventListener("input", e => {
  searchTerm = e.target.value;
  renderMenu();
});

// ===================================================================
// FEATURE 2: Cart with localStorage (survives refresh!)
// ===================================================================
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("tastyBitesCart")) || {};
  } catch {
    return {};
  }
}

function saveCart() {
  localStorage.setItem("tastyBitesCart", JSON.stringify(cart));
}

function addToCart(id) {
  const item = menuItems.find(m => m.id === id);
  if (!cart[id]) cart[id] = { item, qty: 0 };
  cart[id].qty++;
  saveCart();
  renderCart();
  openCart();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  saveCart();
  renderCart();
}

function renderCart() {
  const ids = Object.keys(cart);

  if (ids.length === 0) {
    cartItems.innerHTML = `<li class="cart-empty">Your cart is empty 🛒</li>`;
  } else {
    cartItems.innerHTML = ids.map(id => {
      const { item, qty } = cart[id];
      return `
        <li class="cart-item">
          <span class="info">${item.emoji} ${item.name}<br><small>$${item.price.toFixed(2)}</small></span>
          <span class="qty-controls">
            <button onclick="changeQty(${id}, -1)">−</button>
            <span class="qty">${qty}</span>
            <button onclick="changeQty(${id}, 1)">+</button>
          </span>
        </li>`;
    }).join("");
  }

  let count = 0, total = 0;
  ids.forEach(id => {
    count += cart[id].qty;
    total += cart[id].qty * cart[id].item.price;
  });
  cartCount.textContent = count;
  cartTotal.textContent = `$${total.toFixed(2)}`;
  checkoutBtn.disabled = count === 0;
}

function cartTotalNumber() {
  return Object.keys(cart).reduce((sum, id) => sum + cart[id].qty * cart[id].item.price, 0);
}

// ===== Open / close cart =====
function openCart()  { cartEl.classList.add("open");    overlay.classList.add("show"); }
function closeCart() { cartEl.classList.remove("open"); overlay.classList.remove("show"); }

document.getElementById("cart-toggle").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
overlay.addEventListener("click", () => { closeCart(); closeModal(); });

// ===================================================================
// FEATURE 3: Checkout form
// ===================================================================
function openModal() {
  // Build the order summary shown inside the form
  const lines = Object.keys(cart)
    .map(id => `${cart[id].qty}× ${cart[id].item.name}`)
    .join(", ");
  orderSummary.innerHTML =
    `<strong>Order:</strong> ${lines}<br><strong>Total:</strong> $${cartTotalNumber().toFixed(2)}`;
  modal.classList.add("open");
  overlay.classList.add("show");
}
function closeModal() { modal.classList.remove("open"); }

checkoutBtn.addEventListener("click", () => { closeCart(); openModal(); });
document.getElementById("modal-close").addEventListener("click", () => { closeModal(); overlay.classList.remove("show"); });

document.getElementById("checkout-form").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("cust-name").value.trim();
  const total = cartTotalNumber().toFixed(2);

  // Clear everything
  cart = {};
  saveCart();
  renderCart();
  closeModal();
  overlay.classList.remove("show");
  e.target.reset();

  showToast(`🎉 Thanks, ${name}! Your $${total} order is on its way!`);
});

// ===================================================================
// Toast notification
// ===================================================================
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 4000);
}

// ===================================================================
// FEATURE: Dark mode (remembers your choice)
// ===================================================================
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "🌙";
  }
}

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  const theme = isDark ? "dark" : "light";
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("tastyBitesTheme", theme);
});

// ===================================================================
// Start everything
// ===================================================================
applyTheme(localStorage.getItem("tastyBitesTheme") || "light");
renderCategories();
renderMenu();
renderCart();
