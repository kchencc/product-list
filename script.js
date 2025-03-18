document.addEventListener("DOMContentLoaded", function () {
    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            populateTable("traderJoesTable", data.traderJoes);
            populateTable("costcoTable", data.costco);
        });

    // 設定圖片點擊事件，開啟模態框
    document.getElementById("imageModal").addEventListener("click", function () {
        this.style.display = "none";
    });
});

// 填充表格
function populateTable(tableId, products) {
    const table = document.getElementById(tableId);
    table.innerHTML = "";
    products.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${product.image}" class="product-image" onclick="showImage('${product.image}')" alt="${product.name}"></td>
            <td>${product.name}</td>
            <td>${product.price.toFixed(2)}</td>
            <td class="twd-price"></td>
        `;
        table.appendChild(row);
    });
    convertPrices(); // 預設顯示台幣價格
}

// 顯示台幣價格
function convertPrices() {
    const rate = parseFloat(document.getElementById("exchangeRate").value);
    document.querySelectorAll(".twd-price").forEach(td => {
        const usdPrice = parseFloat(td.previousElementSibling.textContent);
        td.textContent = `NT$ ${(usdPrice * rate).toFixed(2)}`;
    });
}

// 顯示大圖
function showImage(imageSrc) {
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    modal.style.display = "block";
    modalImage.src = imageSrc;
}
