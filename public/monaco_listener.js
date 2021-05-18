var range;
var ctrlDown;
var x;
var bol;
var con=true;
require(["vs/editor/editor.main"],function () {
  var edit;
  monEditor.onMouseUp(function(e){
    ran=monEditor.getSelection();
    sendData(1,ran,roomId1);
  });
  monEditor.onMouseDown(function(e){
    bol=true;
        monEditor.onDidChangeModelContent(function(event){
          if(bol){
            edit=event.changes;
            var changes=[];
            for(var i=0;i<event.changes.length;i++){
              changes.push({range:event.changes[i].range,text:event.changes[i].text,forceMoveMarkers:true});
            }
              console.log(event.changes);
              sendData(2,changes,roomId1);
              bol=false;
            }
        });
  });
  monEditor.onKeyDown(function(e){
      bol=true;
      x=e.browserEvent.key;
      if(x=="Enter" && !monEditor.onDidFocusEditorText()){
      }
      else{
        monEditor.onDidChangeModelContent(function(event){
          if(bol && edit!=event.changes){
          var changes=[];
            for(var i=0;i<event.changes.length;i++){
              changes.push({range:event.changes[i].range,text:event.changes[i].text,forceMoveMarkers:true});
            }
              console.log(event.changes);
              sendData(2,changes,roomId1);
              bol=false;
              edit={};
            }
        });
        ran=monEditor.getSelection();
        sendData(1,ran,roomId1);
      }
  });    
  });