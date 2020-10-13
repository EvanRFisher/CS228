var trainingCompleted = false;
const knnClassifier = ml5.KNNClassifier();
const maxSamples = test.shape[3];

var testingSampleIndex = 0;

var predictedClassLabels = nj.zeros([maxSamples]);

function draw(){
  clear();
  if (!trainingCompleted) {
    Train();
    console.log("Training complete.");
  }
  Test();

}

function Train(){
  for (var i = 0; i < train6.shape[3]; i++) {
    var features = train6.pick(null,null,null,i).reshape(120).tolist();
    console.log("Adding 6 training sample #"+i+".");
    knnClassifier.addExample(features,6);
  }
  for (var i = 0; i < train7.shape[3]; i++) {
    var features = train7.pick(null,null,null,i).reshape(120).tolist();
    console.log("Adding 7 training sample #"+i+".");
    knnClassifier.addExample(features,7);
  }
  trainingCompleted = true;
}
function Test(){
  for (var i = 0; i < test.shape[3]; i++) {
    var features = test.pick(null,null,null,i).reshape(120).tolist();
    knnClassifier.classify(features,GotResults);
  }
}
function GotResults(err,result){
  console.log(testingSampleIndex,result);
  predictedClassLabels.set(testingSampleIndex,result);
  testingSampleIndex=testingSampleIndex+1;
  if (testingSampleIndex==maxSamples) {
    testingSampleIndex=0;
  }
}
