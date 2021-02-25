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
    res.render("index", { data: "If you're seeing this. Momentum's back-end services are running!" });
});

io.on("connection", (socket) => {
    console.log("User connected: " + socket.id);
    socket.on("get", (info) => {
        try {
            let res = bike[info];
            io.emit("res", bike[info]);
        } catch (err) {
            io.emit("res", "error");
        }
    });

    socket.on("init", () => {
        io.emit("init", JSON.stringify(bike));
    });
});

bike.on("rpmChange", (rpm) => {
    io.emit("rpmChange", rpm);
});

bike.on("speedChange", (speed) => {
    io.emit("speedChange", speed);
});

bike.on("gearChange", (gear) => {
    io.emit("gearChange", gear);
});

bike.on("lightChange", (data) => {
    io.emit("lightChange", data);
});

bike.on("serialLightTest", (data) => {
    io.emit("serialLightTest", data);
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
