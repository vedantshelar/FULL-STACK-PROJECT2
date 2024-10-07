// resume section 

const addProjectBtn = document.getElementById('addProjectImgBtn');
const projectsInnerBox2 = document.getElementById('projectsInnerBox2');

addProjectBtn.addEventListener('click',createNewResumeBox);

projectsInnerBox2.addEventListener('click',(e)=>{
    let currBtn = e.target.tagName;
    
    if(currBtn==='BUTTON'){
        e.target.parentElement.remove();
    }
    
    
})

// fuction to add new project in project section

function createNewResumeBox(){
    const projectsInnerBox2 = document.getElementById('projectsInnerBox2');
    let resumeBoxDiv = document.createElement('div');
    resumeBoxDiv.classList.add('resumeBox');
    let inputField = document.createElement('input');
    inputField.setAttribute('type','file');
    inputField.setAttribute('name','resumeImgs');
    let removeBtn = document.createElement('button');
    removeBtn.innerText="REMOVE";
    removeBtn.setAttribute('type','button');
    removeBtn.classList.add('removeResumeImgBtn');
    resumeBoxDiv.append(inputField);
    resumeBoxDiv.append(removeBtn);
    projectsInnerBox2.append(resumeBoxDiv);
    let uploadResumeBtn = document.createElement('INPUT');
    uploadResumeBtn.setAttribute('type','submit');
    uploadResumeBtn.setAttribute('value','UPLOAD IMAGES');
    uploadResumeBtn.setAttribute('id','uploadResumeBtn');
    let uploadResumeImgBtn = document.getElementById('uploadResumeBtn');
    if(!uploadResumeImgBtn){
        console.log("not");
        projectsInnerBox2.after(uploadResumeBtn);
    }
} 

