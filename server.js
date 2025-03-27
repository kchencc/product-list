const fetch = require('node-fetch');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = '7544558697:AAElaE-lwz4V0zSRAva3H9qMLb40mgiTO8s';
const TELEGRAM_CHAT_ID = '7769065195'; // 例如：123456789 或 -987654321

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const order = req.body;
    const message = `新訂單:\n商品名稱: ${order.name}\n價格: NT$ ${order.price}`;

    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Message sent:', data);
            res.status(200).send('Order received');
        })
        .catch(error => {
            console.error('Error sending message:', error);
            res.status(500).send('Error sending message');
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});