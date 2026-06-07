// ==========================================
// 1. DATA PRODUK UTAMA (INITIAL STATE)
// ==========================================
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Baju Casual Oversize",
    price: 120000,
    oldPrice: 150000,
    image: "img/baju_casual.jpg",
    badge: "Diskon 20%",
    description: "Baju casual oversize dengan bahan nyaman dan model trendy. Cocok digunakan untuk kuliah, hangout, atau aktivitas santai sehari-hari.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Putih", "Hitam", "Beige", "Pink"],
    reviews: [
      { name: "Aulia", rating: 5, comment: "Bahannya nyaman dan cocok untuk dipakai kuliah." },
      { name: "Rani", rating: 4, comment: "Modelnya trendy, ukurannya pas, dan warnanya bagus." }
    ]
  },
  {
    id: 2,
    name: "Kemeja Korean Style",
    price: 150000,
    oldPrice: 175000,
    image: "img/kemeja_korean.jpg",
    badge: "Diskon 15%",
    description: "Kemeja gaya Korea dengan potongan rapi dan bahan premium. Sangat cocok untuk acara semi-formal maupun hangout.",
    sizes: ["M", "L", "XL"],
    colors: ["Biru Muda", "Putih", "Hitam"],
    reviews: [
      { name: "Budi", rating: 5, comment: "Keren banget kemejanya, pas di badan!" }
    ]
  },
  {
    id: 3,
    name: "Hoodie Casual Campus",
    price: 180000,
    oldPrice: 200000,
    image: "img/hoodie_casual.jpg",
    badge: "Best Seller",
    description: "Hoodie tebal hangat namun tidak gerah. Pas untuk melengkapi style kasual harian Anda di kampus.",
    sizes: ["L", "XL", "XXL"],
    colors: ["Abu-abu", "Hitam", "Navy"],
    reviews: []
  },
  {
    id: 4,
    name: "Blouse Trendy",
    price: 135000,
    oldPrice: 135000,
    image: "img/blouse_trendy.webp",
    badge: "Voucher",
    description: "Blouse wanita dengan desain terkini, anggun, dan nyaman dipakai seharian.",
    sizes: ["S", "M", "L"],
    colors: ["Mocca", "Putih"],
    reviews: []
  }
];

// Inisialisasi Produk ke LocalStorage jika belum ada
if (!localStorage.getItem('products')) {
  localStorage.setItem('products', JSON.stringify(DEFAULT_PRODUCTS));
}

// Helper untuk ambil data produk terbaru
function getProducts() {
  return JSON.parse(localStorage.getItem('products'));
}

// ==========================================
// 2. LOGIKA KERANJANG BELANJA (CART)
// ==========================================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
  const cartCountElements = document.querySelectorAll('#cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElements.forEach(el => {
    el.textContent = totalItems;
  });
}

function addToCart(productId, size, color, quantity = 1) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  
  if (!product) return;

  // Cek apakah item dengan spek sama sudah ada di keranjang
  const existingItem = cart.find(item => item.id === productId && item.size === size && item.color === color);

  if (existingItem) {
    existingItem.quantity += parseInt(quantity);
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: size || product.sizes[0] || 'All Size',
      color: color || product.colors[0] || 'Default',
      quantity: parseInt(quantity)
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showToast(`✅ ${product.name} berhasil ditambah ke keranjang!`);
}

// ==========================================
// 3. SIMULASI AUTENTIKASI (LOGIN & REGISTER)
// ==========================================
// Buat user dummy default untuk simulasi jika belum ada
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify([
    { username: "admin", email: "admin@orecloth.com", password: "admin123", role: "admin" },
    { username: "Adel", email: "adel@gmail.com", password: "password123", role: "user" }
  ]));
}

function getLoggedInUser() {
  return JSON.parse(localStorage.getItem('currentUser')) || null;
}

function checkAuthStatus() {
  const user = getLoggedInUser();
  const navActions = document.querySelector('.nav-actions');
  const userMenu = document.querySelector('.user-menu');
  
  // Jika elemen di navbar ada, kita sesuaikan tampilannya secara dinamis
  if (user) {
    if (navActions) {
      // Ganti tombol masuk menjadi sapaan user di versi mobile/desktop
      navActions.innerHTML = `
        <input type="text" id="search-input" placeholder="Cari baju..." onkeyup="searchProduct(this.value)" />
        <span class="user-greeting"><i class="fa-solid fa-user-circle"></i> ${user.username}</span>
        <a href="#" onclick="logoutProcess()"><i class="fa-solid fa-right-from-bracket"></i></a>
        <a href="keranjang.html" class="cart-link">
          <i class="fa-solid fa-basket-shopping"></i><span id=\"cart-count\">0</span>
        </a>
      `;
    }
  }
  updateCartCount();
}

function logoutProcess() {
  localStorage.removeItem('currentUser');
  showToast("🔒 Berhasil keluar akun");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
}

// ==========================================
// 4. FITUR PENCARIAN & UTILITY GLOBAL
// ==========================================
function searchProduct(keyword) {
  const cards = document.querySelectorAll(".product-card");
  const lowerKeyword = keyword.toLowerCase();
  let found = 0;

  cards.forEach(function (card) {
    const name = card.querySelector("h3");
    if (!name) return;

    const productName = name.textContent.toLowerCase();
    if (productName.includes(lowerKeyword)) {
      card.style.display = "";
      found++;
    } else {
      card.style.display = "none";
    }
  });

  const oldMsg = document.getElementById("search-empty-msg");
  if (oldMsg) oldMsg.remove();

  if (found === 0) {
    const container = document.querySelector(".products-grid") || document.querySelector(".product-container");
    if (container) {
      const msg = document.createElement("div");
      msg.id = "search-empty-msg";
      msg.style.cssText = "grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: #777;";
      msg.innerHTML = `
        <i class="fa-solid fa-magnifying-glass" style="font-size: 36px; margin-bottom: 12px; display: block; color: #ddd;"></i>
        <h3>Produk tidak ditemukan</h3>
        <p>Tidak ada produk yang cocok dengan "${keyword}"</p>
      `;
      container.appendChild(msg);
    }
  }
}

// Fungsi Toast Notification pembantu agar interaksi terasa hidup
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast success';
  toast.style.cssText = "background: #fff; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 10px; display: flex; align-items: center; gap: 8px; border-left: 4px solid #e86f8c; animation: slideIn 0.3s forwards;";
  toast.innerHTML = `<span>${message}</span>`;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s forwards";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function togglePassword(id, el) {
  const input = document.getElementById(id);
  const icon = el.querySelector('i');
  if (input.type === "password") {
    input.type = "text";
    icon.className = "fa-solid fa-eye-slash";
  } else {
    input.type = "password";
    icon.className = "fa-solid fa-eye";
  }
}

// Jalankan otomatis saat halaman di-load
document.addEventListener("DOMContentLoaded", () => {
  checkAuthStatus();
});
