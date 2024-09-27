import { totalCalc } from "./calcs.js";

const groupCreateBtn = document.getElementById('group-create-btn');
const groupName = document.getElementById('group-name');
const addAnotherMember = document.getElementById('add-another-member');
const groupError = document.getElementById('group-error');
const groupForm = document.querySelector('#group-form');
const closeGroupForm = document.getElementById("close-group-form");
const fromUserInput = document.querySelector("#from-user input");
const sidebarAddGroup = document.getElementById('sidebar-add-group');
const selectedGroup = document.getElementById("selected-group");
const groupInfoNav = document.getElementById("group-info-nav");
const selectedGroupInfoContainer = document.getElementById("group-info-container");
let groupList = document.getElementById('group-list');
let friendsList = document.getElementById('friends-list');
let memberInputs = document.getElementById('member-inputs');

const btnAddExpense = document.getElementById("btn-add-expense");
const formAddExpense = document.getElementById("form-add-expense");
const listExpenses = document.getElementById("list-expenses");



// array with all friends

const friendsArr = [];

// fake data
friendsArr.push(createFriend("Jane Doe"), createFriend("John Doe"), createFriend("Jessy Doe"), createFriend("Jafar Doe"));


// array with all groups, don't forget to delete fake data
const groupsArr = [{

	groupName: "Fake Group 1",
	id: Date.now(),
	avatar: "src/img/group-icon.png",
	membersArr: [friendsArr[0], friendsArr[1]],
	expenses:[createExpense("Bali", 1000, "Jane"), createExpense("Shmali", 2000, "John")]
},
{
	groupName: "Fake Group 2",
	id: Date.now() + 1,
	avatar: "src/img/group-icon.png",
	membersArr: [friendsArr[2], friendsArr[3]],
	expenses:[createExpense("Movie Night", 200, "John"), createExpense("Boat Tour", 2000, "John")]
}
];

let selectedGroupIndex = 0;

//render first existing group by default or show form
if(groupsArr.length) {
	hideForm()
	renderSelectedGroupInfo(groupsArr[selectedGroupIndex]);
} else {
	showForm();
}
//rendering of existing data from localStorage on page load
renderFriends();
renderGroups();


//events
//form events
groupForm.addEventListener('submit', handleGroupCreation);
closeGroupForm.addEventListener("click", hideForm)
sidebarAddGroup.addEventListener('click', showForm);
groupCreateBtn.addEventListener('click', handleGroupCreation);
addAnotherMember.addEventListener('click', addMemberInputField);

//rendered group events: listen and render selected group on main section
groupList.addEventListener("click", handleGroupClick)


function handleGroupClick(e) {
	console.log(e.target.id)
	groupsArr.forEach(group => {
        console.log(Number(group.id))
        if (e.target.id == Number(group.id)) {
            selectedGroupIndex = groupsArr.indexOf(group);
            renderSelectedGroupInfo(group)
        }
		// return Number(e.target.id) === Number(group.id) ? renderSelectedGroupInfo(group) : ""
	})
}

function renderSelectedGroupInfo(group) {
console.log("Inside renderSelectedGroup function")
const {groupName, id, avatar, membersArr, expenses} = group;
selectedGroup.innerHTML = "";
renderExpenses(groupsArr[selectedGroupIndex]); // Jelena added probably temporary
	let friendsImages = membersArr.map(member => {
		return `<img src=${member.imgSrc} alt="Friend icon" class="group-title-friends-img">`
	})
return selectedGroup.innerHTML += `
	<div class="section-main-group-header">
				<div>
					<h2 class="section-main-group-title">${groupName} 🖋️</h2>
					<p class="text-small">${membersArr.map(member => member.name).join(", ")}</p>
					${friendsImages.join(" ")}
					<p class="badge badge-unpaid">You are owed $3,456</p>
			    </div>
				<img src=${avatar} alt="Group icon">
	</div>
`

}

//Live testing group calculations
groupsArr.forEach(group => console.log(`Total outstanding = $${totalCalc(group)}`))

//creating html list templates

function createListItem(content) {

    const element = document.createElement('li');
    element.textContent = titleCase(content);
    return element;
}

function titleCase(text) {
    const words = text.split(" ");
    return words.map(word => word[0].toUpperCase() + word.substring(1).toLowerCase()).join(" ")
}

function addImg(avatar) {
    const groupImg = document.createElement("img")
    groupImg.setAttribute("src", avatar)
    groupImg.classList.add("group-icon")
    return groupImg;
}

//manage group form

function showForm() {
    groupForm.style.display = "block";
    fromUserInput.style.borderColor = "#006091";
    document.querySelectorAll('.default').forEach(member=>{
        defaultBorder(member.id);
    })
}

function hideForm() {
	groupForm.style.display = "none";
	return;
}

//manage fields
function addMemberInputField() {
    const newMemberInput = document.createElement('input');
    newMemberInput.className = 'group-member';
    newMemberInput.placeholder = 'Add Member';
    // newMemberInput.placeholder = `Member ${memberCount+1}`;
    // newMemberInput.id = `member-${memberCount+1}`;
    memberInputs.appendChild(newMemberInput);
    // memberCount++;
}

function defaultBorder(element) {
    const validName = document.getElementById(element);
    validName.style.borderColor = "#006091";
}
function errorInputStyle(element) {
    const invalidName = document.getElementById(element);
    invalidName.style.borderColor = "red";
}

function clearInputField(field) {
    return field.value = "";
}

function removeNewInputs(className) {
    let nonDefault = document.querySelectorAll('.group-member:not(.default)');
    nonDefault.forEach(field => field.remove());
}

//validation
function inputValidation(groupName, groupMembers) {
    let membersFilled = 0;
    groupMembers.forEach(member => {
        if (!isEmpty(member.value)) {
            // console.log(member.className);
            membersFilled++;
            if(member.className.includes('default')){
                defaultBorder(member.id);
            }
        } else {
            if (member.className.includes('default')) {
                errorInputStyle(member.id);
            }


        }
    })
    if (isEmpty(groupName.value)) {
        errorInputStyle(groupName.id);
    } else {
        defaultBorder(groupName.id);
    }
    return (isEmpty(groupName.value) || membersFilled < 2) ? false : true;
}

// function titleCase(word) {
//     word = word.trim()[0].toUpperCase() + word.trim().slice(1).toLowerCase();
//     return word;
// }

function isEmpty(value) {
    return value.trim() === '';
}

// friend object

function createFriend(name, id = Date.now(), imgSrc = 'src/img/person-icon.png') { // function to create friend object from input
    return { name, id, imgSrc }

}

//group object
function createNewGroup(name) {

    //create new group, push it in groupsArr
    const newGroup = {
        groupName: name,
        id: Date.now(),
        avatar: "src/img/group-icon.png",
        membersArr: [],
        expenses: []
    };
    groupsArr.push(newGroup)
    console.log(groupsArr)
    renderGroups();
    return newGroup; // Jelena added
}

function renderFriends() {
    friendsList.innerHTML = "";
    friendsArr.forEach(friend => {
        const friendElement = createListItem(friend.name)
        friendsList.appendChild(friendElement)
        return
    })
}

function renderGroups() {
	groupList.innerHTML = ""
	groupsArr.map(group => {

		let groupListElement = `
		<li><img src=${group.avatar} alt="group icon" class="group-icon"><a id=${group.id} class="group-link"
                        href="#">${group.groupName}</a></li>
		`
		groupList.innerHTML += groupListElement;
		return

		// let groupElement = createListItem(group.groupName)
		// groupElement.id = group.id;
		// groupElement.append(document.createElement("a"))
		// groupElement.append(addImg(group.avatar))
		// groupList.appendChild(groupElement)
		// return
	})
}

function handleGroupCreation(e) {
    console.log("Handle group creation is called...")
    e.preventDefault();
    let allMembersInput = document.querySelectorAll('.group-member');
    // let randomId = Date.now();
    if (!inputValidation(groupName, allMembersInput)) {
        groupError.style.display = "block";
        return;
    }
    else {
        // fromUserInput.style.borderColor = "#006091";
        groupError.style.display = "none";
        const tempMemberArr = [];
        allMembersInput.forEach(input => {
            if (!isEmpty(input.value)) {

                let inList = false;

                friendsArr.forEach(friend => {
                    friend.name.toLowerCase() === input.value.toLowerCase() ? inList = true : ""
                })
                if (!inList) {
                    const newFriend = createFriend(titleCase(input.value));
                    // friendsArr.push(newFriend);
                    tempMemberArr.push(newFriend);
                } else {
                    alert(`Friend ${input.value} already exists, please enter another one, or choose ${input.value} from existing friends.`)
                }
                clearInputField(input);
            }
        });

        if (tempMemberArr.length >= 2) {
            const newGroup = createNewGroup(groupName.value); // this also renders groups
            selectedGroupIndex = groupsArr.length-1 // just added group
            tempMemberArr.forEach(member => {
                newGroup.membersArr.push(member);
                friendsArr.push(member);
            })
        } else {
            alert("The group does not have two members so it's not created.")
        }
        renderFriends();
        hideForm();
		renderSelectedGroupInfo(groupsArr[selectedGroupIndex]); //render just added group
        tempMemberArr.length = 0;
        clearInputField(groupName);
        removeNewInputs();
    }

}


// overall friends management

// friends management
const showAddFriendForm = document.getElementById("add-btn");
const formAddFriend = document.getElementById("form-add-friend");
const inputFriendName = document.getElementById('friend-first-name');

showAddFriendForm.addEventListener("click", () => { // the add friend button just shows the form
    formAddFriend.classList.add("form-add-visible");
});

formAddFriend.addEventListener("submit", (e) => { // function to create friend from input and add friend to overall friend array
    e.preventDefault();
    let name = inputFriendName.value;
    const friend = createFriend(name);
    friendsArr.push(friend);
    inputFriendName.value = '';
    renderFriends();
});

// expense management

// create new expense 

function createExpense(name, cost, payer) {
    const date = new Date();
    cost = Number(cost);
    const paid = [];
    return { name, cost, payer, date, paid }
}

btnAddExpense.addEventListener("click", () => {
    formAddExpense.classList.toggle("hidden");
});

formAddExpense.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputExpenseName = document.getElementById("input-expense");
    const inputExpenseAmount = document.getElementById("input-amount");
    const inputExpenseParticipant = document.getElementById("input-participant");
    const newExpense = createExpense(inputExpenseName.value, inputExpenseAmount.value, inputExpenseParticipant.value);
    groupsArr[selectedGroupIndex].expenses.push(newExpense);
    console.table(groupsArr[selectedGroupIndex].expenses);
    inputExpenseName.value = "";
    inputExpenseAmount.value = "";
    inputExpenseParticipant.value = "";
    formAddExpense.classList.add("hidden");
    renderExpenses(groupsArr[selectedGroupIndex]);
})

function renderExpenses(group) {
    listExpenses.textContent = "";
    group.expenses.forEach(expense => {
        const listItemExpense = document.createElement("li");
        listItemExpense.classList.add("expense-item");
        const nameSpan = document.createElement("span");
        const amountSpan = document.createElement("span");
        const participantSpan = document.createElement("span");
        const dateSpan = document.createElement("span");
        nameSpan.textContent = expense.name;
        amountSpan.textContent = expense.cost;
        participantSpan.textContent = expense.payer;
        dateSpan.textContent = expense.date.toLocaleString();
        listItemExpense.appendChild(nameSpan);
        listItemExpense.appendChild(amountSpan);
        listItemExpense.appendChild(participantSpan);
        listItemExpense.appendChild(dateSpan);
        listExpenses.appendChild(listItemExpense);
    })
}

console.log(selectedGroupIndex)

