var range;
var ctrlDown;
var x;
require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' }});
require(["vs/editor/editor.main"],function () {
    
    monEditor = monaco.editor.create(document.getElementById('myInput'),{
        value:"",
        language: "python",
        theme: "vs-dark"
    });
    monEditor.updateOptions({
      "autoIndent": true,
      "formatOnPaste": true,
      "formatOnType": true
  });
  monEditor.onKeyDown(function(event){
    var bol=true;
    x=event.browserEvent.key;
    if(x=='Control'){
      ctrlDown=true;
    }
    else if(x=='Shift'){
      shiftDown=true;
    }
    else if(x=="Enter" && !monEditor.onDidFocusEditorText()){
    }
    else{
      monEditor.onDidChangeModelContent(function(event){
        if(bol){
          range=event.changes[0].range;
          text=event.changes[0].text;
          text.replace('\\r','');
          console.log("keyUp",range,text);
          sendData(range,text,roomId1);
          bol=false;
        }
      });
    }  
  });
  monEditor.onKeyUp(function(event){
    var bol=true;
    x=event.browserEvent.key;
    if(x=='Control'){
      event.preventDefault();
      ctrlDown=false;
    }
    else if(x=='Shift'){
      shiftDown=false;
    }
    else{
    }
  });
    monEditor.onDidChangeCursorSelection(function(event){
    });
  });