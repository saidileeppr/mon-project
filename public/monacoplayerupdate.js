function realTime(op,ranges,texts,roomId1=''){
    require(["vs/editor/editor.main"],function () {
        monEditor.updateOptions({
            "readOnly": false
        });
        if(op==2 || op==3){
            if(op==3){
                model.setValue("");
            }
            var changes=[];
            for(i=0;i<ranges.length;i++){
                var ran=new monaco.Range(ranges[i][0],ranges[i][1],ranges[i][2],ranges[i][3]);
                changes.push({identifier: "my-source",range:ran,text:texts[i],forceMoveMarkers:true});
            }
            //console.log(changes);
            monEditor.executeEdits('my-source',changes);
        }
        else if(op==1){
            //ran=new monaco.Range(ranges[0][0],ranges[0][1],ranges[0][2],ranges[0][3]);
            //monEditor.setSelection(ran);
        }
            monEditor.updateOptions({
                "readOnly": true
            });
    });
}