const groupName = document.getElementById('group-name');
const groupCreateBtn = document.getElementById('group-create-btn');
const addAnotherMember = document.getElementById('add-another-member');
const groupError = document.getElementById('group-error');
// const memberOne = document.getElementById('member-one');
// const memberTwo = document.getElementById('member-two');
let groupList = document.getElementById('group-list');
let membersList = document.getElementById('members-list');
let memberInputs = document.getElementById('member-inputs');
let allgroupObject = {};

let membersArray = [];

// demo structure
/*
groupObject = {
    name: "Group Name"
    id: "1"
   members: ["Jessy Doe", "John Doe", "Jafar Doe", "Jane Doe"]

    }
*/

groupCreateBtn.addEventListener('click', function () {
    let groupObject = {};
    // let allMembersInput = document.querySelectorAll('.group-member:not(#member-one):not(#member-two)');
    let allMembersInput = document.querySelectorAll('.group-member');
    let randomId = Date.now();
    let allFilled = true;

    // if (memberOne.value.trim() === '' || memberTwo.value.trim() === '') {
    //     allFilled = false;
    // }

    allMembersInput.forEach(input => {
        if (input.value.trim() === '') {
            allFilled = false;
        }
    });

    if (groupName.value.trim() === '' || allFilled === false) {
        groupError.style.display = "block";
    } else {
        groupError.style.display = "none";


        membersArray = [];
        // membersArray.push(titleCase(memberOne.value));
        // membersArray.push(titleCase(memberTwo.value));
        // membersArray.push(memberOne.value.trim()[0].toUpperCase() + memberOne.value.trim().slice(1));
        // membersArray.push(memberTwo.value.trim()[0].toUpperCase() + memberTwo.value.trim().slice(1));


        allMembersInput.forEach(input => {
            if (input.value.trim() !== '') {
                membersArray.push(titleCase(input.value));
                input.value = '';
                // membersArray.push(input.value.trim()[0].toUpperCase() + input.value.trim().slice(1).toLowerCase());
            }
        });

        const newGroup = createElement('li',groupName.value);
        // const newGroup = document.createElement('li');
        // newGroup.textContent = titleCase(groupName.value);
        // newGroup.textContent = groupName.value.trim()[0].toUpperCase() + groupName.value.trim().slice(1);
        newGroup.id = randomId;
        groupList.appendChild(newGroup);


        membersList.innerHTML = '';
        membersArray.forEach(member => {
            const memberElement = createElement('li',member);
            // const memberElement = document.createElement('li');
            // memberElement.textContent = member;
            membersList.appendChild(memberElement);
        });
        console.log(groupName.value)
        groupObject.groupName = groupName.value;
        groupObject.members = membersArray;

        groupName.value = '';
        // memberOne.value = '';
        // memberTwo.value = '';
        // allMembersInput.forEach(input => input.value = '');
    }
    console.log(groupObject);
    allgroupObject[randomId] = groupObject;
    console.log(allgroupObject);
});

function createElement(elementType,content){
    const element = document.createElement(elementType);
    element.textContent = titleCase(content);
    return element;
}

function titleCase(word){
    word  = word.trim()[0].toUpperCase()+word.trim().slice(1).toLowerCase();
    return word;
}

addAnotherMember.addEventListener('click', function () {
    const newMemberInput = document.createElement('input');
    newMemberInput.className = 'group-member';
    newMemberInput.placeholder = "Enter member";
    memberInputs.appendChild(newMemberInput);
});
