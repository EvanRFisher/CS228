var controllerOptions = {};
var rawXMin = Number.POSITIVE_INFINITY, rawXMax = Number.NEGATIVE_INFINITY, rawYMin = Number.POSITIVE_INFINITY, rawYMax = Number.NEGATIVE_INFINITY;
var previousNumHands = 0, currentNumHands = 0;
const numsamples = 2;
var currentSample =0;
var framesOfData = nj.zeros([5,4,6,numsamples]);

Leap.loop(controllerOptions, function(frame){
  clear();
  HandleFrame(frame);
});

function HandleFrame(frame){
  currentNumHands = frame.hands.length;
  if (frame.hands.length >=1) {
    hand = frame.hands[0];
    if (frame.hands.length == 1) {
      HandleHand(hand, frame.interactionBox, color(0,158,115), color(0,79.6,23));
    } else {
      HandleHand(hand, frame.interactionBox, color(213,94,0), color(42.6,18.8,0));
    }
    RecordData(hand,frame.interactionBox);
  }
  previousNumHands = currentNumHands;
}
function HandleHand(hand, framebox, tipCol, baseCol){
  fingers = hand.fingers;
  for (var i = 0; i < 4; i++) {
    var fingerNum = 0;
    for (var finger of fingers) {
      HandleBone(finger.bones[i],framebox,fingerNum++, tipCol, baseCol);
    }
  }
}

function HandleBone(bone, framebox, fingerId, tipCol, baseCol){

  tipCol = tipCol || color(200);
  baseCol = baseCol || color(40);
  tip = bone.nextJoint
  base = bone.prevJoint
  var normedTip = framebox.normalizePoint(tip, true);
  var normedBase = framebox.normalizePoint(base, true);
  var bx,by,tx,ty;
  bx = normedBase[0]*window.innerWidth;
  by = normedBase[1]*window.innerHeight;
  tx = normedTip[0]*window.innerWidth;
  ty = normedTip[1]*window.innerHeight;
  strokeWeight(9-2*bone.type);
  stroke(lerpColor(tipCol,baseCol,bone.type/4));
  line(bx,window.innerHeight-by,tx,window.innerHeight-ty);
}

function RecordData(hand,framebox){
  if (previousNumHands == 1 && currentNumHands == 2) {
    currentSample = currentSample+1;
    if (currentSample == numsamples) {
      currentSample =0;
    }
  }
  if (previousNumHands == 2 && currentNumHands == 1) {
    background(0);

    for (var finger = 0; finger < 5; finger++) {
      for (var boneNum = 0; boneNum < 4; boneNum++) {
        bone = fingers[finger].bones[boneNum];
        tip = bone.nextJoint
        base = bone.prevJoint
        var normedTip = framebox.normalizePoint(tip, true);
        var normedBase = framebox.normalizePoint(base, true);
        //[bx,by]= TransformCoordinates(base[0], base[1]);
        //[tx,ty]= TransformCoordinates( tip[0],  tip[1]);

        framesOfData.set(finger,boneNum,0,currentSample, normedBase[0]);
        framesOfData.set(finger,boneNum,1,currentSample, normedBase[1]);
        framesOfData.set(finger,boneNum,2,currentSample, normedBase[2]);
        framesOfData.set(finger,boneNum,3,currentSample, normedTip[0]);
        framesOfData.set(finger,boneNum,4,currentSample, normedTip[1]);
        framesOfData.set(finger,boneNum,5,currentSample, normedTip[2]);
      }
    }

    console.log(framesOfData.toString());
  }
}
