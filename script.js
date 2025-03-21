document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view') || 'customer'; // 默認為客戶視圖

    if (view === 'seller') {
        document.getElementById("sellerControls").style.display = "block";
    }

    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            categorizeAndPopulateGrid(data.traderJoes, view);
            populateGrid("costcoGrid", data.costco, view);
        });

    // 點擊模態框關閉
    document.getElementById("imageModal").addEventListener("click", function () {
        this.style.display = "none";
    });
});

// 根據商品名稱進行分類並填充商品網格
function categorizeAndPopulateGrid(products, view) {
    const candySnacks = [];
    const coffeeTea = [];
    const skincare = [];
    const household = [];

    products.forEach(product => {
        if (product.name.includes("巧克力") || product.name.includes("餅乾") || product.name.includes("糖")) {
            candySnacks.push(product);
        } else if (product.name.includes("咖啡") || product.name.includes("茶")) {
            coffeeTea.push(product);
        } else if (product.name.includes("保養") || product.name.includes("護膚") || product.name.includes("身體")) {
            skincare.push(product);
        } else {
            household.push(product);
        }
    });

    populateGrid("candySnacksGrid", candySnacks, view);
    populateGrid("coffeeTeaGrid", coffeeTea, view);
    populateGrid("skincareGrid", skincare, view);
    populateGrid("householdGrid", household, view);
}

// 填充商品網格
function populateGrid(gridId, products, view) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = "";
    products.forEach(product => {
        const item = document.createElement("div");
        item.classList.add("product-card");
        if (view === 'seller') {
            item.innerHTML = `
                <img src="${product.image}" class="product-image" onclick="showImage('${product.image}')" alt="${product.name}">
                <p>${product.name}</p>
                <p class="price">美金: $${product.price.toFixed(2)}</p>
                <p class="twd-price"></p>
                <p class="sale-price">售價: NT$ ${product.salePrice}</p>
                <p class="price-diff"></p>
            `;
        } else {
            item.innerHTML = `
                <img src="${product.image}" class="product-image" onclick="showImage('${product.image}')" alt="${product.name}">
                <p>${product.name}</p>
                <p class="sale-price">售價: NT$ ${product.salePrice}</p>
            `;
        }
        grid.appendChild(item);
    });
    if (view === 'seller') {
        convertPrices(); // 預設顯示台幣價格
    }
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