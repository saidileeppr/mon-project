var jSON='';
var arriter=0;
var arr=[];
var nop=0;
var rec=[];
var jSON='';
var inter;
var but=document.getElementById('record');
function Record(){
  if(but.value=="Record"){
    but.value="Stop";
    but.innerHTML="Stop";
    inter=setInterval(function(){
      if(arriter%60!=0){
        rec.push(arr);
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
        rec.push(arr);
        arr=[];
        arriter++;
      }
      jSON=JSON.stringify(rec);
    },1000);
  }
  else{
    clearInterval(inter);
    but.value="Record";
    but.innerHTML="Record";
    console.log(jSON);
    jSON='';
    rec=[];
    arriter=0;
  }
}
function recordAction(opt,ranges,texts){
  arr.push([opt,ranges,texts]);
}