let  langg=document.getElementById("langg");
let  audFile;
let model;
let monEditor;
require.config({ paths: { 'vs': '/monaco-editor/min/vs' }});
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