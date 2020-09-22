var controllerOptions = {};
var rawXMin = Number.POSITIVE_INFINITY, rawXMax = Number.NEGATIVE_INFINITY, rawYMin = Number.POSITIVE_INFINITY, rawYMax = Number.NEGATIVE_INFINITY;
var previousNumHands = 0, currentNumHands = 0;
console.log("ready");
Leap.loop(controllerOptions, function(frame){
  clear();
  HandleFrame(frame);
});

function HandleFrame(frame){
  currentNumHands = frame.hands.length;
  if (frame.hands.length >=1) {
    hand = frame.hands[0];
    if (frame.hands.length == 1) {
      HandleHand(hand, color(0,158,115), color(0,79.6,23));
    } else {
      HandleHand(hand, color(213,94,0), color(42.6,18.8,0));
    }
  }
  previousNumHands = currentNumHands;
}
function HandleHand(hand, tipCol, baseCol){
  fingers = hand.fingers;
  for (var i = 0; i < 4; i++) {
    for (var finger of fingers) {
      HandleBone(finger.bones[i], tipCol, baseCol);
    }
  }
}
function HandleFinger(finger, tipCol, baseCol){
  for (var bone of finger.bones) {
    HandleBone(bone, tipCol, baseCol);
  }
  //circle(screenX, screenY,50);
}
function HandleBone(bone, tipCol, baseCol){
  tipCol = tipCol || color(200);
  baseCol = baseCol || color(40);
  tip = bone.nextJoint
  base = bone.prevJoint
  var bx,by,tx,ty;
  [bx,by]= TransformCoordinates(base[0], base[1]);
  [tx,ty]= TransformCoordinates( tip[0],  tip[1]);
  strokeWeight(9-2*bone.type);
  stroke(lerpColor(tipCol,baseCol,bone.type/4));
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
