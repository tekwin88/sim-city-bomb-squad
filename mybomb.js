console.log("javascript running");

document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM has loaded");
});

//State of wires with 0 for Uncut, 1 for Cut
var wires = {
  blue: 0,
  green: 0,
  red: 0,
  white: 0,
  yellow: 0
};

//Correct wires to be cut with 0 for Uncut, 1 for need to Cut
var correctWires = {
  blue: 0,
  green: 0,
  red: 0,
  white: 0,
  yellow: 0
};

//Setting the correct wires to cut with random choice
for(var wire in correctWires){
  correctWires[wire] = Math.floor(Math.random()*2);
}

var delayedExplosion; //Setting of the delayedExplosion
var triggered = false;
var exploded = false;

//These variables are used to keep the game in real time
var timeStart = (new Date()).getTime();
var timeAvailable =  30  * 1000;
var timeEnd = timeStart + timeAvailable;

var startCountDown = setInterval(function(){

  var timeLeft = timeAvailable - ((new Date()).getTime() - timeStart);

  //Extracting the various digits from the number of milliseconds left
  var digit1 = Math.floor(timeLeft/1) % 10;
  var digit2 = Math.floor(timeLeft/10) % 10;
  var digit3 = Math.floor(timeLeft/100) % 10;
  var digit4 = Math.floor(timeLeft/1000) % 10;
  var digit5 = Math.floor(timeLeft/10000) % 6;
  var digit6 = Math.floor(timeLeft/60000) % 10;
  var digit7 = Math.floor(timeLeft/600000) % 6;
  var digit8 = Math.floor(timeLeft/3600000) % 10;
  //Forming the time string for display
  var timeString = digit8+":"+digit7+digit6+":"+digit5+digit4+":"+digit3+digit2+digit1;
  document.getElementById("timer").textContent = timeString;

  //To prevent errors when the timer is unable to stop at 0 and give -ve value and
  //will set to trigger the explosion immediately once the timer reach 0 sec.
  if( (new Date()).getTime() >= timeEnd ){
    //Initialised the timer to display at 0 sec
    timeString = "0:00:00.000";
    document.getElementById("timer").textContent = timeString;

    //Stop the timer countdown!
    clearInterval(startCountDown);

    //Trigger the explosion!
    var immediateExplosion = setTimeout(explosion,0);
  }
}, 1);

//Monitor each wire to see if it is being selected
for(var wire in wires){
  document.getElementById(wire).addEventListener("click",function(){

    //Perform the following only if the bomb has not yet exploded when selected, otherwise don't do anything
    if(!exploded){
      //change wire image to cut version if selected
      this.innerHTML = '<img src="img/cut-' + this.id + '-wire.png">';
      //record the wire selected as cut
      wires[this.id] = 1;
      //play the zap sound
      document.getElementById("zap").play();
      //if the wrong wire is being selected it will trigger delayed explosion
      if((wires[this.id] > correctWires[this.id]) && !triggered) {
        delayedExplosion = setTimeout(explosion,750);
        triggered = true;
      }
      //check whether the bomb has been defused
      checkDefused();
    }
  });
}

//The following function will be performed when the explosion occurred.
function explosion() {
  //Change the background image to the explosion image
  document.body.className = "exploded";
  exploded = true;
  //Stop the timer countdown!
  clearInterval(startCountDown);
  //Play the explosion sound effects and paused the background
  document.getElementById("background").pause();
  document.getElementById("explosionsound").play();
}

//Checking whether the bomb has been defused
function checkDefused () {
  //Assume the wire is in the defused state
  var defused = true;
  //Define the array for use with the forEach command
  var arrayNames = ["blue","green","red","white","yellow"];

  //Checking for the correct wires to be cut
  arrayNames.forEach(function(item){
    if(wires[item] < correctWires[item]) {
      defused = false;
    }
  });

  //When the bomb has been defused, stop the countdown & any triggered delayed explosions
  if(defused) {
    clearTimeout(delayedExplosion);
    clearInterval(startCountDown);
    exploded = true;
    //Change the timer from red to green
    document.getElementById("timer").classList.remove("redfont");
    document.getElementById("timer").classList.add("greenfont");
    //Stop the siren, play the music!
    document.getElementById("background").pause();
    document.getElementById("cheers").play();
    document.getElementById("cheers").addEventListener("ended",function(){
      document.getElementById("success").play();
    });
  }
}
