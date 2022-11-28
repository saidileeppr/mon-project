but1=document.getElementById('Submit');
page_url=window.location.href;
function joinRoom(){
    window.location.replace( window.location.href+'meet/'+$('#roomId').val());
}
async function  login(){
    userId=document.getElementById('luserId');
    password=document.getElementById('lPassword');
    try{
    res=await axios.post(page_url+'login',{userId: userId.value,password:password.value});
    if(res.status==201){
        alert("User Exists")
    }
    }
    catch(err){
        if(err.response.status==400){
            alert("User Credentials do not match");
        }
    }
}
async function signUp(){
    userId=document.getElementById('suserId');
    password=document.getElementById('sPassword');
    username=document.getElementById('susername');
    try{
    res=await axios.post(page_url+'signup',{userId: userId.value,password:password.value, username:username.value});
    if(res.status==201){
        alert("User Profile Created")
    }
    }
    catch(err){
        if(err.response.status==400){
            alert("UserId Exists");
        }
    }
}
