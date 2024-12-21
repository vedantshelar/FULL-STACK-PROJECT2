let removeMsgBtn = document.getElementById("removeMsg");

window.onload = function(){
    setTimeout(()=>{
removeMsgBtn.parentElement.remove();
    },10000);
}

removeMsgBtn.addEventListener("click",(e)=>{
    const parentElement = e.target.parentElement;
    parentElement.remove();
})