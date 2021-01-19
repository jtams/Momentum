const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
// var Gpio = require("onoff").Gpio;
const Bike = require("./src/bike.js");
const bikeData = require("./bike.json");

const bike = new Bike(bikeData);

port = 8080;

app.use("/", express.static(path.resolve("./src")));
app.use("/css", express.static(path.resolve("./views/css")));
app.use("/js", express.static(path.resolve("./views/js")));
app.use(cors());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index", { data: "This text was loaded server side and updated. Momentum is working." });
});

io.on("connection", (socket) => {
    console.log("User connected: " + socket.id);
    // bike.on("rpmChange", (rpm) => {
    //     io.emit("rpmChange", rpm);
    // });
});

server.listen(port, () => {
    console.log(`Server hosted on ${port}`);
});

// var LED = new Gpio(4, "out");
// function toggleLED() {
//     if (LED.readSync() === 0) {
//         LED.writeSync(1);
//     } else {
//         LED.writeSync(0);
//     }
//     // LED.unexport();
// }
