
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");
  const productList = document.getElementById("productList");
  const searchInput = document.getElementById("searchInput");
  const filterCategory = document.getElementById("filterCategory");
  let products = [];

  const SHEET_URL = "https://script.google.com/macros/s/AKfycbwURAKgF5Lb0iRsK_jnxWKaSwCkVqfvLVxdOtKnPlGdBRiMf2_B-UhKQh_4HZKBxxeM/exec";

  function render() {
    const query = searchInput.value.toLowerCase();
    const filter = filterCategory.value;
    productList.innerHTML = "";

    products.forEach((p, i) => {
      const matchSearch = p.name.toLowerCase().includes(query);
      const matchCategory = filter === "All" || p.category === filter;
      if (matchSearch && matchCategory) {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
          <img src="${p.image}" alt="">
          <h3>${p.name}</h3>
          <p>₹${p.price}</p>
          <a href="${p.link}" target="_blank">Buy Now</a><br>
          <button onclick="deleteProduct(${i})">🗑️ Delete</button>
        `;
        productList.appendChild(card);
      }
    });
  }

  window.deleteProduct = function(index) {
    if (confirm("Delete this product?")) {
      products.splice(index, 1);
      render();
    }
  };

  async function fetchProducts() {
    try {
      const res = await fetch(SHEET_URL);
      const data = await res.json();
      products = data;
      render();
    } catch (err) {
      alert("Failed to load from cloud.");
    }
  }

  async function saveProduct(product) {
    try {
      await fetch(SHEET_URL, {
        method: "POST",
        body: JSON.stringify(product),
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
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
      category: form.productCategory.value,
    };
    products.push(product);
    render();
    await saveProduct(product);
    form.reset();
  });

  searchInput.addEventListener("input", render);
  filterCategory.addEventListener("change", render);

  fetchProducts();
});
