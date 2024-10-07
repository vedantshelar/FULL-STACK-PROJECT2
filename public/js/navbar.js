const bar = document.getElementById('bar');
const cross = document.getElementById('cross');
const headerBox2 = document.querySelector('.headerBox2');

bar.addEventListener('click',()=>{
    cross.style.display="block";
    bar.style.display="none";
    headerBox2.style.display="flex"; 
    headerBox2.style.right="0px";
}) 

cross.addEventListener('click',()=>{
    bar.style.display="block";
    cross.style.display="none"; 
    headerBox2.style.display="none";
    headerBox2.style.right="-100%";
}) 