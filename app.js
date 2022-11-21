require("dotenv").config();
const express = require('express'); // backend framework
const app = express(); // create instance of the server
const mongoose = require("mongoose"); // integration layer with mongoDB
const session = require('express-session');
const http = require('http')
const { Server } = require('socket.io')
const headerService = require("./services/header");

mongoose.connect(process.env.CONNECTION_STRING, {
    useUnifiedTopology: true, //check if needed
    useNewUrlParser: true //check if needed
});

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({ // connect express-session to express
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767", //!check secret num
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));


app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

app.use('/', require('./routes/homepage'));
app.use('/users', require('./routes/users'));
app.use('/products', require('./routes/products'));
app.use('/accounts', require('./routes/accounts'));
app.use('/contactDetails', require('./routes/contactDetails'));
app.use('/creditCards', require('./routes/creditCards'));
app.use('/shoppingBag', require('./routes/shoppingBag'));
app.use('/wishList', require('./routes/wishList'));
app.use('/orders', require('./routes/orders'));
app.use('/contactUs', require('./routes/contactUs'));
app.use('/adminPanel', require('./routes/adminPanel'));
app.use('/categories', require('./routes/categories'));
app.use('/twitter',require('./routes/twitter'));
app.use('/stores',require('./routes/stores'));
app.use('/aboutUs',require('./routes/aboutUs'));

// catch every http request that was not handled by the routers
// IMPORTANT: MUST BE LAST ROUTE
app.get('*', async (req, res) => {
    const allCategories = await headerService.getAllCategories();
    res.render("pageNotFound.ejs", { AllCategories: allCategories, isAdmin: false })
})

const server = http.createServer(app)
// const io = socketio(server, { cors: { origins: '*:*' } })
const io = new Server(server);


io.on('connection', (socket) => { 
    socket.on('purchase', () => {
        const message = 'Products in shopping bag have changed. Click OK to refresh the page'
        socket.broadcast.emit('purchase-message', message)
    })
    socket.on('updateOrDelete', () => {
        const message = "update or delete";
        socket.broadcast.emit('product-change', message);
    })
})
server.listen(process.env.PORT)
