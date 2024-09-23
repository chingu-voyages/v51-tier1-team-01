const groupCreateBtn = document.getElementById('group-create-btn');
const groupName = document.getElementById('group-name');
const addAnotherMember = document.getElementById('add-another-member');
const groupError = document.getElementById('group-error');
const groupForm = document.querySelector('#group-form');
const fromUserInput = document.querySelector("#from-user input");
const sidebarAddGroup = document.getElementById('sidebar-add-group');
let groupList = document.getElementById('group-list');
let membersList = document.getElementById('members-list');
let memberInputs = document.getElementById('member-inputs');
let membersArray = [];
let allgroupObject = {};
// let memberCount = 2; // used for the id

function handleForm(e) {
    e.preventDefault();
}

function createListItem(content){
    const element = document.createElement('li');
    element.textContent = titleCase(content);
    return element;
}

function addMemberInputField(){
    const newMemberInput = document.createElement('input');
    newMemberInput.className = 'group-member';
    newMemberInput.placeholder = 'Add Member';
    // newMemberInput.placeholder = `Member ${memberCount+1}`;
    // newMemberInput.id = `member-${memberCount+1}`;
    memberInputs.appendChild(newMemberInput);
    // memberCount++;
}

function defaultBorder(element){
    const validName = document.getElementById(element);
    validName.style.borderColor = "#006091";
}
function errorInputStyle(element) {
    const invalidName = document.getElementById(element);
    invalidName.style.borderColor = "red";
}

function inputValidation (groupName,groupMembers){
    let membersFilled = 0;
    groupMembers.forEach(member=>{
        if(!isEmpty(member.value)){
            // console.log(member.className);
            membersFilled++;
        }else{
            if(member.className.includes('default')){
                errorInputStyle(member.id);
            }
        }
    })
        if(isEmpty(groupName.value)){
            errorInputStyle(groupName.id);
        }
    return (isEmpty(groupName.value)||membersFilled<2) ? false:true;
}

// function inputValidation(groupName,groupMembers){
//     // let allFilled = true;
//     let membersFilled = 0;
//     groupMembers.forEach(member=>{
//         if(!isEmpty(member.value)){
//             // allFilled = false;
//             membersFilled++;
//             console.log(member.className);
//             defaultBorder(member.id);
//         }
//         // else{
//         //     errorInputStyle(member.id);
//         // }
//         if(isEmpty(groupName.value)){
//             errorInputStyle(groupName.id);
//         }else{
//             defaultBorder(groupName.id);
//         }
//     });
//     return (isEmpty(groupName.value)||membersFilled<2) ? false:true;
// }



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
function handleGroupCreation(e){

    // e.preventDefault();
    let groupObject = {};
    let allMembersInput = document.querySelectorAll('.group-member');
    let randomId = Date.now();
    if (!inputValidation(groupName,allMembersInput)) {
        groupError.style.display = "block";
        return;
    }
    else {
        fromUserInput.style.borderColor = "#006091"
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
        groupForm.style.display = "none";
    }
    allgroupObject[randomId] = groupObject;
    console.log(allgroupObject);
    removeNewInputs();
}
function showForm(){
    groupForm.style.display = "block";
}

sidebarAddGroup.addEventListener('click',showForm);
groupForm.addEventListener('submit',handleForm);
// groupForm.addEventListener('submit',handleGroupCreation);
groupCreateBtn.addEventListener('click', handleGroupCreation);
addAnotherMember.addEventListener('click', addMemberInputField);
