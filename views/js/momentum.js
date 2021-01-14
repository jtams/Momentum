const socket = io();

const momentum = {
    on: function (type, callback) {
        switch (type) {
            case "rpmChange":
                rpmListener(callback);
                break;

            default:
                break;
        }
    },
};

function rpmListener(callback) {
    socket.on("rpmChange", (e) => {
        callback(e);
    });
}
