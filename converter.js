const axios = require('./node_modules/axios');

const getExchangeRate = async (fromCurrency, toCurrency) => {
    try {
    const response = await axios.get(`http://www.apilayer.net/api/live?access_key=1c0fd882f58fc2f80a69c16e5f05cd0f&currencies=${fromCurrency},${toCurrency}&format=1`);
    const rate = response.data.quotes;
    const euro = 1 / rate[fromCurrency];
    const exchangeRates = euro * rate[toCurrency];

    return exchangeRates;
    } catch (error) {
        throw new Error (`Unable to get currency ${fromCurrency} and ${toCurrency}`);
    }
};

const getCountries = async (toCurrency) => {
    try {
    const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${toCurrency}`);
    return response.data.map(country => country.name);
    } catch (error) {
        throw new Error(`Unable to get countries that use ${toCurrency}`);
    }
};

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
    const countries = await getCountries(toCurrency);
    const convertedAmount = (amount * exchangeRate).toFixed(4);

    return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can spend these in the following countries: ${countries}`;
}

convertCurrency('USD', 'AUD', 20)
    .then((message) => {
        console.log(message);
    }).catch((error) => {
        console.log(error.message);
});