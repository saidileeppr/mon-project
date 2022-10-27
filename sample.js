var roomDetail={"a":[],"b":[],"c":[],"d":[],"e":[],"f":[],"g":[],"h":[],"i":[],"j":[],"k":[],"l":[],"m":[],"n":[],
"o":[],"p":[],"q":[],"r":[],"s":[],"t":[],"u":[],"v":[],"w":[],"x":[],"y":[],"z":[],"el":[]};
var socketDetail={"a":[],"b":[],"c":[],"d":[],"e":[],"f":[],"g":[],"h":[],"i":[],"j":[],"k":[],"l":[],"m":[],"n":[],
"o":[],"p":[],"q":[],"r":[],"s":[],"t":[],"u":[],"v":[],"w":[],"x":[],"y":[],"z":[],"el":[]};
roomDetail.insertData({"userId":"abcd","socketId":"jgf","name":"brave"});

roomDetail.insertData({"userId":"abcd1","socketId":"jgf1","name":"brave1"});

roomDetail.insertData({"userId":"abcd2","socketId":"jgf2","name":"brave2"});

roomDetail.insertData({"userId":"abcd3","socketId":"jgf3","name":"brave3"});

roomDetail.insertData({"userId":"abcd4","socketId":"jgf4","name":"brave4"});

roomDetail.insertData({"userId":"abcd5","socketId":"jgf5","name":"brave5"});
function insertData(inpJSON,roomId){
    hash=roomId[0];
    soc=inpJSON["socketId"];
    if(roomDetail[hash]){
        roomDetail[hash].push({roomId:inpJSON});
        socketDetail[hash].push({soc:roomId});
    }
    else{
        roomDetail[hash].push({roomId:inpJSON});
        socketDetail[hash].push({soc:roomId});
    }
}
function findInd(arr,field,value){
    arr=arr
var ind=arr.findIndex(
    function(arr){return arr[field] == value}
);
return ind;
}

function findField(arr,givenField,givenValue,reqField){
var value= arr.filter(
    function(arr){return arr[givenField] == givenValue}
);
return value[0][reqField];
}

function delObj(arr,field,value){
    ind=findInd(arr,field,value);
    arr.splice(ind,1);
}
console.log(findField(roomDetail,"userId","abcd3","socketId"));
delObj(roomDetail,"userId","abcd3");
console.log(roomDetail);
for(i=97;i<=122;i++){
    console.log("\""+String.fromCharCode(i)+"\":\[\],")
}