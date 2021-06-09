var jSON='';
var arriter=0;
var arr=[];
var nop=0;
var rec={};
var jSON='';
var inter;
var but=document.getElementById('record');
function Record(){
  if(but.value=="Record"){
    but.value="Stop";
    but.innerHTML="Stop";
    inter=setInterval(function(){
      if(arriter%60!=0){
        rec[arriter]=arr;
        arr=[];
        arriter++;
      }
      else{
        require(["vs/editor/editor.main"],function () {
            var con=model.getValue();
            con=con.replace("\n","\\n");
            con=con.replace("\t","\\t");
            arr=[[3,[[1,1,1,1]],[con]]];
          });
        rec[arriter]=arr;
        arr=[];
        arriter++;
      }
    },1000);
  }
  else{
    clearInterval(inter);
    but.value="Record";
    but.innerHTML="Record";
    fileCon={"SessionId":"12drharstsakj","Activity":rec};
    fileCon=JSON.stringify(fileCon);
    console.log(fileCon,audFile);
    download(fileCon,'abcd.json','text/json')
    jSON='';
    rec=[];
    arriter=0;
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