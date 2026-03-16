const fetch = require('node-fetch');

const SHOP_ID = '224106';
const API_KEY = '5609391|E765k035ixfExlmzIizoIECeMmjy7OwXxhhiDkBq133e936a';

async function listProducts() {
    try {
        const response = await fetch(`https://api.sellauth.com/v1/shops/${SHOP_ID}/products`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

listProducts();
