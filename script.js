// Cart utilities
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function getCart() {
  const saved = localStorage.getItem('cart');
  return saved ? JSON.parse(saved) : [];
}
// Add to cart functionality
document.addEventListener('DOMContentLoaded', () => {
  const addCartBtn = document.getElementById('addCart');
  if (addCartBtn) {
    // Product page: setup color selection
    const colorButtons = document.querySelectorAll('.colors button');
    const colorNames = ['Black', 'Indigo', 'Gray']; // matches button order
    colorButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        colorButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        // optionally set a data attribute
        btn.dataset.selected = 'true';
      });
      // Initialize first as selected
      if (index === 0) {
        btn.classList.add('selected');
        btn.dataset.selected = 'true';
      }
    });
    addCartBtn.addEventListener('click', () => {
      const sizeSelect = document.querySelector('select');
      const size = sizeSelect ? sizeSelect.value : 'Medium';
      const selectedColorBtn = document.querySelector('.colors button.selected');
      let color = 'Black'; // default
      if (selectedColorBtn) {
        const index = Array.from(colorButtons).indexOf(selectedColorBtn);
        color = colorNames[index] || 'Black';
      }
      // Product name and price
      const nameEl = document.querySelector('h1');
      const priceEl = document.querySelector('.price');
      const name = nameEl ? nameEl.textContent.trim() : 'Product';
      let price = 0;
      if (priceEl) {
        const priceText = priceEl.textContent.replace('$', '');
        price = parseFloat(priceText);
      }
      const cart = getCart();
      cart.push({ name, price, size, color });
      saveCart(cart);
      const msgEl = document.getElementById('cartMsg');
      if (msgEl) {
        msgEl.textContent = 'Product added to cart successfully!';
      }
    });
  }
  // Cart page: render cart items and summary
  const cartItemsContainer = document.querySelector('.cart-items');
  if (cartItemsContainer) {
    renderCart();
  }
  // Checkout page: render order summary
  const checkoutSummary = document.querySelector('.checkout-grid .summary');
  if (checkoutSummary) {
    renderCheckoutSummary();
  }
  // Confirmation page: render receipt
  const confirmationReceipt = document.querySelector('.receipt');
  if (confirmationReceipt) {
    renderConfirmationReceipt();
  }
});
function renderCart() {
  const cart = getCart();
  const container = document.querySelector('.cart-items');
  const summaryTotal = document.querySelector('.summary strong');
  const subtotalEl = document.querySelector('.summary p:nth-child(1) strong');
  const shippingEl = document.querySelector('.summary p:nth-child(2) strong');
  const totalEl = document.querySelector('.summary p:nth-child(3) strong');
  if (!container) return;
  // Clear existing items
  container.innerHTML = '';
  let subtotal = 0;
  cart.forEach((item, index) => {
    const itemEl = document.createElement('article');
    itemEl.className = 'cart-row';
    const visualClass = getVisualClass(item.name);
    itemEl.innerHTML = `
      <div class="product-visual ${visualClass} mini"></div>
      <div>
        <h3>${item.name}</h3>
        <p>Size: ${item.size} | Color: ${item.color}</p>
      </div>
      <strong>$${item.price.toFixed(2)}</strong>
    `;
    container.appendChild(itemEl);
    subtotal += item.price;
  });
  const shipping = 5.00; // fixed shipping
  const total = subtotal + shipping;
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}
function getVisualClass(name) {
  const lower = name.toLowerCase();
  if (lower.includes('hoodie')) return 'hoodie';
  if (lower.includes('shoe') || lower.includes('sneaker')) return 'shoes';
  if (lower.includes('t-shirt') || lower.includes('tshirt') || lower.includes('shirt')) return 'shirt';
  return 'hoodie';
}

function renderCheckoutSummary() {
  const cart = getCart();
  const productsTotalEl = document.querySelector('.checkout-grid .summary p:nth-child(1) strong');
  const shippingTotalEl = document.querySelector('.checkout-grid .summary p:nth-child(2) strong');
  const payNowEl = document.querySelector('.checkout-grid .summary p:nth-child(3) strong');
  if (!productsTotalEl) return;
  let subtotal = 0;
  cart.forEach(item => { subtotal += item.price; });
  const shipping = 5.00;
  const total = subtotal + shipping;
  productsTotalEl.textContent = `$${subtotal.toFixed(2)}`;
  shippingTotalEl.textContent = `$${shipping.toFixed(2)}`;
  payNowEl.textContent = `$${total.toFixed(2)}`;
}
function renderConfirmationReceipt() {
  const cart = getCart();
  const receipt = document.querySelector('.receipt');
  if (!receipt) return;
  // Clear existing content
  receipt.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const line = document.createElement('p');
    line.innerHTML = `<span>${item.name}</span><strong>$${item.price.toFixed(2)}</strong>`;
    receipt.appendChild(line);
    total += item.price;
  });
  const shippingLine = document.createElement('p');
  shippingLine.innerHTML = `<span>Shipping</span><strong>$5.00</strong>`;
  receipt.appendChild(shippingLine);
  const totalLine = document.createElement('p');
  totalLine.innerHTML = `<span>Total paid</span><strong>$${(total + 5).toFixed(2)}</strong>`;
  receipt.appendChild(totalLine);
  // Clear cart after order confirmation
  localStorage.removeItem('cart');
}