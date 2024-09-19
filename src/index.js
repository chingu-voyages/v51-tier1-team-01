const groupCreateBtn = document.getElementById('group-create-btn');
const groupName = document.getElementById('group-name');
const addAnotherMember = document.getElementById('add-another-member');
const groupError = document.getElementById('group-error');

let groupList = document.getElementById('group-list');
let membersList = document.getElementById('members-list');
let memberInputs = document.getElementById('member-inputs');
let membersArray = [];
let allgroupObject = {};

function makeElement(elementType,content){
    const element = document.createElement(elementType);
    element.textContent = titleCase(content);
    return element;
}

function addMemberInputField(){
    const newMemberInput = document.createElement('input');
    newMemberInput.className = 'group-member';
    newMemberInput.placeholder = "Enter member";
    memberInputs.appendChild(newMemberInput);
}

function inputValidation(groupName,groupMembers){
    let allFilled = true;
    groupMembers.forEach(member=>{
        if(isEmpty(member.value)){
            allFilled = false;
        }
    });
    if (isEmpty(groupName.value) || allFilled === false) {
        return false;
    }

    return true;
}

function titleCase(word){
    word  = word.trim()[0].toUpperCase()+word.trim().slice(1).toLowerCase();
    return word;
}

function isEmpty(value){
    if (value.trim()===''){
        return true;
    }else{
        return false;
    }
}

function clearInputField(field){
    return field.value="";
}

function createGroupElement(groupName,membersArr,membersList,id){
    const newGroup = makeElement('li',groupName.value);
    newGroup.id = id;
    groupList.appendChild(newGroup);


    membersList.innerHTML = '';
    membersArr.forEach(member => {
        const memberElement = makeElement('li',member);
        membersList.appendChild(memberElement);
    });
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
}

groupCreateBtn.addEventListener('click', handleGroupCreation);
addAnotherMember.addEventListener('click', addMemberInputField);
