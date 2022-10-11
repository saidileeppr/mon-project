require.config({ paths: { 'vs': '/monaco-editor/min/vs' }});
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
var activity;
var arrlen;
var aud=document.getElementById('audRec');
var audSrc=document.getElementById("audioSource");
document.getElementById('import').onclick = function() {
  var filepoint = document.getElementById('selectFiles');
	var files = filepoint.files;
  if (files.length <= 0) {
    return false;
  }
  var fr = new FileReader();
  fr.onload =  function(e) { 
    var result = JSON.parse(e.target.result);
    audSrc.src=result["Audio"];
    aud.load();
    activity=result.Activity;
    aud.controls = true;
    load_text(0);
    arrlen=Object.keys(activity).length;
  }
  fr.readAsText(files.item(0));
  };
/*aud.onplaying=function(){};
aud.onpause=function(){};
aud.ontimeupdate = function(){
console.log('run');
  var currTime=Math.floor(aud.currentTime);
      if(currTime!=lastsec && currTime<arrlen){  
  if(aud.paused){
        load_text(currTime);
      }
    else{
        console.log('play',currTime,lastsec);
        play(currTime);
      }
    }
  };

function load_text(tim){
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
};
function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms));
  } 
*/
