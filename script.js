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
            <p class="sale-price">售價: NT$ ${product.salePrice}</p>
        `;
        grid.appendChild(item);
    });
}

// 計算並顯示台幣價格（四捨五入）
function convertPrices() {
    const rate = parseFloat(document.getElementById("exchangeRate").value);
    document.querySelectorAll(".product-card").forEach(card => {
        const usdPrice = parseFloat(card.querySelector(".price").textContent.replace("美金: $", ""));
        let twdPrice = Math.round(usdPrice * rate);

        // 如果是 Costco 商品，台幣價格還需乘以 1.1 州稅
        if (card.parentElement.id === "costcoGrid") {
            twdPrice = Math.round(twdPrice * 1.1);
        }

        card.querySelector(".twd-price").textContent = `台幣: NT$ ${twdPrice}`;

        const salePrice = parseFloat(card.querySelector(".sale-price").textContent.replace("售價: NT$ ", ""));
        const priceDiff = Math.round(salePrice - twdPrice);
        card.querySelector(".price-diff").textContent = `差價: NT$ ${priceDiff}`;
    });
}

// 顯示大圖
function showImage(imageSrc) {
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    modal.style.display = "block";
    modalImage.src = imageSrc;
}
