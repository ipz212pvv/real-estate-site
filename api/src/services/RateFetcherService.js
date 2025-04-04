const axios = require('axios');

const getUsdToUahRate = async () => {
    try {
        const response = await axios.get('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
        return response.data.find(currency => currency.cc === 'USD');
    } catch (error) {
        throw new Error('Не вдалося отримати курс валют');
    }
};

const calculatePrice = (price, rate) => {
    return Math.round(price * rate * 100) / 100;
};

module.exports = { getUsdToUahRate,calculatePrice };

