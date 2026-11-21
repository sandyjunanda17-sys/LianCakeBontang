/* ==========================================================================
   Lian Cake Bakery — Interactive Catalog & WhatsApp Order Flow
   ========================================================================== */

const WHATSAPP_NUMBER = "6282254446773";

const CAKE_CATALOG = [
  {
    id: "pastel-rose-signature",
    name: "Pastel Rose Signature Cake",
    category: "birthday",
    categoryLabel: "Birthday & Custom",
    badge: "Best Seller",
    price: "Mulai Rp 225.000",
    defaultSize: "Medium (20cm)",
    image: "hero-cake.jpg",
    description:
      "Sponge cake lembut berlapis krim vanilla-strawberry dengan dekorasi buttercream pink pastel, macaron, dan stroberi segar.",
  },
  {
    id: "strawberry-velvet-shortcake",
    name: "Strawberry Velvet Shortcake",
    category: "birthday",
    categoryLabel: "Birthday & Custom",
    badge: "Favorit Pelanggan",
    price: "Mulai Rp 195.000",
    defaultSize: "Reguler (16cm)",
    image: "cake-strawberry.jpg",
    description:
      "Perpaduan sponge lembut, whipped cream ringan yang tidak bikin eneg, dan potongan buah stroberi segar.",
  },
  {
    id: "belgian-choco-truffle",
    name: "Belgian Choco Ganache Cake",
    category: "birthday",
    categoryLabel: "Birthday & Custom",
    badge: "Rich Chocolate",
    price: "Mulai Rp 215.000",
    defaultSize: "Medium (20cm)",
    image: "cake-chocolate.jpg",
    description:
      "Kue cokelat premium dengan siraman ganache cokelat mengilap, macaron, dan buah beri segar untuk pencinta cokelat.",
  },
  {
    id: "korean-ribbon-bento",
    name: "Korean Pastel Bento Cake",
    category: "bento",
    categoryLabel: "Korean Bento",
    badge: "Cute & Praktis",
    price: "Mulai Rp 85.000",
    defaultSize: "Mini / Bento (10cm)",
    image: "cake-bento.jpg",
    description:
      "Kue mini estetik dalam kotak bento lengkap dengan lilin & garpu kayu. Bisa request tulisan singkat dan warna pastel.",
  },
  {
    id: "strawberry-cream-roll",
    name: "Strawberry Cream Roll Cake",
    category: "roll",
    categoryLabel: "Bolu & Roll Cake",
    badge: "Fresh Daily",
    price: "Mulai Rp 95.000",
    defaultSize: "1 Box / Paket Standar",
    image: "cake-roll.jpg",
    description:
      "Bolu gulung super lembut dengan isian krim vanila-stroberi yang creamy dan manis pas, cocok untuk hantaran atau teman ngopi.",
  },
  {
    id: "blush-garden-tiered",
    name: "Blush Garden Two-Tier Cake",
    category: "tiered",
    categoryLabel: "Wedding & Tiered",
    badge: "Luxury Custom",
    price: "Mulai Rp 650.000",
    defaultSize: "2 Tingkat / Custom",
    image: "cake-tiered.jpg",
    description:
      "Kue 2 tingkat elegan bernuansa pink pastel dengan detail mutiara buttercream dan bunga segar untuk lamaran, nikahan, atau sweet 17th.",
  },
];

// DOM Elements
const catalogGrid = document.getElementById("catalogGrid");
const catalogEmpty = document.getElementById("catalogEmpty");
const filterTabs = document.querySelectorAll(".filter-tab");
const catalogSearch = document.getElementById("catalogSearch");

const siteHeader = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const mobileDrawer = document.getElementById("mobileDrawer");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

const orderModal = document.getElementById("orderModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const waOrderForm = document.getElementById("waOrderForm");
const orderCakeName = document.getElementById("orderCakeName");
const orderSize = document.getElementById("orderSize");
const orderBranch = document.getElementById("orderBranch");
const orderDate = document.getElementById("orderDate");
const orderCustomerName = document.getElementById("orderCustomerName");
const orderGreeting = document.getElementById("orderGreeting");

let activeCategory = "all";
let searchQuery = "";

/**
 * Render catalog cards based on active category & search query
 */
function renderCatalog() {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filtered = CAKE_CATALOG.filter((cake) => {
    const matchesCategory = activeCategory === "all" || cake.category === activeCategory;
    const matchesQuery =
      !normalizedQuery ||
      cake.name.toLowerCase().includes(normalizedQuery) ||
      cake.description.toLowerCase().includes(normalizedQuery) ||
      cake.categoryLabel.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });

  if (filtered.length === 0) {
    catalogGrid.innerHTML = "";
    catalogEmpty.hidden = false;
    return;
  }

  catalogEmpty.hidden = true;
  catalogGrid.innerHTML = filtered
    .map(
      (cake) => `
      <article class="cake-card">
        <div class="cake-media">
          <img src="${cake.image}" alt="${cake.name} - Lian Cake Bakery Bontang" loading="lazy" />
          <span class="cake-badge">${cake.badge}</span>
        </div>
        <div class="cake-body">
          <span class="cake-category">${cake.categoryLabel}</span>
          <h3 class="cake-title">${cake.name}</h3>
          <p class="cake-desc">${cake.description}</p>
          <div class="cake-meta">
            <span class="cake-price-label">Estimasi Harga</span>
            <span class="cake-price">${cake.price}</span>
          </div>
          <button
            type="button"
            class="btn btn-primary btn-full order-cake-btn"
            data-cake-name="${cake.name}"
            data-cake-size="${cake.defaultSize}"
          >
            Pesan via WhatsApp
          </button>
        </div>
      </article>
    `
    )
    .join("");
}

/**
 * Open the WhatsApp order modal with optional pre-filled values
 */
function openOrderModal({
  cakeName = "Custom Cake (Sesuai Referensi)",
  size = "Medium (20cm)",
  branch = "",
} = {}) {
  orderCakeName.value = cakeName;

  // Match size option if available
  const hasSizeOption = Array.from(orderSize.options).some((opt) => opt.value === size);
  if (hasSizeOption) {
    orderSize.value = size;
  }

  // Match branch option if provided
  if (branch) {
    const hasBranchOption = Array.from(orderBranch.options).some((opt) => opt.value === branch);
    if (hasBranchOption) {
      orderBranch.value = branch;
    }
  }

  // Set default minimum date to today
  if (!orderDate.value) {
    const today = new Date().toISOString().split("T")[0];
    orderDate.min = today;
  }

  orderModal.hidden = false;
  document.body.style.overflow = "hidden";
  orderCustomerName.focus();
}

function closeOrderModal() {
  orderModal.hidden = true;
  document.body.style.overflow = "";
}

/**
 * Build WhatsApp URL and open in a new tab
 */
function submitOrderToWhatsApp(event) {
  event.preventDefault();

  const cake = orderCakeName.value.trim();
  const size = orderSize.value;
  const branch = orderBranch.value;
  const date = orderDate.value ? orderDate.value : "Belum ditentukan";
  const customer = orderCustomerName.value.trim();
  const notes = orderGreeting.value.trim() || "-";

  const message = [
    "Halo *Lian Cake Bakery* (@liandewia) 🎀",
    "Saya ingin memesan kue dengan detail berikut:",
    "",
    `• *Nama Pemesan:* ${customer}`,
    `• *Pilihan Kue:* ${cake}`,
    `• *Ukuran/Varian:* ${size}`,
    `• *Cabang/Pengiriman:* ${branch}`,
    `• *Tanggal Acara/Ambil:* ${date}`,
    `• *Ucapan & Catatan:* ${notes}`,
    "",
    "Mohon info ketersediaan dan total biayanya ya, Kak. Terima kasih! 🎂",
  ].join("\n");

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank", "noopener,noreferrer");
  closeOrderModal();
}

/* Event Listeners */

// Category Tabs
filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    filterTabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    activeCategory = tab.dataset.category;
    renderCatalog();
  });
});

// Search Input
catalogSearch.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderCatalog();
});

// Delegated click for dynamically rendered catalog buttons
catalogGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".order-cake-btn");
  if (!btn) return;
  openOrderModal({
    cakeName: btn.dataset.cakeName,
    size: btn.dataset.cakeSize,
  });
});

// Branch quick-order buttons
document.querySelectorAll(".branch-wa-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    openOrderModal({
      cakeName: "Konsultasi / Pesan Kue",
      branch: btn.dataset.branch,
    });
  });
});

// Various CTA buttons opening the modal
[
  "headerOrderBtn",
  "mobileOrderBtn",
  "heroCustomOrderBtn",
  "bannerCustomBtn",
  "emptyCustomBtn",
  "floatingWaBtn",
].forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("click", () => {
      if (mobileDrawer && !mobileDrawer.hidden) {
        mobileDrawer.hidden = true;
        menuToggle.setAttribute("aria-expanded", "false");
      }
      openOrderModal();
    });
  }
});

// Modal controls
modalCloseBtn.addEventListener("click", closeOrderModal);
orderModal.addEventListener("click", (e) => {
  if (e.target === orderModal) {
    closeOrderModal();
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !orderModal.hidden) {
    closeOrderModal();
  }
});
waOrderForm.addEventListener("submit", submitOrderToWhatsApp);

// Mobile Drawer Toggle
menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  mobileDrawer.hidden = isExpanded;
});

mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileDrawer.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Sticky header shadow on scroll
window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY > 12) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  },
  { passive: true }
);

// Footer year
const yearEl = document.getElementById("currentYear");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Initial Render
renderCatalog();
