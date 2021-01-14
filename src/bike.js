var Gpio = require("onoff").Gpio;

module.exports = class Bike {
    constructor({ make, model, frontSproketTeeth, rearSproketTeeth, tireDiameter, pulsesPerRevolution } = {}) {
        this.make = make;
        this.model = model;
        this.frontSproketTeeth = frontSproketTeeth;
        this.rearSproketTeeth = rearSproketTeeth;
        this.tireDiameter = tireDiameter;
        this.pulsesPerRevolution = pulsesPerRevolution;
        this.active = true;

        this.diagnostics = {
            rpmTiming: 0,
        };

        this.rpm = 0;
    }

    on(type, callback) {
        if (type === "rpmChange") {
            rpmIO(callback);
        }
    }

    rpmIO(callback) {
        var rpmPin = new Gpio(8, "in");

        var step = 0;

        while (this.active) {
            let rpmTiming = Date.now();
            if (rpmPin.readSync() === 1 && step == 0) {
                var timer = Date.now();
                step = 1;
            }
            if (rpmPin.readSync() === 0 && step == 1) {
                step = 2;
            }
            if (rpmPin.readSync() === 0 && step == 2) {
                // RPM is calculated based on a full rotation. On most bikes it can be 2 times as accurate but it wouldn't be noticible.
                let rpm = (Date.now() - timer) * this.pulsesPerRevolution; //Miliseconds it took for one revolution
                rpm = 3600000 / rpm; // Hour divided by the miliseconds it took for one revolution. The revolutions per hour.
                this.rpm = rpm;
                callback(rpm);
                step = 0;
            }
            this.diagnostics.rpmTiming = Date.now() - rpmTiming; //Updates to frequency of RPM calculations.
        }
    }
};
