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
    HandleFinger(finger);
  }
}
function HandleFinger(finger){
  for (var bone of finger.bones) {
    HandleBone(bone);
  }
  //circle(screenX, screenY,50);
}
function HandleBone(bone){
  x = bone.tipPosition[0]
  y = bone.tipPosition[1]
  z = bone.tipPosition[2]

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
  screenY = window.innerHeight - ((y-rawYMin)/(rawYMax-rawYMin))*window.innerHeight;
}
