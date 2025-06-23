document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");
  const productList = document.getElementById("productList");
  const searchInput = document.getElementById("searchInput");
  let products = [];

  const SHEET_URL = "https://script.google.com/macros/s/AKfycbwURAKgF5Lb0iRsK_jnxWKaSwCkVqfvLVxdOtKnPlGdBRiMf2_B-UhKQh_4HZKBxxeM/exec";

  async function fetchProducts() {
    try {
      const res = await fetch(SHEET_URL);
      const data = await res.json();
      products = data;
      render();
    } catch {
      alert("Failed to load products.");
    }
  }

  function render() {
    const query = searchInput.value.toLowerCase();
    productList.innerHTML = "";

    products.forEach((p, i) => {
      if (p.name.toLowerCase().includes(query)) {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
          <img src="${p.image || 'https://via.placeholder.com/200x150'}" alt="Image">
          <h3>${p.name}</h3>
          ${p.price ? `<p>₹${p.price}</p>` : ""}
          <a href="${p.link}" target="_blank">Buy Now</a><br>
          <button class="delete-btn" onclick="deleteProduct(${i})">Delete</button>
        `;
        productList.appendChild(card);
      }
    });
  }

  window.deleteProduct = function(index) {
    if (confirm("Are you sure you want to delete this product?")) {
      products.splice(index, 1);
      render();
    }
  };

  async function saveProduct(product) {
    try {
      await fetch(SHEET_URL, {
        method: "POST",
        body: JSON.stringify(product),
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      alert("Failed to save to cloud.");
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const product = {
      name: form.productName.value,
      price: form.productPrice.value,
      link: form.productLink.value,
      image: form.productImage.value,
      category: "redirect"
    };
    products.push(product);
    render();
    await saveProduct(product);
    form.reset();
  });

  searchInput.addEventListener("input", render);

  // 🔗 Open full URL if typed in search bar
  searchInput.addEventListener("keydown", (e) => {
    const val = searchInput.value.trim();
    if (e.key === "Enter" && (val.startsWith("http://") || val.startsWith("https://"))) {
      window.open(val, "_blank");
      searchInput.value = "";
      e.preventDefault();
    }
  });

  fetchProducts();
});

