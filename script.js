// ===== Menu data =====
// Each item: name, short description, price, and an emoji "image".
const menuItems = [
  { id: 1, name: "Classic Burger",  desc: "Juicy beef patty, cheese & lettuce", price: 8.99,  emoji: "🍔" },
  { id: 2, name: "Margherita Pizza", desc: "Fresh tomato, basil & mozzarella",   price: 11.50, emoji: "🍕" },
  { id: 3, name: "Crispy Fries",     desc: "Golden, salted & served hot",        price: 3.99,  emoji: "🍟" },
  { id: 4, name: "Sushi Platter",    desc: "Assorted fresh nigiri & rolls",      price: 14.00, emoji: "🍣" },
  { id: 5, name: "Taco Trio",        desc: "Three soft tacos, your choice",      price: 7.49,  emoji: "🌮" },
  { id: 6, name: "Pasta Bowl",       desc: "Creamy alfredo with herbs",          price: 9.99,  emoji: "🍝" },
  { id: 7, name: "Fresh Salad",      desc: "Garden greens with dressing",        price: 6.50,  emoji: "🥗" },
  { id: 8, name: "Ice Cream",        desc: "Two scoops, choose your flavor",     price: 4.25,  emoji: "🍦" },
];

// ===== Cart state =====
// Key = item id, value = { item, qty }
const cart = {};

// ===== Grab elements =====
const menuGrid  = document.getElementById("menu-grid");
const cartEl    = document.getElementById("cart");
const overlay   = document.getElementById("overlay");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const placeOrderBtn = document.getElementById("place-order");

// ===== Build the menu cards =====
function renderMenu() {
  menuGrid.innerHTML = menuItems.map(item => `
    <div class="card">
      <div class="emoji">${item.emoji}</div>
      <h3>${item.name}</h3>
      <p class="desc">${item.desc}</p>
      <div class="price">$${item.price.toFixed(2)}</div>
      <button class="add-btn" onclick="addToCart(${item.id})">Add to Cart</button>
    </div>
  `).join("");
}

// ===== Cart actions =====
function addToCart(id) {
  const item = menuItems.find(m => m.id === id);
  if (!cart[id]) cart[id] = { item, qty: 0 };
  cart[id].qty++;
  renderCart();
  openCart();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  renderCart();
}

// ===== Render the cart =====
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

  // Totals
  let count = 0, total = 0;
  ids.forEach(id => {
    count += cart[id].qty;
    total += cart[id].qty * cart[id].item.price;
  });
  cartCount.textContent = count;
  cartTotal.textContent = `$${total.toFixed(2)}`;
  placeOrderBtn.disabled = count === 0;
}

// ===== Open / close cart =====
function openCart()  { cartEl.classList.add("open");    overlay.classList.add("show"); }
function closeCart() { cartEl.classList.remove("open"); overlay.classList.remove("show"); }

// ===== Wire up buttons =====
document.getElementById("cart-toggle").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

placeOrderBtn.addEventListener("click", () => {
  const total = cartTotal.textContent;
  alert(`🎉 Thank you for your order!\n\nTotal: ${total}\n\nYour delicious food is on its way!`);
  // Clear the cart
  Object.keys(cart).forEach(id => delete cart[id]);
  renderCart();
  closeCart();
});

// ===== Start =====
renderMenu();
renderCart();
