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

    // 讓購物車可以拖曳
    makeCartDraggable();
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
                <p class="tax">稅: $ ${product.tax}</p>
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

// 更新購物車顯示（每個相同商品獨立顯示）
function updateCart() {
    const cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = "";
    let totalAmount = 0;

    // 依照商品名稱排序購物車
    const sortedCart = cart.slice().sort((a, b) => a.name.localeCompare(b.name));

    sortedCart.forEach((item, index) => {
        totalAmount += item.price * item.quantity;
        const cartItem = document.createElement("div");
        cartItem.innerHTML = `<p>${item.name} x${item.quantity} - NT$ ${item.price * item.quantity}
                              <button onclick="updateQuantity(${index}, -1)">-</button>
                              <button onclick="updateQuantity(${index}, 1)">+</button>
                              <button class="remove-btn" onclick="removeFromCart(${index})">X</button></p>`;
        cartItems.appendChild(cartItem);
    });

    document.getElementById("totalAmount").textContent = `總金額: NT$ ${totalAmount}`;
    openCart();
}

// 加入購物車（維持數量，但顯示時逐筆列出）
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCart();
}

// 更新商品數量
function updateQuantity(index, change) {
    const item = cart[index];
    item.quantity += change;
    if (item.quantity <= 0) {
        cart.splice(index, 1); // 移除數量為零的商品
    }
    updateCart();
}

// 移除單筆商品
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// 複製購物車清單（依商品名稱排序，逐筆顯示）
function copyCart() {
    let cartText = "";

    // 依 name 排序
    const sortedCart = [...cart].sort((a, b) => a.name.localeCompare(b.name));

    // 逐筆展開顯示
    sortedCart.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
            cartText += `${item.name} - NT$ ${item.price}\n`;
        }
    });

    cartText += ` ${document.getElementById("totalAmount").textContent}`;

    navigator.clipboard.writeText(cartText).then(() => {
        alert("購物車清單已複製，請再貼到Line筆記本中提醒我，謝謝。");
    });
}

// 讓購物車可拖曳
function makeCartDraggable() {
    const cartModal = document.getElementById("cartModal");
    cartModal.style.position = "absolute";
    cartModal.style.top = "10px";
    cartModal.style.right = "10px";

    let offsetX, offsetY, isDragging = false;

    cartModal.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - cartModal.offsetLeft;
        offsetY = e.clientY - cartModal.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            cartModal.style.left = e.clientX - offsetX + "px";
            cartModal.style.top = e.clientY - offsetY + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    // 監聽捲動事件，更新購物車位置
    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        cartModal.style.top = (10 + scrollTop) + "px";
    });
}

// 開啟購物車
function openCart() {
    document.getElementById("cartModal").style.display = "block";
}

// 關閉購物車
function closeCart() {
    document.getElementById("cartModal").style.display = "none";
}

function closeImageModal() {
    document.getElementById("imageModal").style.display = "none";
}

function returnToIndex() {
    window.location.href = "index.html";
}