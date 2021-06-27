require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs' }});
require(["vs/editor/editor.main"],function () {
  model=monaco.editor.createModel(
  "",
  "python"
);
  monEditor = monaco.editor.create(document.getElementById('myInput'),{
      model,
      theme: "vs-dark"
  });
  monEditor.updateOptions({
    "autoIndent": true,
    "formatOnPaste": true,
    "formatOnType": true,
    "readOnly":true
});
});
var lastsec=0;
var tim=0;
var i=0
document.getElementById('import').onclick = function() {
  var filepoint = document.getElementById('selectFiles');
	var files = filepoint.files;
  if (files.length <= 0) {
    return false;
  }
  var fr = new FileReader();
  fr.onload = function(e) { 
    var result = JSON.parse(e.target.result);
    var binary = convertURIToBinary(result.Audio.replace("data:audio/ogg; codecs=opus;base64,",""));
    var blob = new Blob([binary], {type: 'audio/ogg , codecs : opus'});
    var aud=document.getElementById('audRec');
    aud.src=window.URL.createObjectURL(blob);
    activity=(result.Activity);
    aud.controls = true;
    load(1);
    var arrlen=Object.keys(activity).length;
    aud.onplaying=function(){};
    aud.onpause=function(){};
aud.ontimeupdate = function(){
  console.log('run');
  var currTime=Math.floor(aud.currentTime);
      if(currTime!=lastsec && currTime<arrlen){  
  if(aud.paused){
        load(currTime);
      }
    else{
        console.log('play',currTime,lastsec);
        play(currTime);
      }
    }
  };
}
function load(tim){
var min=Math.floor(tim/60);
console.log(tim,lastsec);
i=min*60;
console.log('pre',i);
for (;i<tim;i++){
  for (j=0;j<activity[i].length;j++){
        realTime(activity[i][j][0],activity[i][j][1],activity[i][j][2]);
      }
    }
  console.log('pre',i,activity[i]);
  lastsec=i;
}
async function play(i){
  var j=0;
  lastsec=i;
  if(activity[i].length!=0){
    for (j=0;j<activity[i].length;j++){
      await sleep(150);
      console.log(activity[i][j][0],activity[i][j][1],activity[i][j][2]);
      realTime(activity[i][j][0],activity[i][j][1],activity[i][j][2]);
    }
  }
}
function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms));
        } 
  fr.readAsText(files.item(0));
};
function convertURIToBinary(dataURI) {
  let raw = window.atob(dataURI);
  let rawLength = raw.length;
  let arr= new Uint8Array(new ArrayBuffer(rawLength));
  for (let i = 0; i < rawLength; i++) {
    arr[i] = raw.charCodeAt(i);
  }
  return arr;
}