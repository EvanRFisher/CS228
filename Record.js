var controllerOptions = {};
var rawXMin = Number.POSITIVE_INFINITY, rawXMax = Number.NEGATIVE_INFINITY, rawYMin = Number.POSITIVE_INFINITY, rawYMax = Number.NEGATIVE_INFINITY;
var previousNumHands = 0, currentNumHands = 0;
var oneFrameOfData = nj.zeros([5,4,6]);

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
    RecordData(hand);
  }
  previousNumHands = currentNumHands;
}
function HandleHand(hand, tipCol, baseCol){
  fingers = hand.fingers;
  for (var i = 0; i < 4; i++) {
    var fingerNum = 0;
    for (var finger of fingers) {
      HandleBone(finger.bones[i],fingerNum++, tipCol, baseCol);
    }
  }
}

function HandleBone(bone, fingerId, tipCol, baseCol){
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

function RecordData(hand){

  if (previousNumHands == 2 && currentNumHands == 1) {
    background(0);
    
    for (var finger = 0; finger < 5; finger++) {
      for (var boneNum = 0; boneNum < 4; boneNum++) {
        bone = fingers[finger].bones[boneNum];
        tip = bone.nextJoint
        base = bone.prevJoint
        var bx,by,tx,ty;
        [bx,by]= TransformCoordinates(base[0], base[1]);
        [tx,ty]= TransformCoordinates( tip[0],  tip[1]);

        oneFrameOfData.set(finger,boneNum,0, bx);
        oneFrameOfData.set(finger,boneNum,1, by);
        oneFrameOfData.set(finger,boneNum,2, base[2]);
        oneFrameOfData.set(finger,boneNum,3, tx);
        oneFrameOfData.set(finger,boneNum,4, ty);
        oneFrameOfData.set(finger,boneNum,5, tip[2]);
      }
    }

    console.log(oneFrameOfData.toString());
  }
}
