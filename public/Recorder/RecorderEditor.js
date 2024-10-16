let  languageSelector=document.getElementById("languageSelector");
let model;
let monEditor;
//Populate Languages for Editor
let languageList=['python','java','c']
languageList.forEach(lang => {
  const option = document.createElement('option');
  option.value = lang;
  option.text = lang;
  languageSelector.appendChild(option);
});
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

languageSelector.onchange=function(){
  require(["vs/editor/editor.main"],function () {
    monaco.editor.setModelLanguage(model,languageSelector.value);
  });
};

function muteFun(id){
  alert(id);
}