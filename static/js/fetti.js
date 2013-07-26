var MAX_WIDTH;
var MAX_HEIGHT;
var MAX_DROPS;

var canvas;
var ctx;

var dropArray;
var pointer;

var fadeFlag = document.getElementById("fadeFlag").checked;
var fadeRate = parseFloat(document.getElementById("fadeRate").value);
var maxVelo = parseFloat(document.getElementById("veloMax").value);
var minVelo = parseFloat(document.getElementById("veloMin").value);

var updateIntervalID;

function Drop(x,y,maxV,minV,fade,fadeFactor) {
    this.x = x;
    this.y = y;
    this.xDir = 1;
    
    this.r = Math.ceil(Math.random() * 255);
    this.g = Math.ceil(Math.random() * 255);
    this.b = Math.ceil(Math.random() * 255);
    this.a = 1.0;

    this.fade = fade;
    this.fadeFactor = fadeFactor;
    this.fadeBase = 0.005;

    this.update = function() {
        this.x += this.dx;
        this.y += this.dy;
        if(this.fade) {
            this.a -= (this.fadeBase * this.fadeFactor);
            if(this.a < 0) this.a = 0;
        }
    }

    this.setVelocity = function(max, min){
        var adjMax = max - min;
        this.dx = Math.ceil(Math.random() * adjMax) + min;
        this.dy = Math.ceil(Math.random() * adjMax) + min;
        this.dx = this.dx * this.xDir;
    }

    this.setFade = function(flag, factor) {
        this.fade = flag;
        this.fadeFactor = factor;
    }

    if(Math.random() < 0.5) this.xDir = -1;
    this.setVelocity(maxV, minV);
}

function init() {
    canvas = document.getElementById("can1");
    ctx = canvas.getContext("2d");

    MAX_WIDTH = canvas.width;
    MAX_HEIGHT = canvas.height;
    MAX_DROPS = 200;

    dropArray = new Array();
    pointer = 0;
    
    updateIntervalID = setInterval(update, 20);
}

function update() {
    if(Math.ceil(Math.random() * 100) < 40) {
        dropArray[pointer] = new Drop(Math.ceil(Math.random() * 2 * MAX_WIDTH),0, maxVelo,minVelo,fadeFlag,fadeRate);
        pointer = (pointer + 1) % MAX_DROPS;
    }
    var d;
    var rad = 10;
    ctx.clearRect(0,0,MAX_WIDTH,MAX_HEIGHT);
    for(var i = 0; i < dropArray.length; i++) {
        d = dropArray[i];
        if(d.fade) {
            ctx.fillStyle = "rgba("+d.r+","+d.g+","+d.b+","+d.a+")";
        } else {
            ctx.fillStyle = "rgb("+d.r+","+d.g+","+d.b+")";
        }
        ctx.beginPath();
        ctx.arc(d.x,d.y,rad,0,2*Math.PI,true);
        ctx.fill();
        //ctx.fillRect(d.x,d.y,10,10);
        d.update();
    }
}

function apply() {
    fadeFlag = document.getElementById("fadeFlag").checked;
    fadeRate = parseFloat(document.getElementById("fadeRate").value);
    maxVelo = parseFloat(document.getElementById("veloMax").value);
    minVelo = parseFloat(document.getElementById("veloMin").value);

    for (var i = 0; i < dropArray.length; i++) {
        var d = dropArray[i];
        d.setVelocity(maxVelo,minVelo);
        d.setFade(fadeFlag,fadeRate);
    }
}

function resume() {
    updateIntervalID = setInterval(update, 20);
    document.getElementById("resumeButton").classList.add("hide");
    document.getElementById("stopButton").classList.remove("hide");
}

function stop() {
    clearInterval(updateIntervalID);
    document.getElementById("stopButton").classList.add("hide");
    document.getElementById("resumeButton").classList.remove("hide");
}

window.onload = init();
