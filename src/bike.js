// var Gpio = require("onoff").Gpio;

module.exports = class Bike {
    constructor({ make, model, frontSproketTeeth, rearSproketTeeth, tireDiameter, pulsesPerRevolution, redline } = {}) {
        this.make = make;
        this.model = model;
        this.frontSproketTeeth = frontSproketTeeth;
        this.rearSproketTeeth = rearSproketTeeth;
        this.tireDiameter = tireDiameter;
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
        }
    }

    rpmIO(callback) {
        // THIS IS WHERE THE CODE FOR RPM GOES
        // var rpmPin = new Gpio(8, "in");
        // var step = 0;
        // while (this.active) {
        //     let rpmTiming = Date.now();
        //     if (rpmPin.readSync() === 1 && step == 0) {
        //         var timer = Date.now();
        //         step = 1;
        //     }
        //     if (rpmPin.readSync() === 0 && step == 1) {
        //         step = 2;
        //     }
        //     if (rpmPin.readSync() === 0 && step == 2) {
        //         // RPM is calculated based on a full rotation. On most bikes it can be 2 times as accurate but it wouldn't be noticible.
        //         let rpm = (Date.now() - timer) * this.pulsesPerRevolution; //Miliseconds it took for one revolution
        //         rpm = 3600000 / rpm; // Hour divided by the miliseconds it took for one revolution. The revolutions per hour.
        //         this.rpm = rpm;
        //         callback(rpm);
        //         step = 0;
        //     }
        //     this.diagnostics.rpmTiming = Date.now() - rpmTiming; //Updates to frequency of RPM calculations.
        // }
        var rpm = 1000;
        setInterval(() => {
            rpm += 160 / this.gear;
            if (rpm >= 9900) {
                rpm = 7000;
                if (this.gear == 6) {
                    rpm = 1000;
                    this.gear = 1;
                    this.speed = 0;
                } else {
                    this.gear++;
                }
            }
            callback(rpm);
        }, 20);
    }

    speedIO(callback) {
        //THIS IS WHERE THE CODE FOR SPEED GOES
        setInterval(() => {
            this.speed += Math.round(3 / this.gear);
            callback(this.speed);
        }, 200);
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
        //Lights = Blinker left, blinker right, fuel, etc...
        var enabled = true;
        setInterval(() => {
            enabled = !enabled;
            callback([
                { name: "blinkerLeft", enabled: enabled },
                { name: "blinkerRight", enabled: enabled },
                { name: "neutral", enabled: enabled },
                { name: "temp-warning", enabled: enabled },
                { name: "engine", enabled: enabled },
                { name: "oil", enabled: enabled },
                { name: "fuel", enabled: enabled },
            ]);
        }, 600);
    }
};
