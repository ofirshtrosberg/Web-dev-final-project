
var socket = io();// uses the script of socket.io library 
socket.onopen = function (){
    socket.send('The client is available to recieve advertisemants');
}
socket.onerror = function (error){ 
    console.log ('connection error' + error);
}
