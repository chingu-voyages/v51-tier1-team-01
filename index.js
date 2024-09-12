let groupName = document.getElementById('group-name');
let groupCreateBtn = document.getElementById('group-create-btn');
let groupList = document.getElementById('group-list');
groupCreateBtn.addEventListener('click',function(){
    // to create a random id
    let randomID = Math.floor(Math.random()*1000);
    groupList.innerHTML+=`<li id=${randomID}>${groupName.value}</li>`
    let storedGroupNames = JSON.parse(localStorage.getItem('groupNames'));
    if (storedGroupNames == null){
        storedGroupNames = {}
    }
    storedGroupNames[randomID] = groupName.value;
    // console.log(storedGroupNames);
    localStorage.setItem('groupNames',JSON.stringify(storedGroupNames));
    groupName.value = '';
});
