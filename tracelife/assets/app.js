// Variant data
const VARIANTS = {
  focus: {
    key: "focus",
    name: "FOCUS — Citrus Mint",
    benefit: "Laser-sharp clarity with citrus mint.",
    color: "#FDD835",
    image: "https://dummyimage.com/600x600/ffffff/000000&text=FOCUS",
    claims: ["Sugar-Free", "Low-Calorie", "Vegan"],
    ingredients: [
      "L-theanine 200mg",
      "Vitamin B12 100mcg",
      "Green Tea Extract 50mg",
    ],
    nutrition: "Calories 5 | Sugars 0g | Caffeine 80mg",
  },
  glow: {
    key: "glow",
    name: "GLOW — Berry Acai",
    benefit: "Radiant skin from within.",
    color: "#8E44AD",
    image: "https://dummyimage.com/600x600/ffffff/000000&text=GLOW",
    claims: ["Sugar-Free", "Low-Calorie", "Vegan"],
    ingredients: ["Biotin 5mg", "Vitamin C 100mg", "Acai Extract 50mg"],
    nutrition: "Calories 5 | Sugars 0g",
  },
  immune: {
    key: "immune",
    name: "IMMUNE — Ginger Citrus",
    benefit: "Defend daily with spicy citrus.",
    color: "#F39C12",
    image: "https://dummyimage.com/600x600/ffffff/000000&text=IMMUNE",
    claims: ["Sugar-Free", "Low-Calorie", "Vegan"],
    ingredients: ["Vitamin C 500mg", "Zinc 15mg", "Ginger Extract 100mg"],
    nutrition: "Calories 5 | Sugars 0g",
  },
  calm: {
    key: "calm",
    name: "CALM — Peach Lemongrass",
    benefit: "Find your inner chill.",
    color: "#F5B041",
    image: "https://dummyimage.com/600x600/ffffff/000000&text=CALM",
    claims: ["Sugar-Free", "Low-Calorie", "Vegan"],
    ingredients: ["Magnesium 200mg", "Chamomile 50mg"],
    nutrition: "Calories 5 | Sugars 0g",
  },
  hydrate: {
    key: "hydrate",
    name: "HYDRATE — Cucumber Lime",
    benefit: "Refresh and replenish.",
    color: "#27AE60",
    image: "https://dummyimage.com/600x600/ffffff/000000&text=HYDRATE",
    claims: ["Sugar-Free", "Low-Calorie", "Vegan"],
    ingredients: ["Electrolyte Blend 500mg", "Vitamin B5 50mg"],
    nutrition: "Calories 5 | Sugars 0g",
  },
};

// Cart logic
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(key, qty = 1, subscription = false) {
  const existing = cart.find(
    (c) => c.key === key && c.subscription === subscription,
  );
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ key, qty, subscription });
  }
  saveCart();
  updateCartDrawer();
  openCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartDrawer();
}

function cartSubtotal() {
  return cart.reduce((sum, item) => sum + item.qty * 4, 0); // dummy price
}

function updateCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  if (!drawer) return;
  drawer.innerHTML = "<h2>Cart</h2>";
  cart.forEach((item, i) => {
    const v = VARIANTS[item.key];
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `<span>${v.name} x${item.qty}</span><button data-remove="${i}">×</button>`;
    drawer.appendChild(div);
  });
  const subtotal = document.createElement("p");
  subtotal.textContent = `Subtotal: $${cartSubtotal().toFixed(2)}`;
  drawer.appendChild(subtotal);
  if (cart.length >= 2) {
    const bundle = document.createElement("p");
    bundle.textContent = "Build a bundle and save 15%";
    drawer.appendChild(bundle);
  }
  const checkout = document.createElement("a");
  checkout.href = "checkout.html";
  checkout.className = "btn";
  checkout.textContent = "Checkout";
  drawer.appendChild(checkout);
  drawer.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.remove));
  });
}

function openCart() {
  const drawer = document.getElementById("cartDrawer");
  if (drawer) drawer.classList.add("open");
}
function closeCart() {
  const drawer = document.getElementById("cartDrawer");
  if (drawer) drawer.classList.remove("open");
}

// Render functions
function renderBenefitCards() {
  const container = document.querySelector("[data-benefit-cards]");
  if (!container) return;
  Object.values(VARIANTS).forEach((v) => {
    const card = document.createElement("a");
    card.className = `card accent-${v.key}`;
    card.href = `product.html?variant=${v.key}`;
    card.innerHTML = `<img src="${v.image}" alt="${v.name}"><h3>${v.name.split("—")[0].trim()}</h3>`;
    container.appendChild(card);
  });
}

function renderShopGrid() {
  const grid = document.querySelector("[data-shop-grid]");
  if (!grid) return;
  Object.values(VARIANTS).forEach((v) => {
    const card = document.createElement("div");
    card.className = `card accent-${v.key}`;
    card.innerHTML = `<img src="${v.image}" alt="${v.name}"><h3>${v.name}</h3><p>${v.benefit}</p><button class="btn" data-add="${v.key}">Quick Add</button>`;
    grid.appendChild(card);
  });
  grid.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.dataset.add));
  });
}

function renderProductPage() {
  const container = document.querySelector("[data-product-page]");
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const key = params.get("variant") || "focus";
  const v = VARIANTS[key];
  if (!v) return;
  document.title = `${v.name} | TraceLife`;
  container.innerHTML = `
    <section class="section">
      <img src="${v.image}" alt="${v.name}" style="box-shadow:0 0 20px ${v.color};">
      <h1>${v.name}</h1>
      <p>${v.benefit}</p>
      <div>
        <label>Qty <input id="qty" type="number" min="1" value="1" style="width:60px;"></label>
      </div>
      <div>
        <button class="btn" id="addCart">Add to Cart</button>
      </div>
      <details>
        <summary>Ingredients</summary>
        <ul>${v.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
      </details>
      <p>${v.claims.join(" • ")}</p>
      <button class="btn" id="openNutrition">Nutrition Facts</button>
    </section>
    <section class="section">
      <h2>Reviews</h2>
      <p>★★★★★ &nbsp; "Amazing taste and benefits."</p>
    </section>
    <div id="nutritionModal" class="cart-drawer"></div>
  `;
  document.getElementById("addCart").addEventListener("click", () => {
    const qty = parseInt(document.getElementById("qty").value, 10) || 1;
    addToCart(key, qty);
  });
  const sticky = document.getElementById("stickyAdd");
  if (sticky)
    sticky.addEventListener("click", () => {
      const qty = parseInt(document.getElementById("qty").value, 10) || 1;
      addToCart(key, qty);
    });
  document.getElementById("openNutrition").addEventListener("click", () => {
    const modal = document.getElementById("nutritionModal");
    modal.classList.add("open");
    modal.innerHTML = `<button class="btn" onclick="closeNutrition()">Close</button><p>${v.nutrition}</p>`;
  });
}

function closeNutrition() {
  document.getElementById("nutritionModal").classList.remove("open");
}

// Navigation and cart listeners
function setupGlobal() {
  document
    .querySelectorAll("[data-cart-open]")
    .forEach((b) => b.addEventListener("click", openCart));
  document
    .querySelectorAll("[data-cart-close]")
    .forEach((b) => b.addEventListener("click", closeCart));
  updateCartDrawer();
}

document.addEventListener("DOMContentLoaded", () => {
  setupGlobal();
  renderBenefitCards();
  renderShopGrid();
  renderProductPage();
});
