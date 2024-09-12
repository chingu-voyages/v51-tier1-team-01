let groupName = document.getElementById('group-name');
let groupCreateBtn = document.getElementById('group-create-btn');
let groupList = document.getElementById('group-list');
groupCreateBtn.addEventListener('click',function(){
    // console.log(groupName.value);
    groupList.innerHTML+=`<li>${groupName.value}</li>`
});
