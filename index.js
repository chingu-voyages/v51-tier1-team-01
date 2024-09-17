const groupName = document.getElementById('group-name');
const groupCreateBtn = document.getElementById('group-create-btn');
const groupError = document.getElementById('group-error');
const memberOne = document.getElementById('member-one');
const memberTwo = document.getElementById('member-two');
let groupList = document.getElementById('group-list');
let membersList = document.getElementById('members-list');
groupCreateBtn.addEventListener('click',function(){
    let randomId = Date.now();
    if (groupName.value.trim() === ''||memberOne.value.trim()===''||memberTwo.value.trim()===''){
        groupError.style.display="block";
    }else{
        groupName.value = groupName.value.trim()[0].toUpperCase() + groupName.value.trim().slice(1);
        memberOne.value = memberOne.value.trim()[0].toUpperCase() + memberOne.value.trim().slice(1);
        memberTwo.value = memberTwo.value.trim()[0].toUpperCase() + memberTwo.value.trim().slice(1);
        const newGroup = document.createElement('li');
        newGroup.textContent = groupName.value;
        newGroup.id = randomId;
        groupList.appendChild(newGroup);
        const memberOneElement = document.createElement('li');
        memberOneElement.textContent = memberOne.value;
        membersList.appendChild(memberOneElement);
        const memberTwoElement = document.createElement('li');
        memberTwoElement.textContent = memberTwo.value;
        membersList.appendChild(memberTwoElement);
        groupName.value='';
        memberOne.value = '';
        memberTwo.value = '';
        groupError.style.display = "none";
    }
});
