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

//Not actually a function... this is a javascript class
function Drop(x,y,maxXV,minXV, maxYV, minYV,fade,fadeFactor) {
    this.x = x;
    this.y = y;
    this.xDir = 1;

    //Generate a random color for the droplet
    this.r = Math.ceil(Math.random() * 255);
    this.g = Math.ceil(Math.random() * 255);
    this.b = Math.ceil(Math.random() * 255);
    //Set the opacity to fully opaque
    this.a = 1.0;

    //Set the fade variables... fuck if I can remember what fadebase is...
    this.fade = fade;
    this.fadeFactor = fadeFactor;
    this.fadeBase = 0.005;

    //Runs ever loop, updates position and transparency
    this.update = function() {
        //Position update
        this.x += this.dx;
        this.y += this.dy;
        //If we are supposed to fade, change the alpha value
        if(this.fade) {
            this.a -= (this.fadeBase * this.fadeFactor);
            if(this.a < 0) this.a = 0;
        }
    }

    //Set the velocity of the drop
    this.setVelocity = function(xMax, xMin, yMax, yMin){
        //Adjusted Maximum
        var adjXMax = xMax - xMin;
        var adjYMax = yMax - yMin;
        //Calculate the random x and y velocities
        this.dx = Math.ceil(Math.random() * adjXMax) + yMin;
        this.dy = Math.ceil(Math.random() * adjYMax) + yMin;
        //set the X direction, which is apprently calculated elsewhere...
        this.dx = this.dx * this.xDir;
    }

    //Set the fade of the drop
    this.setFade = function(flag, factor) {
        //Should we fade?
        this.fade = flag;
        //Store the factor
        this.fadeFactor = factor;
    }

    //Aha! here we set the xdir... that's pretty dumb... fix this later
    if(Math.random() < 0.5) this.xDir = -1;
    this.setVelocity(maxXV, minXV, maxYV, minYV);
}

//This is all the stuff we should be taking care of in the beginning
function init() {
    //Get the canvas element and save the context
    canvas = document.getElementById("can1");
    ctx = canvas.getContext("2d");

    //Determining the dimensions of the drawspace
    MAX_WIDTH = canvas.width;
    MAX_HEIGHT = canvas.height;
    //Set the max number of drops
    MAX_DROPS = 200;

    //The place to store the drops
    dropArray = new Array();
    //Pointer... we'll see what this does later I guess?
    pointer = 0;

    //set the delay between frames and the function to run (update)
    updateIntervalID = setInterval(update, 20);
}

//This function runs every 20 whatsits according to setInterval()
function update() {
    //there is a 2/5 chance every frame that a drop is created
    if(Math.ceil(Math.random() * 100) < 40) {
        var xMax = Math.ceil(Math.random() * 2 * MAX_WIDTH);
        var xMin = 0;
        var yMax = Math.ceil(Math.random() * 2 * MAX_HEIGHT);
        var yMin = 0;
        dropArray[pointer] = new Drop(Math.ceil(Math.random() * 2 * MAX_WIDTH),0, maxVelo,minVelo,fadeFlag,fadeRate);
        //Hey here's the pointer... looks like it's to keep track of how many we've created
        //and to override the old drops that have gone out of bounds... this is pretty hacky,
        //but it works.
        pointer = (pointer + 1) % MAX_DROPS;
    }
    // d.... what the fuck Past-Jack... what the fuck?
    var d;
    //Radius!
    var rad = 10;
    //Clear the screen every frame
    ctx.clearRect(0,0,MAX_WIDTH,MAX_HEIGHT);
    //Loop through all the drops and draw them
    for(var i = 0; i < dropArray.length; i++) {
        //hey hey hey, d is for a single drop!
        d = dropArray[i];
        if(d.fade) { //If we should fade, fade
            ctx.fillStyle = "rgba("+d.r+","+d.g+","+d.b+","+d.a+")";
        } else { //Otherwise, max opacity
            ctx.fillStyle = "rgb("+d.r+","+d.g+","+d.b+")";
        }
        //Draw the drop
        ctx.beginPath();
        ctx.arc(d.x,d.y,rad,0,2*Math.PI,true);
        ctx.fill();
        //ctx.fillRect(d.x,d.y,10,10); //Old code when I used a rectangle
        //Update each individual drop
        d.update();
    }
}

//Apply the settings when the user clicks 'Apply'
function apply() {
    fadeFlag = document.getElementById("fadeFlag").checked;
    fadeRate = parseFloat(document.getElementById("fadeRate").value);
    maxXVelo = parseFloat(document.getElementById("veloXMax").value);
    minXVelo = parseFloat(document.getElementById("veloXMin").value);
    maxYVelo = parseFloat(document.getElementById("veloYMax").value);
    minYVelo = parseFloat(document.getElementById("veloYMin").value);

    //For each drop, recalculate everything
    for (var i = 0; i < dropArray.length; i++) {
        var d = dropArray[i];
        d.setVelocity(maxXVelo,minXVelo, maxYVelo, minYVelo);
        d.setFade(fadeFlag,fadeRate);
    }
}

//Resume after pausing
function resume() {
    updateIntervalID = setInterval(update, 20);
    document.getElementById("resumeButton").classList.add("hide");
    document.getElementById("stopButton").classList.remove("hide");
}

//Pause the screen
function stop() {
    clearInterval(updateIntervalID);
    document.getElementById("stopButton").classList.add("hide");
    document.getElementById("resumeButton").classList.remove("hide");
}

//When the window loads, call the init function
window.onload = init();
