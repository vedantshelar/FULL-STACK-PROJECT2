const addProjectBtn = document.getElementById('addProjectBtn');
const createNewProjectFormInnerBox2 = document.getElementById('createNewProjectFormInnerBox2');

addProjectBtn.addEventListener('click',createNewProjectBox);

createNewProjectFormInnerBox2.addEventListener('click',(e)=>{
    let currBtn = e.target.tagName;
    
    if(currBtn==='BUTTON'){
        e.target.parentElement.remove();
    }
    
    
})

// fuction to add new project in project section

function createNewProjectBox(){
    let createNewProjectFormInnerBox2 = document.getElementById('createNewProjectFormInnerBox2'); 
    let projectBoxDiv = document.createElement('div');
    projectBoxDiv.classList.add('projectBox');
    let inputField = document.createElement('input');
    inputField.setAttribute('type','file');
    inputField.setAttribute('name','projectImgs');
    let removeBtn = document.createElement('button');
    removeBtn.innerText="REMOVE";
    removeBtn.setAttribute('type','button');
    removeBtn.classList.add('removeProjectBtn');
    projectBoxDiv.append(inputField);
    projectBoxDiv.append(removeBtn);
    createNewProjectFormInnerBox2.append(projectBoxDiv);
}

