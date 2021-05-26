require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' }});
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
    "formatOnType": true
});
});
var arr=[];
document.getElementById('import').onclick = function() {
  var aud=document.getElementById('audRec');
  var filepoint = document.getElementById('selectFiles');
	var files = filepoint.files;
  var name=filepoint.value.split('\\');
  var len=name.length;
  var source=aud.src;
  name=name[len-1].replace(".json","");
  var s=source+name+".m4a";
  aud.src=s;
  if (files.length <= 0) {
    return false;
  }
  var fr = new FileReader();
  fr.onload = function(e) { 
    var result = JSON.parse(e.target.result);
    arr=(result.Activity);
    console.log(arr[4]);
var inp4=document.getElementById('audRec');
inp4.controls = true;
var arrlen=arr.length;
var lastsec=0;
var tim=0;
var i=0;
inp4.onplaying=function(){};
inp4.onpause=function(){};
inp4.ontimeupdate = function(){
    if(inp4.paused){
      var currTime=Math.floor(inp4.currentTime);
      if(currTime!=lastsec && currTime<arrlen){
        load(currTime);
      }
    }
    else{
      var currTime=Math.floor(inp4.currentTime);
      if(currTime!=lastsec && currTime<arrlen){
        console.log('play',currTime,lastsec);
        play(currTime);
      }
    }
};
function load(tim){
  require(["vs/editor/editor.main"],function () {
    model.setValue("");
  });
var min=Math.floor(tim/60);
console.log(tim,lastsec);
i=min*60;
console.log('pre',i);
for (;i<tim;i++){
  for (j=0;j<arr[i].length;j++){
        realTime(arr[i][j][0],arr[i][j][1],arr[i][j][2]);
      }
    
    }
  console.log('pre',i,arr[i]);
  lastsec=i;
}
async function play(i){
  var j=0;
  lastsec=i;
  if(arr[i].length!=0){
    for (j=0;j<arr[i].length;j++){
      await sleep(150);
      console.log(arr[i][j][0],arr[i][j][1],arr[i][j][2]);
      realTime(arr[i][j][0],arr[i][j][1],arr[i][j][2]);
    }
  }
}
function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms));
        }
  } 
  fr.readAsText(files.item(0));
};
