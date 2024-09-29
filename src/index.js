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
let groupList = document.getElementById('group-list');
let friendsList = document.getElementById('friends-list');
let memberInputs = document.getElementById('member-inputs');

// array with all friends

const friendsArr = [];

// fake data
friendsArr.push(createFriend("Jane Doe"), createFriend("John Doe"), createFriend("Jessy Doe"), createFriend("Jafar Doe"));


// array with all groups, don't forget to delete fake data
const groupsArr = [{

	groupName: "Fake Group 1",
	id: Date.now(),
	avatar: "src/img/group-icon.png",
	membersArr: friendsArr,
	expenses:[{name:"Bali", cost:1000, friends:["Jane","Jessy","Jafar"], payer:"Jane", paid:["Jessy"]}, {name:"Shmali", cost:2000, friends:["John","Jessy","Jane"], payer:"John", paid:[]}]
},
{
	groupName: "Fake Group 2",
	id: Date.now() + 1,
	avatar: "src/img/group-icon.png",
	membersArr: friendsArr,
	expenses:[{name:"Movie Night", cost:200, friends:["John","Jessy"], payer:"John", paid:[]}, {name:"Boat Tour", cost:2000, friends:["Jafar","Jessy","Jane","John"], payer:"John", paid:[]}]
}
];

//render first existing group by default or show form
if(groupsArr.length) {
	hideForm()
	renderSelectedGroupInfo(groupsArr[0])
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

document.querySelector("body")?.addEventListener("click", (event)=> {
	document.querySelector(".active")?.classList.remove("active")
	const selectedGroupId = event.target.closest(".section-main-group-info-nav-container")?.id;
	event.target.closest("li")?.classList.add("active");
	// console.log(event.target)
	// console.log(selectedGroupId)
	const selectedGroupInfo = document.getElementById("group-info-container")
	selectedGroupInfo.style.display="block"
	if(event.target.matches(".group-members")) {
		selectedGroupInfo.innerHTML = getGroupMembersHTML(selectedGroupId)
	} else if(event.target.matches(".group-statistics")) {
		selectedGroupInfo.innerHTML = getGroupStatisticsHTML(selectedGroupId)
	} else if(event.target.matches(".group-edit")) {
		selectedGroupInfo.innerHTML = getGroupEditHTML(selectedGroupId)
	}
	return
})

function getGroupMembersHTML(id) {
	return `<div class="section-main-group-info-members">Members: ${groupsArr.map(group => group.id == id ? group.membersArr.map(member=>member.name).join(", "): "")}</div>`
}

function getGroupStatisticsHTML(id) {
	return `<div class="section-main-group-info-statistics">
	<p class="total-group-expenses">Total expenses: <span>$1000</span></p>
	<p class="total-group-paid">Paid: <span>$700</span></p>
	<p class="total-group-unpaid">Unpaid: <span>$300</span></p>
	<table>
		<tr>
			<th>Member</th>
			<th>Amount</th>
			<th>Payer</th>
		</tr>
		<tr>
			<td>Jessy Doe</td>
			<td>$100</td>
			<td>Jack</td>
		</tr>
		<tr>
			<td>Ben</td>
			<td>$150</td>
			<td>John</td>
		</tr>
		<tr>
			<td>Jack</td>
			<td>$50</td>
			<td>Jane Doe</td>
		</tr>
	</table>
	</div>`
}

function getGroupEditHTML(id) {
	const groupObj = groupsArr.find(({id})=> id === id)
	return `<div class="section-main-group-info-edit">Edit group ${groupObj.groupName}</div>`
}


function handleGroupClick(e) {
	console.log(e.target.id)
	groupsArr.forEach(group => {
		return Number(e.target.id) === Number(group.id) ? renderSelectedGroupInfo(group) : ""
	})
}

function renderSelectedGroupInfo(group) {
console.log("Inside renderSelectedGroup function")
const {groupName, id, avatar, membersArr, expenses} = group;
selectedGroup.innerHTML = "";
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

	<div class="section-main-group-info" >
				<div class="section-main-group-info-nav-container" id=${id}>
					<ul class="section-main-group-info-nav">
					<li class="text-small group-members active">Members</li>
					<li class="text-small group-statistics" >Statistics</li>
					<li class="text-small group-edit" >Edit Group</li>
				</ul>
				<button id="download-btn"> Download PDF</button>
				</div>
				
				<div id="group-info-container">
					${getGroupMembersHTML(id)}
				</div>
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
	console.log(text)
    const words = text?.split(" ");
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
        expenses: [{ name: "Bali", cost: 1000, friends: ["Jane,Jessy,Jafar"], payer: "Jane" }, { name: "Shmali", cost: 2000, friends: ["John,Jessy,Jane"], payer: "John" }]
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
            tempMemberArr.forEach(member => {
                newGroup.membersArr.push(member);
                friendsArr.push(member);
            })
        } else {
            alert("The group does not have two members so it's not created.")
        }
        renderFriends();
        hideForm();
		renderSelectedGroupInfo(groupsArr[groupsArr.length-1]); //render just added group
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

