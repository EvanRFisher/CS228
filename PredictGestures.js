var trainingCompleted = false;
const knnClassifier = ml5.KNNClassifier();
var controllerOptions = {};
var oneFrameOfData = nj.zeros([5,4,6]);
var targetDigit = 6;
var runningAccuracy =0;
numFrames = 0;

Leap.loop(controllerOptions, function (frame){
  clear();
  if (!trainingCompleted) {
    Train();
    console.log("Training complete.");
  }
  HandleFrame(frame);

});

function Train(){
  for (var i = 0; i < train6.shape[3]; i++) {
    var dataslice = train6.pick(null,null,null,i);
    CleanData(dataslice);
    var features = dataslice.reshape(120).tolist();
    console.log("Adding 6 training sample #"+i+".");
    knnClassifier.addExample(features,6);
  }
  for (var i = 0; i < train7.shape[3]; i++) {
    var dataslice = train7.pick(null,null,null,i);
    CleanData(dataslice);
    var features = dataslice.reshape(120).tolist();
    console.log("Adding 7 training sample #"+i+".");
    knnClassifier.addExample(features,7);
  }
  trainingCompleted = true;
}
function Test(){
  CleanData(oneFrameOfData);
  //console.log(oneFrameOfData.slice([],[],[0,6,3]).mean());
  var features = oneFrameOfData.reshape(120).tolist();
  knnClassifier.classify(features,GotResults);
}
function GotResults(err,result){
  numFrames+=1;
  runningAccuracy = (runningAccuracy*(numFrames-1)+(result.label == targetDigit))/numFrames;
  console.log(numFrames, result.label, runningAccuracy);

}


function CleanData(data){
  xValues = data.slice([],[],[0,6,3]);
  xShift = 0.5 - xValues.mean();

  yValues = data.slice([],[],[1,6,3]);
  yShift = 0.5 - yValues.mean();

  zValues = data.slice([],[],[2,6,3]);
  zShift = 0.5 - zValues.mean();
  for (var f = 0; f < 5; f++) { // For each finger
    for (var b = 0; b < 4; b++) { //And bone
      unshiftedX1 = data.get(f,b,0);
      oneFrameOfData.set(f,b,0,unshiftedX1+xShift);
      unshiftedX2 = data.get(f,b,3);
      oneFrameOfData.set(f,b,3,unshiftedX2+xShift);

      unshiftedY1 = data.get(f,b,1);
      oneFrameOfData.set(f,b,1,unshiftedY1+yShift);
      unshiftedY2 = data.get(f,b,4);
      oneFrameOfData.set(f,b,4,unshiftedY2+yShift);

      unshiftedZ1 = data.get(f,b,2);
      oneFrameOfData.set(f,b,2,unshiftedZ1+zShift);
      unshiftedZ2 = data.get(f,b,5);
      oneFrameOfData.set(f,b,5,unshiftedZ2+zShift);
    }
  }
}

function HandleFrame(frame){
  currentNumHands = frame.hands.length;
  if (frame.hands.length >=1) {
    hand = frame.hands[0];
    HandleHand(hand, frame.interactionBox, color(120,120,120), color(20,20,20));
    //if (frame.hands.length == 1) {
    //  HandleHand(hand, frame.interactionBox, color(0,158,115), color(0,79.6,23));
    //} else {
    //  HandleHand(hand, frame.interactionBox, color(213,94,0), color(42.6,18.8,0));
    //}
    //console.log(oneFrameOfData.tolist());
    Test();
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

  for (var finger = 0; finger < 5; finger++) {
    for (var boneNum = 0; boneNum < 4; boneNum++) {
      bone = fingers[finger].bones[boneNum];
      tip = bone.nextJoint
      base = bone.prevJoint
      var normedTip = framebox.normalizePoint(tip, true);
      var normedBase = framebox.normalizePoint(base, true);

      oneFrameOfData.set(finger,boneNum,0,normedBase[0]);
      oneFrameOfData.set(finger,boneNum,1,normedBase[1]);
      oneFrameOfData.set(finger,boneNum,2,normedBase[2]);
      oneFrameOfData.set(finger,boneNum,3,normedTip[0]);
      oneFrameOfData.set(finger,boneNum,4,normedTip[1]);
      oneFrameOfData.set(finger,boneNum,5,normedTip[2]);
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
  strokeWeight(4*(9-2*bone.type));
  stroke(lerpColor(tipCol,baseCol,bone.type/4));
  line(bx,window.innerHeight-by,tx,window.innerHeight-ty);



}
