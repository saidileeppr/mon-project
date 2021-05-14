function realTime(range,text,roomId1=''){
    console.log(range,text);
    require(["vs/editor/editor.main"],function () {
        monEditor.executeEdits('my-source',[{identifier:"asd",range:range,text:text,forceMoveMarkers:true}]);
    });
}