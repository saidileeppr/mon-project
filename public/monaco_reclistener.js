var range;
var ctrlDown;
var x;
var bol;
var con=true;
require(["vs/editor/editor.main"],function () {
   monEditor.onMouseUp(function(e){
  });
  monEditor.onMouseDown(function(e){
bol=true;        
    monEditor.onDidChangeModelContent(function(event){
          if(bol){
            edit=event.changes;
            var ranges=[];
            var texts=[];
            for(var i=0;i<event.changes.length;i++){
              ranges.push([event.changes[i].range.startLineNumber,event.changes[i].range.startColumn,event.changes[i].range.endLineNumber,event.changes[i].range.endColumn]);
              texts.push(event.changes[i].text);
            }
              console.log(ranges,texts,event.changes);
              recordAction(2,ranges,texts);
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
          var ranges=[];
          var texts=[];
            for(var i=0;i<event.changes.length;i++){
              ranges.push([event.changes[i].range.startLineNumber,event.changes[i].range.startColumn,event.changes[i].range.endLineNumber,event.changes[i].range.endColumn]);
              texts.push([event.changes[i].text]);
            }
              console.log(changes,event.changes);
              recordAction(2,ranges,texts);
              bol=false;
              edit={};
            }
        });
      }
  });    
  });