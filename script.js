function convertPrices() {
    const rate = parseFloat(document.getElementById('exchangeRate').value);
    const traderJoesTable = document.getElementById('traderJoesTable');
    const costcoTable = document.getElementById('costcoTable');

    // 假設這裡有一個函數來獲取商品列表
    const traderJoesProducts = getTraderJoesProducts();
    const costcoProducts = getCostcoProducts();

    traderJoesTable.innerHTML = '';
    costcoTable.innerHTML = '';

    traderJoesProducts.forEach(product => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const usdPriceCell = document.createElement('td');
        const twdPriceCell = document.createElement('td');

        nameCell.textContent = product.name;
        usdPriceCell.textContent = product.usdPrice;
        twdPriceCell.textContent = (product.usdPrice * rate + 200).toFixed(2);

        row.appendChild(nameCell);
        row.appendChild(usdPriceCell);
        row.appendChild(twdPriceCell);
        traderJoesTable.appendChild(row);
    });

    costcoProducts.forEach(product => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const usdPriceCell = document.createElement('td');
        const twdPriceCell = document.createElement('td');

        nameCell.textContent = product.name;
        usdPriceCell.textContent = product.usdPrice;
        twdPriceCell.textContent = (product.usdPrice * rate + 200).toFixed(2);

        row.appendChild(nameCell);
        row.appendChild(usdPriceCell);
        row.appendChild(twdPriceCell);
        costcoTable.appendChild(row);
    });
}