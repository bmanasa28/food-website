// ===== Menu data (categories + hand-picked, verified Unsplash photo IDs) =====
const menuItems = [
  { id: 1,  name: "Classic Burger",   desc: "Juicy beef patty, cheese & lettuce", price: 199, emoji: "🍔", category: "Burgers",  img: "photo-1568901346375-23c9450c58cd", veg: false },
  { id: 2,  name: "Chicken Burger",   desc: "Crispy fried chicken with mayo",     price: 179, emoji: "🍔", category: "Burgers",  img: "photo-1606755962773-d324e0a13086", veg: false },
  { id: 3,  name: "Margherita Pizza", desc: "Fresh tomato, basil & mozzarella",   price: 329, emoji: "🍕", category: "Pizza",    img: "photo-1574071318508-1cdbab80d002", veg: true },
  { id: 4,  name: "Pepperoni Pizza",  desc: "Loaded with spicy pepperoni",        price: 399, emoji: "🍕", category: "Pizza",    img: "photo-1628840042765-356cda07504e", veg: false },
  { id: 5,  name: "Crispy Fries",     desc: "Golden, salted & served hot",        price: 99,  emoji: "🍟", category: "Sides",    img: "photo-1576107232684-1279f390859f", veg: true },
  { id: 6,  name: "Onion Rings",      desc: "Crunchy battered onion rings",       price: 119, emoji: "🧅", category: "Sides",    img: "photo-1639024471283-03518883512d", veg: true },
  { id: 7,  name: "Sushi Platter",    desc: "Assorted fresh nigiri & rolls",      price: 449, emoji: "🍣", category: "Sushi",    img: "photo-1579871494447-9811cf80d66c", veg: false },
  { id: 8,  name: "Taco Trio",        desc: "Three soft tacos with grilled meat", price: 199, emoji: "🌮", category: "Mexican",  img: "photo-1599974579688-8dbdd335c77f", veg: false },
  { id: 9,  name: "Burrito",          desc: "Stuffed with rice, beans & salsa",   price: 229, emoji: "🌯", category: "Mexican",  img: "photo-1626700051175-6818013e1d4f", veg: true },
  { id: 10, name: "Pasta Bowl",       desc: "Penne in rich tomato & herb sauce",  price: 259, emoji: "🍝", category: "Pasta",    img: "photo-1621996346565-e3dbc646d9a9", veg: true },
  { id: 11, name: "Fresh Salad",      desc: "Garden greens with dressing",        price: 149, emoji: "🥗", category: "Salads",   img: "photo-1512621776951-a57141f2eefd", veg: true },
  { id: 12, name: "Ice Cream",        desc: "Rich sundae with chocolate sauce",   price: 99,  emoji: "🍦", category: "Desserts", img: "photo-1563805042-7684c019e1cb", veg: true },
  { id: 13, name: "Chocolate Cake",   desc: "Rich, gooey chocolate layer cake",   price: 149, emoji: "🍰", category: "Desserts", img: "photo-1578985545062-69928b1d9587", veg: true },
  { id: 14, name: "Cola",             desc: "Chilled fizzy drink",                price: 49,  emoji: "🥤", category: "Drinks",   img: "photo-1554866585-cd94860890b7", veg: true },
  { id: 15, name: "Fresh Juice",      desc: "Freshly squeezed orange juice",      price: 79,  emoji: "🧃", category: "Drinks",   img: "photo-1621506289937-a8e4df240d0b", veg: true },
  { id: 16, name: "Coffee",           desc: "Freshly brewed hot latte",           price: 69,  emoji: "☕", category: "Drinks",   img: "photo-1572442388796-11668a67e53d", veg: true },
];

// Format a price in Indian Rupees, e.g. 1299 -> "₹1,299"
function formatPrice(amount) {
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

// ----- Bill settings (Indian food-app style: delivery fee + GST) -----
const DELIVERY_FEE = 30;          // flat delivery fee
const FREE_DELIVERY_OVER = 500;   // free delivery above this order value
const GST_RATE = 0.05;            // 5% GST

function deliveryFeeFor(subtotal) {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
}
function gstFor(subtotal) {
  return Math.round(subtotal * GST_RATE);
}
// Grand total = items + delivery + GST
function grandTotalNumber() {
  const sub = cartTotalNumber();
  return sub + deliveryFeeFor(sub) + gstFor(sub);
}

// Build an HD food photo URL from Unsplash, cropped to a consistent size
// so every card looks uniform (the modern food-delivery-app look).
function imageURL(item) {
  return `https://images.unsplash.com/${item.img}?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80`;
}

// A simple, consistent star rating per dish (deterministic, for the app look)
function ratingFor(item) {
  return (4.1 + (item.id % 8) * 0.1).toFixed(1);
}

// A consistent delivery time per dish (deterministic)
function deliveryFor(item) {
  const base = 15 + (item.id % 5) * 3;   // 15–27
  return `${base}–${base + 10} min`;
}

// Emoji icon for each category (used on the category chips)
const categoryIcons = {
  All: "🍽️", Burgers: "🍔", Pizza: "🍕", Sides: "🍟",
  Sushi: "🍣", Mexican: "🌮", Pasta: "🍝", Salads: "🥗",
  Desserts: "🍰", Drinks: "🥤",
};

// Dishes shown in the "Featured Dishes" section (the highest-rated picks)
const featuredIds = [1, 3, 7, 13];

// Shared card markup, reused by the menu and featured sections.
// Clicking the card opens its details page; the Add button is exempt.
function cardHTML(item) {
  return `
    <div class="card" onclick="location.href='details.html?id=${item.id}'">
      <div class="card-img-wrap">
        <img class="card-img" src="${imageURL(item)}" alt="${item.name}" loading="lazy"
             onerror="this.parentElement.innerHTML='<span class=&quot;emoji-fallback&quot;>${item.emoji}</span>'">
        <span class="rating-badge">⭐ ${ratingFor(item)}</span>
        <span class="veg-badge ${item.veg ? "veg" : "nonveg"}" title="${item.veg ? "Veg" : "Non-veg"}"></span>
        <button class="fav-btn ${isFav(item.id) ? "is-fav" : ""}" title="Save to wishlist"
                onclick="event.stopPropagation(); toggleFav(${item.id})">${isFav(item.id) ? "❤️" : "🤍"}</button>
      </div>
      <div class="card-body">
        <h3>${item.name}</h3>
        <p class="desc">${item.desc}</p>
        <div class="card-meta">
          <span>⏱ ${deliveryFor(item)}</span>
          <span>•</span>
          <span>${item.category}</span>
        </div>
        <div class="card-foot">
          <div class="price">${formatPrice(item.price)}</div>
          <button class="add-btn" onclick="event.stopPropagation(); addToCart(${item.id})">Add +</button>
        </div>
      </div>
    </div>`;
}

// Larger image for the details page
function detailImageURL(item) {
  return `https://images.unsplash.com/${item.img}?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80`;
}

// ===== State =====
let cart = loadCart();          // { id: { item, qty } } — loaded from localStorage
let activeCategory = "All";
let activeDiet = "All";          // "All" | "veg" | "nonveg"
let searchTerm = "";

// ===== Element references =====
const menuGrid   = document.getElementById("menu-grid");
const featuredGrid = document.getElementById("featured-grid");
const categoriesEl = document.getElementById("categories");
const searchInput = document.getElementById("search");
const noResults  = document.getElementById("no-results");
const cartEl     = document.getElementById("cart");
const overlay    = document.getElementById("overlay");
const cartItems  = document.getElementById("cart-items");
const cartCount  = document.getElementById("cart-count");
const cartTotal  = document.getElementById("cart-total");
const billEl       = document.getElementById("bill");
const billSubtotal = document.getElementById("bill-subtotal");
const billDelivery = document.getElementById("bill-delivery");
const billGst      = document.getElementById("bill-gst");
const checkoutBtn = document.getElementById("checkout-btn");
const modal      = document.getElementById("checkout-modal");
const orderSummary = document.getElementById("order-summary");
const toast      = document.getElementById("toast");

// ===================================================================
// Page detection: the full menu only exists on menu.html
// ===================================================================
const isMenuPage = !!menuGrid;

// ===================================================================
// Categories (links on the home page, filter buttons on the menu page)
// ===================================================================
function renderCategories() {
  if (!categoriesEl) return;
  const cats = ["All", ...new Set(menuItems.map(m => m.category))];
  categoriesEl.innerHTML = cats.map(cat => {
    const icon = `<span class="cat-icon">${categoryIcons[cat] || "🍴"}</span> ${cat}`;
    if (isMenuPage) {
      return `<button class="cat-btn ${cat === activeCategory ? "active" : ""}" onclick="setCategory('${cat}')">${icon}</button>`;
    }
    // Home page: clicking a category opens the menu page filtered to it
    return `<a class="cat-btn" href="menu.html?cat=${encodeURIComponent(cat)}">${icon}</a>`;
  }).join("");
}

function setCategory(cat) {
  activeCategory = cat;
  renderCategories();
  renderMenu();
}

// Veg / Non-veg diet filter (buttons live directly in menu.html)
function setDiet(diet) {
  activeDiet = diet;
  document.querySelectorAll("#diet-filters .diet-btn").forEach(btn => {
    // Match each button's onclick value to the chosen diet
    const isActive = btn.getAttribute("onclick") === `setDiet('${diet}')`;
    btn.classList.toggle("active", isActive);
  });
  renderMenu();
}

// ===================================================================
// Featured dishes (home page only)
// ===================================================================
function renderFeatured() {
  if (!featuredGrid) return;
  featuredGrid.innerHTML = menuItems
    .filter(item => featuredIds.includes(item.id))
    .map(cardHTML).join("");
}

// ===================================================================
// Full menu (menu page only)
// ===================================================================
function renderMenu() {
  if (!menuGrid) return;
  const filtered = menuItems.filter(item => {
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    const matchDiet = activeDiet === "All"
      || (activeDiet === "veg" && item.veg)
      || (activeDiet === "nonveg" && !item.veg);
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFav = !showFavOnly || isFav(item.id);
    return matchCat && matchDiet && matchSearch && matchFav;
  });
  if (noResults) noResults.hidden = filtered.length > 0;
  menuGrid.innerHTML = filtered.map(cardHTML).join("");

  // Featured row only makes sense when browsing everything — hide it while filtering
  const featuredSection = document.getElementById("featured-section");
  if (featuredSection) {
    const browsingAll = activeCategory === "All" && activeDiet === "All" && searchTerm.trim() === "" && !showFavOnly;
    featuredSection.style.display = browsingAll ? "" : "none";
  }
}

// ===================================================================
// FOOD DETAILS PAGE (details.html?id=…)
// ===================================================================
const detailContainer = document.getElementById("detail-container");
let detailQty = 1;
let detailItem = null;

function renderDetails() {
  if (!detailContainer) return;
  const id = Number(new URLSearchParams(location.search).get("id"));
  detailItem = menuItems.find(m => m.id === id);

  if (!detailItem) {
    detailContainer.innerHTML = `
      <div class="detail-missing">
        <h2>Dish not found 😕</h2>
        <p>We couldn't find that item.</p>
        <a class="view-all-btn" href="menu.html">← Back to Menu</a>
      </div>`;
    return;
  }

  const item = detailItem;
  document.title = `${item.name} · Tasty Bites`;
  detailContainer.innerHTML = `
    <a class="back-link" href="menu.html">← Back to Menu</a>
    <div class="detail-card">
      <div class="detail-img-wrap">
        <img src="${detailImageURL(item)}" alt="${item.name}"
             onerror="this.parentElement.innerHTML='<span class=&quot;emoji-fallback&quot;>${item.emoji}</span>'">
        <span class="veg-badge ${item.veg ? "veg" : "nonveg"}" title="${item.veg ? "Veg" : "Non-veg"}"></span>
      </div>
      <div class="detail-info">
        <span class="detail-cat">${categoryIcons[item.category] || "🍴"} ${item.category}</span>
        <h1>${item.name}</h1>
        <div class="detail-meta">
          <span>⭐ ${ratingFor(item)}</span>
          <span>⏱ ${deliveryFor(item)}</span>
          <span class="veg-label ${item.veg ? "veg" : "nonveg"}">${item.veg ? "🟢 Veg" : "🔴 Non-veg"}</span>
        </div>
        <p class="detail-desc">${item.desc}</p>
        <div class="detail-price">${formatPrice(item.price)}</div>
        <div class="qty-row">
          <button onclick="detailQtyChange(-1)">−</button>
          <span id="detail-qty">${detailQty}</span>
          <button onclick="detailQtyChange(1)">+</button>
        </div>
        <button class="add-btn detail-add" onclick="detailAddToCart()">Add ${detailQty} to Cart 🛒</button>
        <button class="detail-fav ${isFav(item.id) ? "is-fav" : ""}" onclick="toggleFav(${item.id})">${isFav(item.id) ? "❤️ Saved to wishlist" : "🤍 Save to wishlist"}</button>
      </div>
    </div>`;
}

function detailQtyChange(delta) {
  detailQty = Math.max(1, detailQty + delta);
  const qtyEl = document.getElementById("detail-qty");
  const addBtn = document.querySelector(".detail-add");
  if (qtyEl) qtyEl.textContent = detailQty;
  if (addBtn) addBtn.textContent = `Add ${detailQty} to Cart 🛒`;
}

function detailAddToCart() {
  if (!detailItem) return;
  if (!cart[detailItem.id]) cart[detailItem.id] = { item: detailItem, qty: 0 };
  cart[detailItem.id].qty += detailQty;
  saveCart();
  renderCart();
  openCart();
  showToast(`🛒 Added ${detailQty} × ${detailItem.name} to your cart!`);
  detailQty = 1;
  detailQtyChange(0); // refresh button label
}

// ===================================================================
// Search behaviour
// ===================================================================
const searchForm = document.getElementById("hero-search-form");

if (isMenuPage) {
  // Live filtering on the menu page
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      searchTerm = e.target.value;
      renderMenu();
    });
  }
  if (searchForm) searchForm.addEventListener("submit", e => e.preventDefault());

  // Honour ?q= and ?cat= from the URL (set by the home page links/search)
  const params = new URLSearchParams(location.search);
  const q = params.get("q");
  const cat = params.get("cat");
  if (q && searchInput) { searchTerm = q; searchInput.value = q; }
  if (cat) activeCategory = cat;
} else if (searchForm) {
  // Home page: pressing search sends you to the menu page with the query
  searchForm.addEventListener("submit", e => {
    e.preventDefault();
    const q = (searchInput && searchInput.value.trim()) || "";
    window.location.href = "menu.html" + (q ? "?q=" + encodeURIComponent(q) : "");
  });
}

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
          <span class="info">${item.emoji} ${item.name}<br><small>${formatPrice(item.price)}</small></span>
          <span class="qty-controls">
            <button onclick="changeQty(${id}, -1)">−</button>
            <span class="qty">${qty}</span>
            <button onclick="changeQty(${id}, 1)">+</button>
          </span>
        </li>`;
    }).join("");
  }

  let count = 0, subtotal = 0;
  ids.forEach(id => {
    count += cart[id].qty;
    subtotal += cart[id].qty * cart[id].item.price;
  });

  const delivery = deliveryFeeFor(subtotal);
  const gst = gstFor(subtotal);
  const grand = subtotal + delivery + gst;

  cartCount.textContent = count;

  // Show the itemised bill only when there's something in the cart
  if (billEl) billEl.hidden = count === 0;
  if (billSubtotal) billSubtotal.textContent = formatPrice(subtotal);
  if (billDelivery) billDelivery.textContent = (count > 0 && delivery === 0) ? "FREE" : formatPrice(delivery);
  if (billGst) billGst.textContent = formatPrice(gst);
  cartTotal.textContent = formatPrice(grand);

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
overlay.addEventListener("click", () => { closeCart(); closeModal(); closeAuth(); });

// ===================================================================
// FEATURE 3: Checkout form
// ===================================================================
function openModal() {
  // If the visitor is logged in, pre-fill their name to save typing
  const u = currentUser();
  if (u) {
    const nameInput = document.getElementById("cust-name");
    if (nameInput && !nameInput.value) nameInput.value = u.name;
  }
  // Build the order summary shown inside the form
  const lines = Object.keys(cart)
    .map(id => `${cart[id].qty}× ${cart[id].item.name}`)
    .join(", ");
  orderSummary.innerHTML =
    `<strong>Order:</strong> ${lines}<br><strong>To Pay:</strong> ${formatPrice(grandTotalNumber())} <small>(incl. delivery & GST)</small>`;
  modal.classList.add("open");
  overlay.classList.add("show");
}
function closeModal() { modal.classList.remove("open"); }

checkoutBtn.addEventListener("click", () => { closeCart(); openModal(); });
document.getElementById("modal-close").addEventListener("click", () => { closeModal(); overlay.classList.remove("show"); });

document.getElementById("checkout-form").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("cust-name").value.trim();
  const total = formatPrice(grandTotalNumber());

  // Clear everything
  cart = {};
  saveCart();
  renderCart();
  closeModal();
  overlay.classList.remove("show");
  e.target.reset();

  showToast(`🎉 Thanks, ${name}! Your ${total} order is on its way!`);
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
// Smooth scroll-reveal animations
// ===================================================================
function setupReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("in-view"));   // fallback: just show
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
}

// ===================================================================
// FEATURE: Wishlist / Favourites (saved in localStorage, survives refresh)
// ===================================================================
function loadFavs() {
  try { return JSON.parse(localStorage.getItem("tastyBitesFavs")) || []; }
  catch { return []; }
}
let favs = loadFavs();              // array of saved dish ids
let showFavOnly = false;            // menu page: show only wishlist items?

function saveFavs() { localStorage.setItem("tastyBitesFavs", JSON.stringify(favs)); }
function isFav(id) { return favs.includes(id); }

// Add or remove a dish from the wishlist, then refresh the hearts on screen
function toggleFav(id) {
  if (favs.includes(id)) favs = favs.filter(f => f !== id);
  else favs.push(id);
  saveFavs();
  updateFavCount();
  renderFeatured();   // refresh hearts in the featured row
  renderMenu();       // refresh hearts (and the wishlist view) on the menu
  renderDetails();    // refresh the heart on the details page
  const item = menuItems.find(m => m.id === id);
  showToast(isFav(id)
    ? `❤️ Saved ${item.name} to your wishlist!`
    : `💔 Removed ${item.name} from your wishlist.`);
}

// Update the little number on the header heart button
function updateFavCount() {
  const el = document.getElementById("fav-count");
  if (el) el.textContent = favs.length;
}

// Header heart button: on the menu page it toggles a "wishlist only" view;
// on other pages it sends you to the menu showing your wishlist.
const wishlistToggle = document.getElementById("wishlist-toggle");
if (wishlistToggle) {
  if (isMenuPage && new URLSearchParams(location.search).get("fav")) {
    showFavOnly = true;
    wishlistToggle.classList.add("active");
  }
  wishlistToggle.addEventListener("click", () => {
    if (isMenuPage) {
      showFavOnly = !showFavOnly;
      wishlistToggle.classList.toggle("active", showFavOnly);
      renderMenu();
      if (showFavOnly && favs.length === 0) {
        showToast("Your wishlist is empty — tap 🤍 on a dish to save it!");
      }
    } else {
      window.location.href = "menu.html?fav=1";
    }
  });
}

// ===================================================================
// FEATURE: Login / Sign-up (demo only — saved in localStorage)
// NOTE: This is NOT real security. Passwords live in the browser and
// are only meant for a learning/demo project — never for real users.
// ===================================================================
const authArea   = document.getElementById("auth-area");
const authModal  = document.getElementById("auth-modal");
const loginForm  = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const authTitle  = document.getElementById("auth-title");

// All registered users (an array). The person currently logged in is
// stored separately under "tastyBitesUser".
function loadUsers() {
  try { return JSON.parse(localStorage.getItem("tastyBitesUsers")) || []; }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem("tastyBitesUsers", JSON.stringify(users));
}
function currentUser() {
  try { return JSON.parse(localStorage.getItem("tastyBitesUser")); }
  catch { return null; }
}

// Header: show a greeting + Logout when signed in, otherwise a Login button
function renderAuth() {
  if (!authArea) return;
  const user = currentUser();
  if (user) {
    authArea.innerHTML =
      `<span class="auth-hi">👤 ${user.name.split(" ")[0]}</span>` +
      `<button id="logout-btn" class="auth-toggle">Logout</button>`;
    document.getElementById("logout-btn").addEventListener("click", logout);
  } else {
    authArea.innerHTML = `<button id="auth-toggle" class="auth-toggle">Login</button>`;
    document.getElementById("auth-toggle").addEventListener("click", () => openAuth("login"));
  }
}

function openAuth(mode) {
  showAuthMode(mode);
  authModal.classList.add("open");
  overlay.classList.add("show");
}
function closeAuth() {
  if (authModal) authModal.classList.remove("open");
}
// Flip between the Login form and the Sign-up form inside the same popup
function showAuthMode(mode) {
  const signup = mode === "signup";
  authTitle.textContent = signup ? "Create your account" : "Login";
  loginForm.hidden = signup;
  signupForm.hidden = !signup;
}

function logout() {
  localStorage.removeItem("tastyBitesUser");
  renderAuth();
  showToast("👋 You have been logged out.");
}

if (authModal) {
  document.getElementById("auth-close").addEventListener("click", () => {
    closeAuth(); overlay.classList.remove("show");
  });
  document.getElementById("show-signup").addEventListener("click", e => { e.preventDefault(); showAuthMode("signup"); });
  document.getElementById("show-login").addEventListener("click", e => { e.preventDefault(); showAuthMode("login"); });

  // Sign up → save the new account, then log them straight in
  signupForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim().toLowerCase();
    const password = document.getElementById("signup-password").value;

    const users = loadUsers();
    if (users.some(u => u.email === email)) {
      showToast("⚠️ That email is already registered. Please log in.");
      showAuthMode("login");
      return;
    }
    users.push({ name, email, password });
    saveUsers(users);
    localStorage.setItem("tastyBitesUser", JSON.stringify({ name, email }));
    signupForm.reset();
    closeAuth(); overlay.classList.remove("show");
    renderAuth();
    showToast(`🎉 Welcome, ${name.split(" ")[0]}! Your account is ready.`);
  });

  // Login → check the email + password against the saved accounts
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;

    const user = loadUsers().find(u => u.email === email && u.password === password);
    if (!user) {
      showToast("❌ Wrong email or password. Try again or sign up.");
      return;
    }
    localStorage.setItem("tastyBitesUser", JSON.stringify({ name: user.name, email: user.email }));
    loginForm.reset();
    closeAuth(); overlay.classList.remove("show");
    renderAuth();
    showToast(`✅ Welcome back, ${user.name.split(" ")[0]}!`);
  });
}

// ===================================================================
// Start everything
// ===================================================================
applyTheme(localStorage.getItem("tastyBitesTheme") || "light");
renderAuth();
updateFavCount();
renderCategories();
renderFeatured();
renderMenu();
renderDetails();
renderCart();
setupReveal();
