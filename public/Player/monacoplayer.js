require.config({ paths: { 'vs': '/monaco-editor/min/vs' }});
let model;
let monEditor;
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
let lastsec=0;
let tim=0;
let i=0
document.getElementById('import').onclick = function() {
  let filepoint = document.getElementById('selectFiles');
	let files = filepoint.files;
  let activity;
  if (files.length <= 0) {
    return false;
  }
  let fr = new FileReader();
  fr.onload = function(e) { 
    let result = JSON.parse(e.target.result);
    let binary = convertURIToBinary(result.Audio.replace("data:audio/ogg; codecs=opus;base64,",""));
    let blob = new Blob([binary], {type: 'audio/ogg , codecs : opus'});
    let aud=document.getElementById('audRec');
    aud.src=window.URL.createObjectURL(blob);
    activity=(result.Activity);
    aud.controls = true;
    load(0);
    let arrlen=Object.keys(activity).length;
    aud.onplaying=function(){};
    aud.onpause=function(){};
aud.ontimeupdate = function(){
  let currTime=Math.floor(aud.currentTime);
      if(currTime!=lastsec && currTime<arrlen){  
  if(currTime==lastsec+1){
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
let min=Math.floor(tim/60);
console.log(tim,lastsec);
i=min*60;
console.log('checkpoint',i);
for (;i<=tim;i++){
  for (const element of activity[i]){
        realTime(element[0],element[1],element[2]);
      }
    }
  console.log('loadpoint',tim,activity[tim]);
  lastsec=tim;
}
async function play(i){
  lastsec=i;
  if(activity[i].length!=0){
    for (const element of activity[i]){
      await sleep(150);
      console.log(element[0],element[1],element[2]);
      realTime(element[0],element[1],element[2]);
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