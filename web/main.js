const socket = io.connect();

const canvas = {
html: document.querySelector("canvas"),
width: 0,
height: 0,
}
const ctx = canvas.html.getContext('2d');
canvas.width = canvas.html.width;
canvas.height = canvas.html.height;

let bike = {
redline: 11000,
currentRPM: 1200,
idleRPM: 1200,
speed: 0,
temp: 66,
odometer: 0,
}

// ################################# TACH ##################################################
class TachCube {
constructor(x, y, type, color) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = color;
}
display() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, 3, 37);
    if (this.color == "green") {
        ctx.fillStyle = "#004602";
    } else if (this.color == "red") {
        ctx.fillStyle = "#460000";
    } else if (this.color = "yellow") {
        ctx.fillStyle = "#585900";
    }
    if (this.type == "closed") {
        if (this.color == "green") {
            ctx.fillStyle = "#00FF08";
        } else if (this.color == "red") {
            ctx.fillStyle = "red";
        } else if (this.color = "yellow") {
            ctx.fillStyle = "yellow";
        }
    }
    ctx.fill();
    ctx.closePath();
}
}
function drawTach(rpm) {
let spread = 7;
let rectRPM = bike.redline/113; //Each rect's rpm value
rpm = rpm/rectRPM;
for (x = 1; x <= 70; x++) {
    if (x > rpm) {
        var tachRect = new TachCube((x*spread), 10, "open", "green");
    } else {
        var tachRect = new TachCube((x*spread), 10, "closed", "green");
    }
    tachRect.display();
}
for (x = 71; x <= 100; x++) {
    if (x > rpm) {
        var tachRect = new TachCube((x*spread), 10, "open", "yellow");
    } else {
        var tachRect = new TachCube((x*spread), 10, "closed", "yellow");
    }
    tachRect.display();
}
for (x = 101; x <= 113; x++) {
    if (x > rpm) {
        var tachRect = new TachCube((x*spread), 10, "open", "red");
    } else {
        var tachRect = new TachCube((x*spread), 10, "closed", "red");
    }
    tachRect.display();
}
return true;
}
// #########################################################################################################

// ################################# SPEEDO ################################################################


function drawSpeed() {
ctx.font = "200px ocr";
ctx.fillStyle = "grey";
str = bike.speed.toString();
let speedLength = str.length;
let space = 0;
if (speedLength == 2) {
    ctx.fillText("0", 3, 200);
    ctx.fillStyle = "white";
    ctx.fillText(str[0], 103, 200);
    ctx.fillText(str[1], 203, 200);
}
if (speedLength == 1) {
    ctx.fillText("0", 3, 200);
    ctx.fillText("0", 103, 200);
    ctx.fillStyle = "white";
    ctx.fillText(str[0], 203, 200);
} else if(speedLength == 3) {
    ctx.fillStyle = "white";
    ctx.fillText(str[0], 3, 200);
    ctx.fillText(str[1], 103, 200);
    ctx.fillText(str[2], 203, 200);
} else if(speedLength > 3) {
    ctx.fillStyle = "white";
    ctx.fillText(str, 3, 200);
}
//mph
ctx.font = "30px ocr";
ctx.fillText("mph", 320, 200)
}

// #########################################################################################################

// ################################# Blinkers ##############################################################


function drawBlinkers(on1, on2) {
ctx.fillStyle = "#00FF08";
ctx.lineWidth = "2";
ctx.strokeStyle = "#00FF08";
let t1 = {
    x: 162,
    y: 240,
}

let t2 = {
    x: 244,
    y: 240,
}
ctx.beginPath(); //Left
ctx.moveTo(t1.x, t1.y);
ctx.lineTo(t1.x+25, t1.y+20);
ctx.lineTo(t1.x+25, t1.y-20);
ctx.lineTo(t1.x, t1.y);
on1 ? ctx.fill() : ctx.stroke();

ctx.beginPath(); //Right
ctx.moveTo(t2.x+25, t2.y);
ctx.lineTo(t2.x, t2.y+20);
ctx.lineTo(t2.x, t2.y-20);
ctx.lineTo(t2.x+25, t2.y);
on2 ? ctx.fill() : ctx.stroke();
}


// ###########################################################################################################

// ###########################################   Time   ######################################################


function drawTime() { // NEED TO CHANGE THIS TO GRAB TIME FROM PHONE
var date = new Date();
var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
hours = hours < 10 ? "0" + hours : hours;
var am_pm = date.getHours() >= 12 ? "PM" : "AM";
var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
let time = hours + ":" + minutes;// + ":" + seconds + " " + am_pm;
ctx.font = "65px ocr";
ctx.fillStyle = "white";

ctx.fillText(time, canvas.width-200, canvas.width-330);
}

// ###########################################################################################################

// ###########################################   TEMP   ######################################################

function drawTemp() {
ctx.font = "35px ocr";
if (bike.temp <= 110) {
    ctx.fillStyle = "#2bbcd9";    
} else if (bike.temp > 110 && bike.temp < 219) {
    ctx.fillStyle = "yellow";  
} else if (bike.temp >= 219) {
    ctx.fillStyle = "red";
}

ctx.fillText(bike.temp + '°', 50, canvas.width-550);
}

// ###########################################################################################################

// ###########################################   ODOMETER ####################################################

function drawOdometer() {
ctx.font = "35px ocr";
ctx.fillStyle = "white";
ctx.fillText(bike.odometer, 10, canvas.height-9);
}

// ###########################################################################################################

// ###########################################   DRAW   ######################################################

let odoTime = [0,100000];
let tempTime = [0, 10000];

function draw() {
odoTime[1] = new Date();
tempTime[1] = new Date();
ctx.fillStyle = "black";
ctx.rect(0,0,800,480);
ctx.fill();
drawSpeed();
drawBlinkers(false, false);
drawTach(bike.currentRPM);
drawTime();
drawTemp();       
if (odoTime[1] - odoTime[0] >= 10000) {
    odoTime[0] = odoTime[1];
    socket.emit('getOdometer', "current");              
}
if (tempTime[1] - tempTime[0] >= 2000) {
    tempTime[0] = tempTime[1];
    socket.emit('getTemp', "current");              
}
drawOdometer();
}
draw();




// ############################### SOCKET #############################################

socket.on('init', (data) => {
console.log("Connected.");         
draw();
})

socket.on("returnOdometer", (data) => {
bike.odometer = data.miles;
draw();
})

socket.on("returnTemp", (data) => {
bike.temp = data.temp;
draw();
})

// #####################################################################################












// ###########################################################################################################

// ################################# KEYBOARD CONTROLLED REVVING ######################################## DON'T NEED ANYTHING PAST THIS POINT
let active = false;
unrev = setInterval(()=> {}, 0);

function rev(e) {
if (e.type == "keydown" && !active) {
    active = true;
    clearInterval(unrev);
    rev = setInterval(()=> {
        bike.currentRPM += 270;
        bike.speed += 1;
        if (bike.currentRPM >= 12000) {
            bike.currentRPM = 10800;
            active = false;
            clearInterval(rev);
        }
        draw();
    }, 1000/50);
}
if (e.type == "keyup") {
    active = false;
    clearInterval(rev);
    unrev = setInterval(()=> {
        bike.currentRPM -= 150;
        if (bike.speed <= 0) {
            bike.speed = 0;
        } else {
            bike.speed -= 1;
        }
        if (bike.currentRPM <= bike.idleRPM) {
            bike.currentRPM = bike.idleRPM;
            clearInterval(unrev);
        }
        draw();
    }, 1000/30)
}
}   

document.addEventListener('keydown', rev);
document.addEventListener('keyup', rev);
// #########################################################################################################