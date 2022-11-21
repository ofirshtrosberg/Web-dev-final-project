const User = require("../models/users");

async function addUser(username, password, role) {

    const user = new User({
        username: username,
        password: password, 
        role: role
    });
    await user.save();  
    return user;      
}

async function getUserByUsernameAndPassword(username, password) {
    const filter = {username: username, password: password};
    const user = await User.findOne(filter).exec();
    return user;
}

async function getUsers() {
    const users = await User.find();
    return users;
}

async function getUser(filter) {
    const user = await User.findOne(filter).exec();
    return user;
}

async function updateUser(id, username, password, role) {
    const update = {
        username: username,
        password: password, 
        role: role
    }
    Object.keys(update).forEach(key => update[key] === undefined ? delete update[key] : {});

    await User.findByIdAndUpdate(id, update);
}

async function deleteUser(id) {
    await User.deleteOne({_id: id});
}

async function updateRoleById(userId, updateObj) {
    await User.updateMany({_id: userId}, {$set: updateObj});
}


module.exports = { addUser, getUsers, getUser, updateUser, getUserByUsernameAndPassword, deleteUser, updateRoleById }
