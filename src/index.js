const groupName = document.getElementById('group-name');
const groupCreateBtn = document.getElementById('group-create-btn');
const groupError = document.getElementById('group-error');
let groupList = document.getElementById('group-list');
groupCreateBtn.addEventListener('click',function(){
    let randomId = Date.now();
    if (groupName.value.trim() === ''){
        groupError.style.display="block";
    }else{
        groupName.value = groupName.value.trim()[0].toUpperCase() + groupName.value.trim().slice(1);
        groupList.innerHTML+=`<li id=${randomId}>${groupName.value}</li>`
        groupName.value='';
        groupError.style.display = "none";
    }
});
