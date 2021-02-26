var Gpio = require("onoff").Gpio;
const serialport = require("serialport");
const readline = require("@serialport/parser-readline");

const port = new serialport("/dev/ttyACM0", { baudRate: 19200 });
const parser = port.pipe(new readline({ delimiter: "\n" }));

module.exports = class Bike {
    constructor({ make, model, frontSproketTeeth, rearSproketTeeth, tireCirc, pulsesPerRevolution, redline } = {}) {
        this.make = make;
        this.model = model;
        this.frontSproketTeeth = frontSproketTeeth;
        this.rearSproketTeeth = rearSproketTeeth;
        this.tireCirc = tireCirc;
        this.pulsesPerRevolution = pulsesPerRevolution;
        this.redline = redline;
        this.active = true;

        this.diagnostics = {
            rpmTiming: 0,
        };

        this.rpm = 0;
        this.speed = 0;
        this.gear = 1;
        this.lights = [];

        this.neutralInput = new Gpio(4, "in", "both");
        this.highbeamInput = new Gpio(5, "in", "both");
        this.leftindicatorInput = new Gpio(6, "in", "both");
        this.rightindicatorInput = new Gpio(7, "in", "both");
    }

    on(type, callback) {
        if (type === "rpmChange") {
            this.rpmIO(callback);
        } else if (type === "speedChange") {
            this.speedIO(callback);
        } else if (type === "gearChange") {
            this.gearIO(callback);
        } else if (type === "lightChange") {
            this.lightIO(callback);
        } else if (type === "serialLightTest") {
            this.serialLightTest(callback);
        }
    }

    rpmIO(callback) {
        parser.on("data", (data) => {
            if (data.slice(0, 3) == "RPM") {
                callback(data.split(":")[1]);
            }
        });
    }

    speedIO(callback) {
        parser.on("data", (data) => {
            if (data.slice(0, 10) == "speedPulse") {
                console.log(data);
                var bikeSpeed = this.frontSproketTeeth / parseInt(data.split(":")[1]);
                bikeSpeed *= 200;
                bikeSpeed = bikeSpeed * (63360 / this.wheelCirc);
                bikeSpeed = 3600000 / bikeSpeed;
                callback(parseInt(bikeSpeed));
            }
        });
    }

    gearIO(callback) {
        var gear = 0;
        setInterval(() => {
            if (gear > 6) {
                gear--;
            } else {
                gear++;
            }

            callback(this.gear);
        }, 100);
    }

    lightIO(callback) {
        setInterval(() => {
            var lights = [];

            this.neutralInput.watch((err, value) => {
                if (value == 1) {
                    lights.push({ name: "neutral", enabled: true });
                } else {
                    lights.push({ name: "neutral", enabled: false });
                }
            });

            this.highbeamInput.watch((err, value) => {
                if (value == 1) {
                    lights.push({ name: "highbeam", enabled: true });
                } else {
                    lights.push({ name: "highbeam", enabled: false });
                }
            });

            this.leftindicatorInput.watch((err, value) => {
                if (value == 1) {
                    lights.push({ name: "blinkerLeft", enabled: true });
                } else {
                    lights.push({ name: "blinkerLeft", enabled: false });
                }
            });

            this.rightindicatorInput.watch((err, value) => {
                if (value == 1) {
                    lights.push({ name: "blinkerRight", enabled: true });
                } else {
                    lights.push({ name: "blinkerRight", enabled: false });
                }
            });

            callback(lights);
        }, 100);
    }
};
