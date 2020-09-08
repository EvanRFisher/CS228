var controllerOptions = {};
var rawXMin = Number.POSITIVE_INFINITY, rawXMax = Number.NEGATIVE_INFINITY, rawYMin = Number.POSITIVE_INFINITY, rawYMax = Number.NEGATIVE_INFINITY;
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

  if (x<rawXMin) {
    rawXMin = x;
  }
  if (x>rawXMax) {
    rawXMax = x;
  }
  if (y<rawYMin) {
    rawYMin = y;
  }
  if (y>rawYMax) {
    rawYMax = y;
  }

  screenX = ((x-rawXMin)/(rawXMax-rawXMin))*window.innerWidth;
  console.log(rawXMin,rawXMax,rawYMin,rawYMax);

  circle(screenX,window.innerHeight - y,50);
}
