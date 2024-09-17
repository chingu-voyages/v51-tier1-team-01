const groupName = document.getElementById('group-name');
const groupCreateBtn = document.getElementById('group-create-btn');
const addAnotherMember = document.getElementById('add-another-member');
const groupError = document.getElementById('group-error');
const memberOne = document.getElementById('member-one');
const memberTwo = document.getElementById('member-two');
let groupList = document.getElementById('group-list');
let membersList = document.getElementById('members-list');
let memberInputs = document.getElementById('member-inputs');

groupCreateBtn.addEventListener('click', function () {
    let allMembersInput = document.querySelectorAll('.group-member:not(#member-one):not(#member-two)');
    let randomId = Date.now();
    let allFilled = true;

    if (memberOne.value.trim() === '' || memberTwo.value.trim() === '') {
        allFilled = false;
    }

    allMembersInput.forEach(input => {
        if (input.value.trim() === '') {
            allFilled = false;
        }
    });

    if (groupName.value.trim() === '' || allFilled === false) {
        groupError.style.display = "block";
    } else {
        groupError.style.display = "none";
        groupName.value = groupName.value.trim()[0].toUpperCase() + groupName.value.trim().slice(1);
        memberOne.value = memberOne.value.trim()[0].toUpperCase() + memberOne.value.trim().slice(1);
        memberTwo.value = memberTwo.value.trim()[0].toUpperCase() + memberTwo.value.trim().slice(1);
        const newGroup = document.createElement('li');
        newGroup.textContent = groupName.value;
        newGroup.id = randomId;
        groupList.appendChild(newGroup);
        membersList.innerHTML = '';
        const memberOneElement = document.createElement('li');
        memberOneElement.textContent = memberOne.value;
        membersList.appendChild(memberOneElement);
        const memberTwoElement = document.createElement('li');
        memberTwoElement.textContent = memberTwo.value;
        membersList.appendChild(memberTwoElement);
        allMembersInput.forEach(input => {
                const memberName = input.value.trim()[0].toUpperCase() + input.value.trim().slice(1).toLowerCase();
                const memberElement = document.createElement('li');
                memberElement.textContent = memberName;
                membersList.appendChild(memberElement);
        });
        groupName.value = '';
        memberOne.value = '';
        memberTwo.value = '';
        allMembersInput.forEach(input => input.value = '');
    }
});

addAnotherMember.addEventListener('click', function () {
    const newMemberInput = document.createElement('input');
    newMemberInput.className = 'group-member';
    newMemberInput.placeholder = "Enter member";
    memberInputs.appendChild(newMemberInput);
});
