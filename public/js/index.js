
let SearchInp = document.getElementById('headerSearchInp');
let homePageProfileBox = document.getElementsByClassName('homePageProfileBox');

SearchInp.addEventListener('input',()=>{
    const inputStudYear = SearchInp.value.toUpperCase();
    
    for(studProfile of homePageProfileBox){
        let studYear = studProfile.getElementsByClassName('homePageProfileStudYears')[0].innerText;
        const inputStudYear = SearchInp.value.toUpperCase();
        if(studYear.indexOf(inputStudYear)!=-1){
           studProfile.style.display="flex"; 
        }else{
            studProfile.style.display="none"; 
        }
    }
    
})
 