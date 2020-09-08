var controllerOptions = {};
var x = window.innerWidth/2;
var y = window.innerHeight/2;
Leap.loop(controllerOptions, function(frame){
  circle(x,y,50);
  x+=Math.random()*2-1
});
