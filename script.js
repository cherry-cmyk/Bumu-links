
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");
  const productList = document.getElementById("productList");
  const searchInput = document.getElementById("searchInput");
  const categorySelect = document.getElementById("productCategory");
  const filterCategory = document.getElementById("filterCategory");

  let products = JSON.parse(localStorage.getItem("products") || "[]");

  function render() {
    const query = searchInput.value.toLowerCase();
    const filter = filterCategory.value;
    productList.innerHTML = "";

    products.forEach((p, i) => {
      const matchSearch = p.name.toLowerCase().includes(query);
      const matchCategory = (filter === "All" || p.category === filter);
      if (matchSearch && matchCategory) {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = \`
          <img src="\${p.image}" alt="">
          <h3>\${p.name}</h3>
          <p>₹\${p.price}</p>
          <a href="\${p.link}" target="_blank">Buy Now</a><br>
          <button onclick="deleteProduct(\${i})">🗑️ Delete</button>
        \`;
        productList.appendChild(card);
      }
    });
  }

  window.deleteProduct = function(index) {
    if (confirm("Are you sure you want to delete this product?")) {
      products.splice(index, 1);
      localStorage.setItem("products", JSON.stringify(products));
      render();
    }
  };

  form.addEventListener("submit", e => {
    e.preventDefault();
    const product = {
      name: form.productName.value,
      price: form.productPrice.value,
      link: form.productLink.value,
      image: form.productImage.value,
      category: form.productCategory.value
    };
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
    render();
    form.reset();
  });

  searchInput.addEventListener("input", render);
  filterCategory.addEventListener("change", render);

  render();
});
