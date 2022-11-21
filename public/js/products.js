$(() => {
    $("#search_bar_nav_item").removeClass('d-none');
    // we extract the category from the url, if the url is something like products/category/Pants
    const pathParts = window.location.pathname.split('/category/');
    // pathParts = ['products', 'Pants']
    let initialCategory;
    if (pathParts.length > 1) {
        //-1 is the last element in the array
        initialCategory = pathParts.at(-1)
    } else {
        initialCategory = ''
    }

    // initial values
    let page = 1;
    let lastChosenCategory = initialCategory;
    let lastChosenColor = 'all';
    let currentShownProducts;
    const itemsPerPage = 50;


    const nextButton = document.getElementById('next-page');
    nextButton.onclick = () => {
        page++
        getProducts()
    }

    const prevButton = document.getElementById('prev-page');
    prevButton.onclick = () => {
        page--
        getProducts()
    }

    function getProducts(shouldDraw = true) {
        try {

            $.ajax({
                url: `http://localhost:8088/products/query?category=${encodeURIComponent(lastChosenCategory)}`
                    + `&color=${encodeURIComponent(lastChosenColor)}&page=${page}`
            }).done((products) => {
                currentShownProducts = products;
                if (shouldDraw) {
                    drawProducts(products)
                }
                checkButtons(products.length)
            })
        } catch (err) {
            alert(err.message)
        }
    }

    getProducts(false);

    function checkButtons(numOfItems) {
        if (numOfItems >= itemsPerPage) {
            nextButton.style.display = 'unset';
        } else {
            nextButton.style.display = 'none';
        }

        if (page > 1) {
            prevButton.style.display = 'unset';
        } else {
            prevButton.style.display = 'none';
        }
    }


    function drawProducts(products) {
        const productGrid = document.querySelector('.products-grid')
        if (products.length === 0) {
            productGrid.innerHTML = 'Sorry! Did not find any products'
            return
        }

        productGrid.innerHTML = '';
        const productCardTemplate = document.getElementById('product-card').innerHTML;
        for (let index = 0; index < products.length; index++) {
            const product = products[index];
            let cardHtml = productCardTemplate
            for (const key in product) {
                cardHtml = cardHtml.replaceAll('{' + key + '}', product[key]);
            }

            if (product.isAvailable) {
                cardHtml = cardHtml.replaceAll('{productButton}', "add_to_bag_buttton")
                cardHtml = cardHtml.replaceAll('{productButtonText}', "Add to bag")
            } else {
                cardHtml = cardHtml.replaceAll('{productButton}', "")
                cardHtml = cardHtml.replaceAll('{productButtonText}', "SOLD OUT")
            }
            productGrid.innerHTML += cardHtml;
        }
    }

    function getCategoryProduct(event) {
        const categoryName = event.currentTarget.id;
        lastChosenCategory = categoryName
        getProducts()
    }

    const allProducts = document.querySelector('.products-grid').innerHTML
    async function searchProducts(event) {
        const searchValue = event.target.value;
        if (searchValue.length < 3) {
            document.querySelector('.products-grid').innerHTML = allProducts;
            return;
        }
        try {
            $.ajax({
                url: `http://localhost:8088/products/query?search=${encodeURIComponent(searchValue)}&page=${page}`
            }).done((products) => {
                currentShownProducts = products;
                drawProducts(products)
                checkButtons(products.length)
            })
        } catch (err) {
            alert(err.message)
        }
    }

    function searchByColor(event) {
        const color = event.currentTarget.value;
        lastChosenColor = color;
        getProducts()
    }

    function sortProducts(event) {
        const sortType = event.currentTarget.value;
        if (sortType === 'low') {
            currentShownProducts.sort((product1, product2) => {
                return product1.price - product2.price
            })
        } else {
            currentShownProducts.sort((product1, product2) => {
                return product2.price - product1.price
            })
        }
        drawProducts(currentShownProducts)
    }

    function updateCurrency(event) {
        const currency = event.currentTarget.value;
        $.ajax({
            url: `https://api.exchangerate-api.com/v4/latest/ILS`
        }).done((data => {
            const rate = data.rates[currency];
            const prices = document.querySelectorAll('.product-price')
            prices.forEach(element => {
                // dataset is data from data attributes (data-*)
                const ilsPrice = element.dataset.ils;
                localStorage.setItem('currency', JSON.stringify({ currency, rate }))

                //to fixed(2) - 2 digits after the deciemal point
                element.innerText = `${(ilsPrice * rate).toFixed(2)} ${Currencies[currency]}`;
            })
        }))
    }


    //when clicking a category 
    const categories = document.querySelectorAll('.list-group-item');
    categories.forEach(element => {
        element.onclick = getCategoryProduct;
    })

    //check- maybe onkeyup
    const searchInput = document.getElementById('search_input');
    searchInput.oninput = searchProducts;

    const colorSelect = document.getElementById('color');
    colorSelect.onchange = searchByColor;

    const sortingSelect = document.getElementById('sorting');
    sortingSelect.onchange = sortProducts;

    const currencySelect = document.getElementById('currency');
    currencySelect.onchange = updateCurrency;

    $(document).on("click", ".add_to_bag_buttton", function () {
        const productToAdd = $(this).attr("id");
        $.ajax({
            url: `http://localhost:8088/products/addToCart/${productToAdd}`,
        }).done(function (result) {

        });
    });
    $(document).on("click", ".add_to_wish_list_icon", function () {
        const productToAdd = $(this).attr("id");
        $.ajax({
            url: `http://localhost:8088/products/addToWishList/${productToAdd}`,
        }).done(function (result) {

        });
    });
});


checkCurrency()