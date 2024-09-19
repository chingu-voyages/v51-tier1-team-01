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

function titleCase(word){
    word  = word.trim()[0].toUpperCase()+word.trim().slice(1).toLowerCase();
    return word;
}

function checkEmpty(value){
    if (value.trim()===''){
        return false;
    }else{
        return true;
    }
}

function newMember(){
    const newMemberInput = document.createElement('input');
    newMemberInput.className = 'group-member';
    newMemberInput.placeholder = "Enter member";
    memberInputs.appendChild(newMemberInput);
}

groupCreateBtn.addEventListener('click', function () {
    let groupObject = {};
    let allMembersInput = document.querySelectorAll('.group-member');
    let randomId = Date.now();
    let allFilled = true;


    allMembersInput.forEach(input => {
        if (!checkEmpty(input.value)) {
            allFilled = false;
        }
    });

    if (!checkEmpty(groupName.value) || allFilled === false) {
        groupError.style.display = "block";
    } else {
        groupError.style.display = "none";


        membersArray = [];
        allMembersInput.forEach(input => {
            if (checkEmpty(input.value)) {
                membersArray.push(titleCase(input.value));
                input.value = '';
            }
        });

        const newGroup = makeElement('li',groupName.value);
        newGroup.id = randomId;
        groupList.appendChild(newGroup);


        membersList.innerHTML = '';
        membersArray.forEach(member => {
            const memberElement = makeElement('li',member);
            membersList.appendChild(memberElement);
        });
        console.log(groupName.value)
        groupObject.groupName = groupName.value;
        groupObject.members = membersArray;

        groupName.value = '';
    }
    console.log(groupObject);
    allgroupObject[randomId] = groupObject;
    console.log(allgroupObject);
});


addAnotherMember.addEventListener('click', newMember);
