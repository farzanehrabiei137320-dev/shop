
`javascript
const state = {
  products: [],
  cart: JSON.parse(localStorage.getItem("cart") || "[]"),
  view: "list",
  currentProductId: null
};

const fmtPrice = (n) => new Intl.NumberFormat("fa-IR").format(n) + " تومان";
const saveCart = () => localStorage.setItem("cart", JSON.stringify(state.cart));
const setView = (v) => {
  state.view = v;
  document.getElementById("productList").classList.toggle("hidden", v !== "list");
  document.getElementById("productDetail").classList.toggle("hidden", v !== "detail");
  document.getElementById("cartView").classList.toggle("hidden", v !== "cart");
};

const getCartQty = () => state.cart.reduce((sum, item) => sum + item.qty, 0);
const findProduct = (id) => state.products.find(p => p.id === id);
const cartItemTotal = (item) => findProduct(item.id).price * item.qty;
const cartGrandTotal = () => state.cart.reduce((sum, item) => sum + cartItemTotal(item), 0);

const renderCartCount = () => {
  document.getElementById("cartCount").textContent = getCartQty();
};

const renderProducts = () => {
  const container = document.getElementById("productList");
  container.innerHTML = state.products.map(p => `
    <article class="card">
      <img src="${p.thumb}" alt="${p.title}" />
      <div class="content">
        <h3>${p.title}</h3>
        <p>${p.summary}</p>
        <div class="price">${fmtPrice(p.price)}</div>
        <button class="btn" onclick="viewDetail('${p.id}')">جزئیات</button>
        <button class="btn secondary" onclick="addToCart('${p.id}', 1)">افزودن</button>
      </div>
    </article>
  `).join("");
};

const renderDetail = (id) => {
  const p = findProduct(id);
  const container = document.getElementById("productDetail");
  container.innerHTML = `
    <button class="btn secondary" onclick="backToList()">بازگشت</button>
    <div class="detail">
      <h2>${p.title}</h2>
      <div class="gallery">${p.images.map(src => <img src="${src}" />).join("")}</div>
      <p>${p.description}</p>
      <input id="qtyInput" type="number" min="1" value="1" />
      <button class="btn" onclick="addToCart('${p.id}', parseInt(document.getElementById('qtyInput').value)||1)">افزودن به سبد</button>
    </div>
  `;
};

const renderCart = () => {
  const container = document.getElementById("cartView");
  if (state.cart.length === 0) {
    container.innerHTML = <p>سبد خرید خالی است.</p>;
    return;
  }
  container.innerHTML = state.cart.map(item => {
    const p = findProduct(item.id);
    return `
      <div class="cart-item">
        <img src="${p.thumb}" />
        <div>
          <strong>${p.title}</strong>
          <p>${p.summary}</p>
          <div>قیمت: ${fmtPrice(p.price)}</div>
          <input type="number" min="1"
