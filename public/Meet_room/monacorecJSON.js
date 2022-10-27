var constraints = {audio: {
  autoGainControl: false
}};
var arr=[];
var resultingBlob;
var arriter=0;
var rec={};
var inter;
var b64='';
var result;
var but=document.getElementById('record');
var audArray=[];
var audioURL;
var audURL=document.createElement('div');
audURL.id="audBlob";
document.body.appendChild(audURL);
navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream) {
  mediaRecorder = new MediaRecorder(mediaStream);
mediaRecorder.onstart = function(e) {
  console.log("Start");
  audArray=[];
};
mediaRecorder.ondataavailable = function(e) {
    audArray.push(e.data);
};
mediaRecorder.onstop = function(e) {
  blob=new Blob(audArray, { 'type' : 'audio/ogg; codecs=opus' }); 
  var reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = function() {
    fileCon={"Activity":rec,"Audio":reader.result};
    rec={};
    arriter=0;
    fileCon=JSON.stringify(fileCon);
    console.log(fileCon);
    download(fileCon,'abcd.json','text/json')
    }
  };
});
but.onclick =function(){
  if(but.value=="Record"){
    recording_stat=1;
    but.value="Stop";
    but.innerHTML="Stop";
    mediaRecorder.start();
    inter=setInterval(function(){
      if(arriter%60!=0){
        rec[arriter]=arr;
        arr=[];
        arriter++;
      }
      else{
        require(["vs/editor/editor.main"],function () {
            var con=model.getValue();
            // con=con.replace("\n","\\n");
            // con=con.replace("\t","\\t");
            arr=[[3,[[1,1,1,1]],[con]]];
          });
        rec[arriter]=arr;
        arr=[];
        arriter++;
      }
    },1000);
  }
  else{
    recording_stat=0;
    clearInterval(inter);
    but.value="Record";
    but.innerHTML="Record";
    mediaRecorder.stop();
  }
}
function recordAction(opt,ranges,texts){
  arr.push([opt,ranges,texts]);
}
function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
function saveAudio(blob){
  resultingBlob=blob;
}