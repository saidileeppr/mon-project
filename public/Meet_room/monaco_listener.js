var bol;
require(["vs/editor/editor.main"],function () {
   var edit;
   monEditor.onMouseUp(function(e){
    console.log(monEditor.getSelection());
  });
  monEditor.onMouseDown(function(e){
    bol=true;        
    monEditor.onDidChangeModelContent(function(event){
          if(bol && canWrite==1){
            edit=event.changes;
            var ranges=[];
            var texts=[];
            for(var i=0;i<event.changes.length;i++){
              ranges.push([event.changes[i].range.startLineNumber,event.changes[i].range.startColumn,event.changes[i].range.endLineNumber,event.changes[i].range.endColumn]);
              texts.push(event.changes[i].text);
            }
            console.log(JSON.stringify(ranges),JSON.stringify(texts));
              sendData(2,ranges,texts,roomDetail.roomId);
              recordAction(2,ranges,texts);
              bol=false;
            }
        });
  });
  monEditor.onKeyUp(function(e){
    console.log(monEditor.getSelection());
  });
  monEditor.onKeyDown(function(e){
      bol=true;
      x=e.browserEvent.key;
      if(x=="Enter" && !monEditor.onDidFocusEditorText()){
      }
      else{
bol=true;edit=[];
        monEditor.onDidChangeModelContent(function(event){
          if(bol && canWrite ==1 && edit!=event.changes){
          var ranges=[];
          var texts=[];
            for(var i=0;i<event.changes.length;i++){
              ranges.push([event.changes[i].range.startLineNumber,event.changes[i].range.startColumn,event.changes[i].range.endLineNumber,event.changes[i].range.endColumn]);
              texts.push([event.changes[i].text]);
            }
              console.log(JSON.stringify(ranges),JSON.stringify(texts));
              sendData(2,ranges,texts,roomDetail.roomId);
              recordAction(2,ranges,texts);
              bol=false;
              edit={};
            }
        });
        
      }
 }); 

  });



  