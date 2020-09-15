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
  for (var i = 0; i < 4; i++) {
    for (var finger of fingers) {
      HandleBone(finger.bones[i]);
    }
  }
}
function HandleFinger(finger){
  for (var bone of finger.bones) {
    HandleBone(bone);
  }
  //circle(screenX, screenY,50);
}
function HandleBone(bone){
  tip = bone.nextJoint
  base = bone.prevJoint
  [bx,by]= TransformCoordinates(base[0], base[1]);
  [tx,ty]= TransformCoordinates( tip[0],  tip[1]);
  strokeWeight(9-2*bone.type);
  stroke(80-20*bone.type);
  line(bx,by,tx,ty);
}
function TransformCoordinates(x,y){

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

  return [screenX,screenY];
}
