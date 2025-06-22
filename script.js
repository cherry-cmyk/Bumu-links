
// Load products from localStorage
function loadProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const productList = document.getElementById("product-list");
  if (productList) {
    productList.innerHTML = "";
    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.price}</p>
        <a href="${product.link}" target="_blank">Buy Now</a>
      `;
      productList.appendChild(card);
    });
  }
}

// Add product on admin page
const form = document.getElementById("product-form");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const newProduct = {
      name: document.getElementById("name").value,
      price: document.getElementById("price").value,
      link: document.getElementById("link").value,
      image: document.getElementById("image").value
    };
    const products = JSON.parse(localStorage.getItem("products")) || [];
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    alert("✅ Product added!");
    form.reset();
  });
}

loadProducts(); // call on both pages
