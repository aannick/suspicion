const EVENTS = [
  { id: "twilight-tour", name: "Twilight Tour of the West Wing", date: "Nightly, 6:00 PM", venue: "Cadaver Mansion", price: 28 },
  { id: "candlelit-tour", name: "Candlelit Evening Walkthrough", date: "Nightly, 8:30 PM", venue: "Cadaver Mansion", price: 42 },
  { id: "full-moon-vigil", name: "Full Moon Vigil", date: "Next full moon, 11:00 PM", venue: "Cadaver Mansion, Attic", price: 60 },
  { id: "family-day-tour", name: "Family Day Tour", date: "Saturdays, 11:00 AM", venue: "Cadaver Mansion, Grounds", price: 18 },
];

const CART_KEY = "manorCart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(eventId) {
  const cart = getCart();
  const existing = cart.find(item => item.id === eventId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: eventId, qty: 1 });
  }
  saveCart(cart);
}

function removeFromCart(eventId) {
  const cart = getCart().filter(item => item.id !== eventId);
  saveCart(cart);
}

function updateQty(eventId, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === eventId);
  if (item) {
    item.qty = Math.max(1, qty);
    saveCart(cart);
  }
}

function cartWithDetails() {
  return getCart().map(item => {
    const details = EVENTS.find(e => e.id === item.id);
    return { ...details, qty: item.qty };
  }).filter(item => item.name);
}

function cartTotal() {
  return cartWithDetails().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function cartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function formatPrice(n) {
  return `$${n.toFixed(2)}`;
}

function generateOrderNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code.slice(0, 4) + "-" + code.slice(4);
}

function updateCartBadge() {
  const badge = document.querySelector("[data-cart-count]");
  if (badge) {
    const count = cartCount();
    badge.textContent = count > 0 ? `Cart (${count})` : "Cart";
  }
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
