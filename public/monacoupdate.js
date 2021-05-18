function realTime(op,changes,roomId1=''){
    require(["vs/editor/editor.main"],function () {
        if(op==2){
            monEditor.executeEdits('my-source',changes);
        }
        else if(op==1){
            monEditor.setSelection(changes);
        }
    });
}