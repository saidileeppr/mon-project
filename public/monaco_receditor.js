var rec='';
var arr='';
var arriter=0;
var langg=document.getElementById("langg");
var audFile;
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs' }});
require(["vs/editor/editor.main"],function () {
  model=monaco.editor.createModel(
  "",
  "python"
);
  monEditor = monaco.editor.create(document.getElementById('myInput'),{
      model,
      theme: "vs-dark"
  });
  monEditor.updateOptions({
    "autoIndent": true,
    "formatOnPaste": true,
    "formatOnType": true,
});
});

langg.onchange=function(){
  require(["vs/editor/editor.main"],function () {
    monaco.editor.setModelLanguage(model,langg.value);
    console.log(langg.value);
  });
};

function muteFun(id){
  alert(id);
}