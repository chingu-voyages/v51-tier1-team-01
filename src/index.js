const groupCreateBtn = document.getElementById('group-create-btn');
const groupName = document.getElementById('group-name');
const addAnotherMember = document.getElementById('add-another-member');
const groupError = document.getElementById('group-error');

let groupList = document.getElementById('group-list');
let membersList = document.getElementById('members-list');
let memberInputs = document.getElementById('member-inputs');
let membersArray = [];
let allgroupObject = {};

function createListItem(content) {
    const element = document.createElement('li');
    element.textContent = titleCase(content);
    return element;
}

function addMemberInputField() {
    const newMemberInput = document.createElement('input');
    newMemberInput.className = 'group-member';
    newMemberInput.placeholder = "Enter member";
    memberInputs.appendChild(newMemberInput);
}

function inputValidation(groupName, groupMembers) {
    let allFilled = true;
    groupMembers.forEach(member => {
        if (isEmpty(member.value)) {
            allFilled = false;
        }
    });

    return (isEmpty(groupName.value) || !allFilled) ? false : true;
}

function titleCase(word) {
    word = word.trim()[0].toUpperCase() + word.trim().slice(1).toLowerCase();
    return word;
}

function isEmpty(value) {
    return value.trim() === '';
}

function clearInputField(field) {
    return field.value = "";
}

function createGroupElement(groupName, membersArr, membersList, id) {
    const newGroup = createListItem(groupName.value);
    newGroup.id = id;
    groupList.appendChild(newGroup);


    membersList.innerHTML = '';
    membersArr.forEach(member => {
        const memberElement = createListItem(member);
        membersList.appendChild(memberElement);
    });
}
function removeNewInputs(className) {
    let nonDefault = document.querySelectorAll('.group-member:not(.default)');
    nonDefault.forEach(field => field.remove());
}
function handleGroupCreation() {
    let groupObject = {};
    let allMembersInput = document.querySelectorAll('.group-member');
    let randomId = Date.now();

    if (!inputValidation(groupName, allMembersInput)) {
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
        createGroupElement(groupName, membersArray, membersList, randomId);
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


// create new expense 

function createExpense(name, amount, participant) {
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    const nowDate = Date.now();
    return { name, amount, participant, nowDate }
}

const btnAddExpense = document.getElementById("btn-add-expense");
const formAddExpense = document.getElementById("form-add-expense");
const listExpenses = document.getElementById("list-expenses");

btnAddExpense.addEventListener("click", () => {
    formAddExpense.classList.toggle("hidden");
});

const fakeArrayOfExpenses = [];

formAddExpense.addEventListener("submit", (e) => {
    const inputExpenseName = document.getElementById("input-expense");
    const inputExpenseAmount = document.getElementById("input-amount");
    const inputExpenseParticipant = document.getElementById("input-participant");
    const newExpense = createExpense(inputExpenseName.value, inputExpenseAmount.value, inputExpenseParticipant.value);
    fakeArrayOfExpenses.push(newExpense);
    console.log("here", newExpense);
    e.preventDefault();
    console.log("submited..")
    console.table(fakeArrayOfExpenses);
    inputExpenseName.value = "";
    inputExpenseAmount.value = "";
    inputExpenseParticipant.value = "";
    formAddExpense.classList.add("hidden");
    renderExpenses();
})

function renderExpenses() {
    listExpenses.textContent = "";
    fakeArrayOfExpenses.forEach(expense => {
        const listItemExpense = document.createElement("li");
        const nameSpan = document.createElement("span");
        const amountSpan = document.createElement("span");
        const participantSpan = document.createElement("span");
        const dateSpan = document.createElement("span");
        nameSpan.textContent = expense.name;
        amountSpan.textContent = expense.amount;
        participantSpan.textContent = expense.participant;
        dateSpan.textContent = expense.nowDate;
        listItemExpense.appendChild(nameSpan);
        listItemExpense.appendChild(amountSpan);
        listItemExpense.appendChild(participantSpan);
        listItemExpense.appendChild(dateSpan);
        listExpenses.appendChild(listItemExpense);
    })


}


