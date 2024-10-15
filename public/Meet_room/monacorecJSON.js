let recArr=[];
let resultingBlob;
let arriter=0;
let rec={};
let inter;
let b64='';
let result;
let but=document.getElementById('record');
let audArray=[];
let audioURL;
let audURL=document.createElement('div');
audURL.id="audBlob";
document.body.appendChild(audURL);
let mediaRecorder;
navigator.mediaDevices.getUserMedia({audio: {autoGainControl: false}}).then(function(mediaStream) {
  mediaRecorder = new MediaRecorder(mediaStream);
mediaRecorder.onstart = function(e) {
  console.log("Start");
  audArray=[];
};
mediaRecorder.ondataavailable = function(e) {
    audArray.push(e.data);
};
mediaRecorder.onstop = function(e) {
  let blob=new Blob(audArray, { 'type' : 'audio/ogg; codecs=opus' }); 
  let reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = function() {
    let fileCon={"Activity":rec,"Audio":reader.result};
    rec={};
    arriter=0;
    fileCon=JSON.stringify(fileCon);
    console.log(fileCon);
    let filename = prompt("Enter the filename you the save(Excluding Extension, e.g., 'MyFile')","MyFile");
    download(fileCon,filename+'.json','text/json')
    }
  };
});
but.onclick =function(){
  if(but.value=="Record"){
    but.value="Stop";
    but.innerHTML="Stop";
    mediaRecorder.start();
    inter=setInterval(function(){
      if(arriter%60!=0){
        rec[arriter]=recArr;
        recArr=[];
        arriter++;
      }
      else{
        require(["vs/editor/editor.main"],function () {
            let con=model.getValue();
            // con=con.replace("\n","\\n");
            // con=con.replace("\t","\\t");
            recArr=[[3,[[1,1,1,1]],[con]]];
          });
        rec[arriter]=recArr;
        recArr=[];
        arriter++;
      }
    },1000);
  }
  else{
    clearInterval(inter);
    but.value="Record";
    but.innerHTML="Record";
    mediaRecorder.stop();
  }
}
function recordAction(opt,ranges,texts){
  recArr.push([opt,ranges,texts]);
}
function download(content, fileName, contentType) {
  let a = document.createElement("a");
  let file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
function saveAudio(blob){
  resultingBlob=blob;
}