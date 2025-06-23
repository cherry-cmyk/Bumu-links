
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");
  const productList = document.getElementById("productList");
  let products = [];

  const SHEET_URL = "https://script.google.com/macros/s/AKfycbwURAKgF5Lb0iRsK_jnxWKaSwCkVqfvLVxdOtKnPlGdBRiMf2_B-UhKQh_4HZKBxxeM/exec";

  async function fetchProducts() {
    try {
      const res = await fetch(SHEET_URL);
      const data = await res.json();
      products = data;
      render();
    } catch (err) {
      alert("Failed to load products from cloud.");
    }
  }

  function render() {
    productList.innerHTML = "";
    products.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        ${p.image ? `<img src="${p.image}" alt="">` : ""}
        <h3>${p.name || "Product"}</h3>
        <a href="${p.link}" target="_blank">Buy Now</a>
      `;
      productList.appendChild(card);
    });
  }

  async function saveProduct(product) {
    try {
      await fetch(SHEET_URL, {
        method: "POST",
        body: JSON.stringify(product),
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      alert("Failed to save product to cloud.");
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const product = {
      name: form.productName.value || "Product",
      price: "", // not needed
      link: form.productLink.value,
      image: form.productImage.value || "",
      category: "redirect"
    };
    products.push(product);
    render();
    await saveProduct(product);
    form.reset();
  });

  fetchProducts();
});
