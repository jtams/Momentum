const socket = io();

const momentum = {
    on: function (type, callback) {
        switch (type) {
            case "rpmChange":
                rpmListener(callback);
                break;
            case "speedChange":
                speedListener(callback);
                break;
            case "gearChange":
                gearListener(callback);
                break;
            case "lightChange":
                lightListener(callback);
                break;
            case "serialLightTest":
                serialLightTest(callback);
            default:
                break;
        }
    },
    get: function (data, callback) {
        socket.emit("get", data);
        socket.on("res", (data) => callback(data));
    },
    init: function (callback) {
        socket.emit("init");
        socket.on("init", (bikeData) => {
            callback(JSON.parse(bikeData));
        });
    },
};

function rpmListener(callback) {
    socket.on("rpmChange", (e) => {
        callback(e);
    });
}

function speedListener(callback) {
    socket.on("speedChange", (e) => {
        callback(e);
    });
}

function gearListener(callback) {
    socket.on("gearChange", (e) => {
        callback(e);
    });
}

function lightListener(callback) {
    socket.on("lightChange", (e) => {
        callback(e);
    });
}

function serialLightTest(callback) {
    socket.on("serialLightTest", (e) => {
        callback(e);
    });
}
