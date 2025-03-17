document.addEventListener("DOMContentLoaded", function() {
    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            populateTable("traderJoesTable", data.traderJoes);
            populateTable("costcoTable", data.costco);
        });
});

function populateTable(tableId, products) {
    const table = document.getElementById(tableId);
    table.innerHTML = "";
    products.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td class="twd-price"></td>
        `;
        table.appendChild(row);
    });
    convertPrices(); // 預設顯示台幣價格
}

function convertPrices() {
    const rate = parseFloat(document.getElementById("exchangeRate").value);
    document.querySelectorAll(".twd-price").forEach((td, index) => {
        const usdPrice = parseFloat(td.previousElementSibling.textContent);
        td.textContent = `NT$ ${(usdPrice * rate).toFixed(2)}`;
    });
}
