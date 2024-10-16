let bol;
require(["vs/editor/editor.main"],function () {
  let edit;
   monEditor.onMouseUp(function(e){
    console.log(monEditor.getSelection());
  });
  monEditor.onMouseDown(function(e){
    bol=true;        
    monEditor.onDidChangeModelContent(function(event){
          if(bol && canWrite==1){
            edit=event.changes;
            let ranges=[];
            let texts=[];
            for(const element of event.changes){
              ranges.push([element.range.startLineNumber,element.range.startColumn,element.range.endLineNumber,element.range.endColumn]);
              texts.push(element.text);
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
      let x=e.browserEvent.key;
      if(x=="Enter" && !monEditor.onDidFocusEditorText()){ /* empty */ }
      else{
        bol=true;
        edit=[];
        monEditor.onDidChangeModelContent(function(event){
          if(bol && canWrite ==1 && edit!=event.changes){
          let ranges=[];
          let texts=[];
            for(const element of event.changes){
              ranges.push([element.range.startLineNumber,element.range.startColumn,element.range.endLineNumber,element.range.endColumn]);
              texts.push([element.text]);
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



  