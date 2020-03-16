const express = require("express");
const app = express();
var path = require('path');
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

users = [];

server.listen(3220);
console.log("server running");
app.use('/web', express.static(path.join(__dirname, 'web')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/web/index.html");''
});

io.sockets.on('connection', (socket) => {
    users.push(socket);
    console.log(`user connected`);
    io.sockets.emit("init", "current");

    socket.on('getOdometer', (data) => {
        console.log(`sending ${data} odometer mileage`);    
        io.sockets.emit("returnOdometer", {miles: getOdometer()});

    });

    socket.on('getTemp', (data) => {
        console.log(`sending ${data} temperature`);    
        io.sockets.emit("returnTemp", {temp: getTemp()});

    });
});


// ################################## BIKE GPIO ########################################

bike = {
    odometer: 20203,
    temp: 105,
}

function getOdometer() {
    return bike.odometer;
}

function getTemp() {
    return bike.temp;
}