const TICKET = {
  id: "dinner-party",
  name: "Mr. and Mrs. Cadaver's Dinner Party",
  venue: "Cadaver Mansion",
  modes: {
    standard: { label: "Standard Mode", adultPrice: 65, childPrice: 45 },
    junior:   { label: "Junior Mode",   adultPrice: 50, childPrice: 35 }
  },
  timeSlots: ["6:00 PM", "7:30 PM", "9:00 PM"]
};

const CART_KEY = "manorCart";

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    // Drop any entries from an older cart data shape (missing bookingId)
    const clean = cart.filter(b => b && b.bookingId && b.date && b.mode);
    if (clean.length !== cart.length) {
      saveCart(clean);
    }
    return clean;
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addBooking(booking) {
  const cart = getCart();
  cart.push({
    bookingId: "bk_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    date: booking.date,
    time: booking.time,
    mode: booking.mode,
    adults: booking.adults,
    children: booking.children
  });
  saveCart(cart);
}

function removeFromCart(bookingId) {
  const cart = getCart().filter(b => b.bookingId !== bookingId);
  saveCart(cart);
}

function priceForBooking(booking) {
  const modeInfo = TICKET.modes[booking.mode] || TICKET.modes.standard;
  return booking.adults * modeInfo.adultPrice + booking.children * modeInfo.childPrice;
}

function cartWithDetails() {
  return getCart().map(b => {
    const modeInfo = TICKET.modes[b.mode] || TICKET.modes.standard;
    const guestParts = [];
    if (b.adults > 0) guestParts.push(`${b.adults} adult${b.adults === 1 ? "" : "s"}`);
    if (b.children > 0) guestParts.push(`${b.children} child${b.children === 1 ? "" : "ren"} (under 12)`);
    return {
      bookingId: b.bookingId,
      name: TICKET.name,
      venue: TICKET.venue,
      date: b.date,
      time: b.time,
      modeLabel: modeInfo.label,
      adults: b.adults,
      children: b.children,
      guestLabel: guestParts.join(" · "),
      price: priceForBooking(b)
    };
  });
}

function cartTotal() {
  return cartWithDetails().reduce((sum, item) => sum + item.price, 0);
}

function cartCount() {
  return getCart().length;
}

function formatPrice(n) {
  return `$${n.toFixed(2)}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
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

function initAmbientChime() {
  const chime = document.getElementById("chime-audio");
  if (!chime) return;
  chime.volume = 0.18;

  function unlockChime() {
    chime.play().catch(() => {});
    document.removeEventListener("pointerdown", unlockChime);
  }

  document.addEventListener("pointerdown", unlockChime);
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  initAmbientChime();
});

