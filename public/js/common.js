const Urls = {
    PRODUCTS: '/products',
    HOME: '/',
}

const redirectTo = path => {
    window.location = path
}


const Currencies = {
    USD: '$',
    EUR: '€',
    ILS: '₪'
}
const socket = io('http://localhost:8088');

socket.on('purchase-message', (message) => {
    if (window.location.pathname.includes('shoppingBag')) {
        window.location.reload();    
    }

    if (window.location.pathname.includes('/orders/graphs')) {
        window.location.reload()
    }
})

//refresh all pages
socket.on('product-change', (message) => {
    if (window.location.pathname.includes('shoppingBag')) {
        window.location.reload();
    }
    if (window.location.pathname.includes('products')) {
        window.location.reload();
    }
})

function emitDeleteOrUpdate(){
    socket.emit("updateOrDelete");
}
function emitPurchse(){
    socket.emit("purchase");
}