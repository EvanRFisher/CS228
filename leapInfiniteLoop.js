var controllerOptions = {};
var x = window.innerWidth/2;
var y = window.innerHeight/2;
Leap.loop(controllerOptions, function(frame){
  clear();
  //x+=Math.random()*2-1
  //y+=Math.random()*2-1
  HandleFrame(frame);
});

function HandleFrame(frame){
  if (frame.hands.length >=1) {
    hand = frame.hands[0];
    HandleHand(hand);
  }
}
function HandleHand(hand){
  fingers = hand.fingers;
  for (var finger of fingers) {
    if (finger.type == 1) {
      HandleFinger(finger);
    }
  }
}
function HandleFinger(finger){
  x = finger.tipPosition[0]
  y = finger.tipPosition[1]
  z = finger.tipPosition[2]
  console.log(finger.tipPosition);
  circle(x,window.innerHeight - y,50);
}
