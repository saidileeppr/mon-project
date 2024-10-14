let  range;
let  ctrlDown;
let  x;
let  bol;
let  con=true;
let edit;
require.config({ paths: { 'vs': '/monaco-editor/min/vs' }});
require(["vs/editor/editor.main"],function () {
   monEditor.onMouseUp(function(e){
  });
  monEditor.onMouseDown(function(e){
bol=true;        
    monEditor.onDidChangeModelContent(function(event){
          if(bol){
            edit=event.changes;
            let  ranges=[];
            let  texts=[];
            for(const element of event.changes){
              ranges.push([element.range.startLineNumber,element.range.startColumn,element.range.endLineNumber,element.range.endColumn]);
              texts.push(element.text);
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
      if(x=="Enter" && !monEditor.onDidFocusEditorText()){ /* empty */ }
      else{
        monEditor.onDidChangeModelContent(function(event){
          if(bol && edit!=event.changes){
          let  ranges=[];
          let  texts=[];
            for(const element of event.changes){
              ranges.push([element.range.startLineNumber,element.range.startColumn,element.range.endLineNumber,element.range.endColumn]);
              texts.push([element.text]);
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