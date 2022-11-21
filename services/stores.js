
const Stores = require("../models/stores");

async function getMarkers(){
    const stores = await Stores.find({});
    return stores;
}
async function storesNames(){
    const stores = await Stores.find({}).select("name -_id");
    return stores;
}
module.exports = {getMarkers, storesNames}
