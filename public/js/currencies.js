function checkCurrency() {
    const data = localStorage.getItem('currency')
    if (!data) {
        return
    }
    const { currency, rate } = JSON.parse(data)
    if (currency === 'ILS') {
        return
    }

    const currencySelect = document.getElementById('currency')
    if (currencySelect) {
        currencySelect.value = currency
    }

    const priceElements = document.querySelectorAll('.product-price')
    // dataset takes every html attribute that starts with "data-" and puts them
    // in dataset object 
    for (const priceElement of priceElements) {

        const priceInILS = parseFloat(priceElement.dataset.ils);
        priceElement.innerText = `${(priceInILS * rate).toFixed(2)} ${Currencies[currency]}`;
    }
}

checkCurrency()