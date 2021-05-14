var range;
var ctrlDown;
var x;
var bol;
var con=true;
require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' }});
require(["vs/editor/editor.main"],function () {
  var model=monaco.editor.createModel(
    "",
    "python"
);
var modelContent=model.getValue();
    monEditor = monaco.editor.create(document.getElementById('myInput'),{
        model,
        language: "python",
        theme: "vs-dark"
    });
    monEditor.updateOptions({
      "autoIndent": true,
      "formatOnPaste": true,
      "formatOnType": true
  });
  monEditor.onKeyDown(function(event){
      bol=true;
      var pos=monEditor.getPosition();
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
            console.log("keyDown",range,text);
            sendData(range,text,roomId1,x);
            bol=false;
          }
        });
      }
  });
    monEditor.onDidChangeCursorSelection(function(event){
    });
  });