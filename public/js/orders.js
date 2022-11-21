$( () => {
    fetchAndRenderOrders();
} );

function fetchAndRenderOrders() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8088/orders",
        success: function (orders) {
            if (orders.length == 0) {
                $("#ordersMsg").text("You don't have orders at the moment, it's time to start buying :)")
            } else {
                const ordersTable = $("#ordersTableBody").html("");
                for(let i=0; i < orders.length; i++) {
                    let orderRowTemplate = $("#ordersRowTemplate").html();
                    const currentOrder = orders[i];
                    const date = currentOrder["createdAt"].split("T");
                    orderRowTemplate = orderRowTemplate.replaceAll("{date}", date[0]);
                    for(const key in currentOrder) {
                        orderRowTemplate = orderRowTemplate.replaceAll(`{${key}}`, currentOrder[key]);
                    }
                    orderRowTemplate = orderRowTemplate.replaceAll("{i}", i+1);
                    ordersTable.append(orderRowTemplate);
            }
            }
        },
        error: function() {
            $("#ordersMsg").text("Failed getting your orders details, try again later.")
        }
        }
    )
}