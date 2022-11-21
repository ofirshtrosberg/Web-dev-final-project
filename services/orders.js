const Order = require("../models/orders");
async function createOrder(userId, products, totalPrice, cardId, contactDetails) {
    const order = new Order({
        userid: userId, 
        products: products,
        totalPrice: totalPrice,
        cardId: cardId,
        contactDetails: contactDetails,
    });
    await order.save();
    return order;
}
async function getAllOrders(){
    const allOrders = await Order.find();
    return allOrders;
}

async function getOrdersTotalPriceByMonthAndYear(){
    const ordersPrices = await Order.aggregate(
         [ 
          {
            $group :
              {
                _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                ordersPriceForMonth: { $sum: "$totalPrice"}
              }
           },
        ]
       )
       return ordersPrices;
}
async function getOrdersTotalPriceByYear(){
    const ordersPrices = await Order.aggregate(
        [ 
         {
           $group :
             {
               _id: { year: { $year: "$createdAt" } },
               ordersPriceForYear: { $sum: "$totalPrice"}
             }
          },
       ]
      )
      return ordersPrices;
}

async function getAllOrdersForUser(userId) {
  const orders = await Order.find({userId: userId});
  return orders;
}

async function getOrderById(orderId) {
  return await Order.findById(orderId);
}

module.exports = {createOrder, getAllOrders,getOrdersTotalPriceByMonthAndYear,getOrdersTotalPriceByYear, getAllOrdersForUser, getOrderById };