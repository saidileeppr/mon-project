var roomDetail={};
var socketDetail={"a":[],"b":[],"c":[],"d":[],"e":[],"f":[],"g":[],"h":[],"i":[],"j":[],"k":[],"l":[],"m":[],"n":[],
"o":[],"p":[],"q":[],"r":[],"s":[],"t":[],"u":[],"v":[],"w":[],"x":[],"y":[],"z":[],"el":[]};
insertData({"userId":"abcd","socketId":"jgf","name":"brave"},'agh');

insertData({"userId":"abcd1","socketId":"jgf1","name":"brave1"},'agh');

insertData({"userId":"abcd2","socketId":"jgf2","name":"brave2"},'agh');

insertData({"userId":"abcd3","socketId":"jgf3","name":"brave3"},'bhgh');

insertData({"userId":"abcd4","socketId":"jgf4","name":"brave4"},'bhgh');

insertData({"userId":"abcd5","socketId":"jgf5","name":"brave5"},'bhgh');
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
function findInd(arr,field,value,roomId){
    arr=arr[roomId[0]];
var ind=arr.findIndex(
    function(arr){return arr[field] == value}
);
return ind;
}

function findField(arr,givenField,givenValue,reqField,roomId){
    console.log(roomId[0]);
    arr=arr[roomId[0]];
    console.log(arr);
var value= arr.filter(
    function(arr){return arr[givenField] == givenValue}
);
console.log(value);
return value[0][reqField];
}

function delObj(arr,field,value,roomId){
    arr=arr[roomId[0]];
    ind=findInd(arr,field,value);
    arr.splice(ind,1);
}
console.log(findField(roomDetail,"userId","abcd3","socketId",'bhgh'));
delObj(roomDetail,"userId","abcd3",'bhgh');
console.log(roomDetail);