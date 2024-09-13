let groupNameInput = document.getElementById('group-name');
let groupCreateBtn = document.getElementById('group-create-btn');
let groupList = document.getElementById('group-list');
let storedGroupNames = JSON.parse(localStorage.getItem('groupNames'));
if (storedGroupNames == null){
    storedGroupNames = {}
}
groupCreateBtn.addEventListener('click',function(){
    // to create a random id
    let randomID = Math.floor(Math.random()*1000);
    let groupName = groupNameInput.value;
    groupName = groupName[0].toUpperCase() + groupName.slice(1).toLowerCase()
    storedGroupNames[randomID] = groupName;
    localStorage.setItem('groupNames',JSON.stringify(storedGroupNames));
    groupNameInput.value = '';
    renderGroups();
});

function renderGroups(){
    groupList.innerHTML = '';
    // using forEach to go through each element in the array
    Object.keys(storedGroupNames).forEach(id=>
    {
        groupList.innerHTML+=`<li id=${id}>${storedGroupNames[id]}</li>`
    }
    )
}

renderGroups()
