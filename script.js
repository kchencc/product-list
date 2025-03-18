document.addEventListener("DOMContentLoaded", function () {
    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            populateGrid("traderJoesGrid", data.traderJoes);
            populateGrid("costcoGrid", data.costco);
        });

    // 點擊模態框關閉
    document.getElementById("imageModal").addEventListener("click", function () {
        this.style.display = "none";
    });
});

// 填充商品網格
function populateGrid(gridId, products) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = "";
    products.forEach(product => {
        const item = document.createElement("div");
        item.classList.add("product-card");
        item.innerHTML = `
            <img src="${product.image}" class="product-image" onclick="showImage('${product.image}')" alt="${product.name}">
            <p>${product.name}</p>
            <p class="price">美金: $${product.price.toFixed(2)}</p>
            <p class="twd-price"></p>
            <p class="sale-price">售價: NT$ ${product.salePrice}</p>
        `;
        grid.appendChild(item);
    });
    convertPrices(); // 預設顯示台幣價格
}

// 計算並顯示台幣價格（四捨五入）
function convertPrices() {
    const rate = parseFloat(document.getElementById("exchangeRate").value);
    document.querySelectorAll(".twd-price").forEach(td => {
        const usdPrice = parseFloat(td.previousElementSibling.textContent.replace("美金: $", ""));
        td.textContent = `台幣: NT$ ${Math.round(usdPrice * rate)}`; // 四捨五入
    });
}

// 顯示大圖
function showImage(imageSrc) {
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    modal.style.display = "block";
    modalImage.src = imageSrc;
}
