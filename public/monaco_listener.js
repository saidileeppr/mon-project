var range;
var ctrlDown;
var x;
var bol;
var con=true;
require(["vs/editor/editor.main"],function () {
  monEditor.onKeyUp(function(event){
  });
  monEditor.onKeyDown(function(event){
      bol=true;
      var pos=monEditor.getPosition();
      x=event.browserEvent.key;
      if(x=="Enter" && !monEditor.onDidFocusEditorText()){
      }
      
      // else if(event.ctrlKey && (x!="v" && x!='V')){
      //   var sel=monEditor.getSelection();
      //   sendData(1,sel,x,roomId1);
      // }
      else{
        monEditor.onDidChangeModelContent(function(event){
          var changes=[];
          for(var i=0;i<event.changes.length;i++){
            changes.push({range:event.changes[i].range,text:event.changes[i].text,forceMoveMarkers:true});
          }
          if(bol){
            console.log(changes);
            sendData(2,changes,roomId1);
            bol=false;
          }
        });
      }
  });
    monEditor.onDidChangeCursorSelection(function(event){
    });
  });