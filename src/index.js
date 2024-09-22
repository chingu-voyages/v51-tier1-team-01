const groupCreateBtn = document.getElementById('group-create-btn');
const groupName = document.getElementById('group-name');
const addAnotherMember = document.getElementById('add-another-member');
const groupError = document.getElementById('group-error');
const fromUserInput = document.querySelector('#from-user input');
const groupForm = document.querySelector('#group-form');
let groupList = document.getElementById('group-list');
let membersList = document.getElementById('members-list');
let memberInputs = document.getElementById('member-inputs');
let membersArray = [];
let allgroupObject = {};

groupForm.addEventListener('submit',handleGroup);
function handleGroup(e) {
    e.preventDefault();
}

function createListItem(content){
    const element = document.createElement('li');
    element.textContent = titleCase(content);
    return element;
}

function addMemberInputField(count){
    const newMemberInput = document.createElement('input');
    newMemberInput.className = 'group-member';
    newMemberInput.placeholder = "Member";
    memberInputs.appendChild(newMemberInput);
}

function inputValidation(groupName,groupMembers){
    let allFilled = true;
    groupMembers.forEach(member=>{
        if(isEmpty(member.value)){
            allFilled = false;
            errorInputStyle();
        }
    });

    return (isEmpty(groupName.value)||!allFilled) ? false:true;
}

function errorInputStyle() {
    fromUserInput.style.borderColor = "red";
}

function titleCase(word){
    word  = word.trim()[0].toUpperCase()+word.trim().slice(1).toLowerCase();
    return word;
}

function isEmpty(value){
    return value.trim()==='';
}

function clearInputField(field){
    return field.value="";
}

function createGroupElement(groupName,membersArr,membersList,id){
    const newGroup = createListItem(groupName.value);
    newGroup.id = id;
    groupList.appendChild(newGroup);


    membersList.innerHTML = '';
    membersArr.forEach(member => {
        const memberElement = createListItem(member);
        membersList.appendChild(memberElement);
    });
}
function removeNewInputs(className){
    let nonDefault = document.querySelectorAll('.group-member:not(.default)');
    nonDefault.forEach(field=>field.remove());
}
function handleGroupCreation(){
    let groupObject = {};
    let allMembersInput = document.querySelectorAll('.group-member');
    let randomId = Date.now();

    if (!inputValidation(groupName,allMembersInput)) {
        groupError.style.display = "block";
        return;
    } else {
        groupError.style.display = "none";
        membersArray = [];
        allMembersInput.forEach(input => {
            if (!isEmpty(input.value)) {
                membersArray.push(titleCase(input.value));
                clearInputField(input);
            }
        });
        createGroupElement(groupName,membersArray,membersList,randomId);
        groupObject.groupName = groupName.value;
        groupObject.members = membersArray;
        clearInputField(groupName);
    }
    allgroupObject[randomId] = groupObject;
    console.log(allgroupObject);
    removeNewInputs();
}

groupCreateBtn.addEventListener('click', handleGroupCreation);
addAnotherMember.addEventListener('click', addMemberInputField);
