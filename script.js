
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");
  const productList = document.getElementById("productList");
  const products = JSON.parse(localStorage.getItem("products") || "[]");

  function render() {
    productList.innerHTML = "";
    products.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = \`
        <img src="\${p.image}" alt="">
        <h3>\${p.name}</h3>
        <p>₹\${p.price}</p>
        <a href="\${p.link}" target="_blank">Buy Now</a>
      \`;
      productList.appendChild(card);
    });
  }

  render();

  form.addEventListener("submit", e => {
    e.preventDefault();
    const product = {
      name: form.productName.value,
      price: form.productPrice.value,
      link: form.productLink.value,
      image: form.productImage.value
    };
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
    render();
    form.reset();
  });
});
