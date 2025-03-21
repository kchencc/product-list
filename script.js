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
    const spices = [];

    products.forEach(product => {
        if (product.name.includes("咖啡") || product.name.includes("茶") ||
            product.name.includes("可可粉") || product.name.includes("巧克力榛果研磨咖啡粉")) {
            coffeeTea.push(product);
        } else if (product.name.includes("巧克力") || product.name.includes("米餅") ||
            product.name.includes("餅乾") || product.name.includes("脆餅") || product.name.includes("糖")) {
            candySnacks.push(product);
        } else if (product.name.includes("面霜") || product.name.includes("化妝水") || product.name.includes("保養") || product.name.includes("護膚") || product.name.includes("身體")) {
            skincare.push(product);
        } else if (product.name.includes("香料")) {
            spices.push(product);
        } else {
            household.push(product);
        }
    });

    populateGrid("candySnacksGrid", candySnacks, view);
    populateGrid("coffeeTeaGrid", coffeeTea, view);
    populateGrid("skincareGrid", skincare, view);
    populateGrid("householdGrid", household, view);
    populateGrid("spicesGrid", spices, view);
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
                <p class="tax">稅率: $ ${product.tax}</p>
                <p class="sale-price">售價: NT$ ${product.salePrice}</p>
                <p class="price-diff"></p>
                <button onclick="addToCart('${product.name}', ${product.salePrice})">加入購物車</button>
            `;
        } else {
            item.innerHTML = `
                <img src="${product.image}" class="product-image" onclick="showImage('${product.image}')" alt="${product.name}">
                <p>${product.name}</p>
                <p class="sale-price">售價: NT$ ${product.salePrice}</p>
                <button onclick="addToCart('${product.name}', ${product.salePrice})">加入購物車</button>
            `;
        }
        item.dataset.tax = product.tax; // 將 tax 屬性存儲在 data-tax 屬性中
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
        const tax = parseFloat(card.dataset.tax); // 獲取 tax 屬性
        let twdPrice = Math.round(usdPrice * rate * tax); // 將台幣價格乘以 tax

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

// 購物車功能
let cart = [];

function addToCart(name, price) {
    cart.push({ name, price });
    alert(`${name} 已加入購物車`);
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = "";
    cart.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.innerHTML = `
            <p>${item.name} - NT$ ${item.price}</p>
            <button onclick="removeFromCart(${index})">移除</button>
        `;
        cartItems.appendChild(cartItem);
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function checkout() {
    // 這裡可以集成支付處理服務
    alert("結帳功能尚未實現");
}

function closeCart() {
    document.getElementById("cartModal").style.display = "none";
}

function closeImageModal() {
    document.getElementById("imageModal").style.display = "none";
}

// 打開購物車彈出視窗
function openCart() {
    document.getElementById("cartModal").style.display = "block";
    document.querySelector(".modal-overlay").style.display = "block"; // 確保背景顯示
}

// 關閉購物車彈出視窗
function closeCart() {
    document.getElementById("cartModal").style.display = "none";
    document.querySelector(".modal-overlay").style.display = "none";
}

// 確保點擊視窗外部時可以關閉
window.onclick = function (event) {
    let modal = document.getElementById("cartModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};