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
const groupDetails = JSON.parse(localStorage.getItem('groups'))||[];
const friendsListStored = JSON.parse(localStorage.getItem('friends'))||[];
let groupList = document.getElementById('group-list');
let friendsList = document.getElementById('friends-list');
let memberInputs = document.getElementById('member-inputs');

console.log(`Before: ${groupDetails}`);
console.log(`Before: ${friendsListStored}`);
// if(!localStorage.getItem('friends')){
//     localStorage.setItem('friends',JSON.stringify(friendsListStored));
// }
// if(!localStorage.getItem('groups')){
//     localStorage.setItem('groups',JSON.stringify(groupsArr));
// }
console.log(`After: ${groupDetails}`);
console.log(`After: ${friendsListStored}`);

//render first existing group by default or show form
// if(Object.keys(groupDetails).length!=0) {
if(groupDetails.length!=0) {
	hideForm()
	renderSelectedGroupInfo(groupDetails[0]);
	// renderSelectedGroupInfo(groupsArr[0])
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
// for not overwriting groups present in local storage

//rendered group events: listen and render selected group on main section
groupList.addEventListener("click", handleGroupClick)

function handleGroupClick(e) {
	console.log(e.target.id)
	groupDetails.forEach(group => {
		return Number(e.target.id) === Number(group.id) ? renderSelectedGroupInfo(group) : ""
	})
}

function renderSelectedGroupInfo(group) {
console.log("Inside renderSelectedGroup function")
console.log(group);
const {groupName, id, avatar, membersArr, expenses} = group;
selectedGroup.innerHTML = "";
	let friendsImages = membersArr.map(member => {
		return `<img src=${member.imgSrc} alt="Friend icon" class="group-title-friends-img">`
	})
return selectedGroup.innerHTML += `
	<div class="section-main-group-header">
				<div>
					<h2 class="section-main-group-title">${titleCase(groupName)} 🖋️</h2>
					<p class="text-small">${membersArr.map(member => member.name).join(", ")}</p>
					${friendsImages.join(" ")}
					<p class="badge badge-unpaid">You are owed $3,456</p>
			    </div>
				<img src=${avatar} alt="Group icon">
	</div>
`
}

//Live testing group calculations
// groupDetails.forEach(group=>console.log(`Total outstanding = $${totalCalc(group)}`));
// groupsArr.forEach(group => console.log(`Total outstanding = $${totalCalc(group)}`))

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
    console.log("showing form")
    fromUserInput.style.borderColor = "#006091";
    document.querySelectorAll('.default').forEach(member=>{
        defaultBorder(member.id);
    })
}

function hideForm() {
	groupForm.style.display = "none";
    console.log("Hiding form");
	return;
}

//manage fields
function addMemberInputField() {
    const newMemberInput = document.createElement('input');
    newMemberInput.className = 'group-member';
    newMemberInput.placeholder = 'Add Member';
    memberInputs.appendChild(newMemberInput);
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
    groupDetails.push(newGroup);
    localStorage.setItem('groups',JSON.stringify(groupDetails));
    renderGroups();
    return newGroup; // Jelena added
}

function renderFriends() {
    friendsList.innerHTML = "";
    friendsListStored.forEach(friend=>{
        const friendElement = createListItem(friend.name);
        friendsList.appendChild(friendElement);
        return
    })
    // friendsArr.forEach(friend => {
    //     const friendElement = createListItem(friend.name)
    //     friendsList.appendChild(friendElement)
    //     return
    // })
}

function renderGroups() {
	groupList.innerHTML = ""
	// groupsArr.map(group => {

		// let groupListElement = `
		// <li><img src=${group.avatar} alt="group icon" class="group-icon"><a id=${group.id} class="group-link"
        //                 href="#">${group.groupName}</a></li>
		// `
		// groupList.innerHTML += groupListElement;
		// return

	// 	// let groupElement = createListItem(group.groupName)
	// 	// groupElement.id = group.id;
	// 	// groupElement.append(document.createElement("a"))
	// 	// groupElement.append(addImg(group.avatar))
	// 	// groupList.appendChild(groupElement)
	// 	// return
	// })
    groupDetails.map(group=>{
        let groupListElement = `
		<li><img src=${group.avatar} alt="group icon" class="group-icon"><a id=${group.id} class="group-link"
                        href="#">${titleCase(group.groupName)}</a></li>
		`
		groupList.innerHTML += groupListElement;
		return
    })
    // Object.values(groupDetails).map(group=>{
    //     let groupListElement = `
	// 	<li><img src=${group.avatar} alt="group icon" class="group-icon"><a id=${group.id} class="group-link"
    //                     href="#">${group.groupName}</a></li>
	// 	`
	// 	groupList.innerHTML += groupListElement;
	// 	return
    // })
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
        groupError.style.display = "none";
        const tempMemberArr = [];
        allMembersInput.forEach(input => {
            if (!isEmpty(input.value)) {

                let inList = false;
                friendsListStored.forEach(friend => {
                    friend.name.toLowerCase() === input.value.toLowerCase() ? inList = true : ""
                })
                // friendsArr.forEach(friend => {
                //     friend.name.toLowerCase() === input.value.toLowerCase() ? inList = true : ""
                // })
                if (!inList) {
                    const newFriend = createFriend(titleCase(input.value));
                    // friendsArr.push(newFriend);
                    tempMemberArr.push(newFriend);
                } else {
                    alert(`Friend ${input.value} already exists, please enter another one, or choose ${input.value} from existing friends.`)
                }
                console.log(`This is tempmember array ${tempMemberArr}`);
                clearInputField(input);
            }
        });

        if (tempMemberArr.length >= 2) {
            const newGroup = createNewGroup(groupName.value); // this also renders groups
            tempMemberArr.forEach(member => {
                newGroup.membersArr.push(member);
                // friendsArr.push(member);
                friendsListStored.push(member);
            })
            localStorage.setItem('friends', JSON.stringify(friendsListStored));
            localStorage.setItem('groups',JSON.stringify(groupDetails));
        } else {
            alert("The group does not have two members so it's not created.")
        }
        renderFriends();
        hideForm();
		renderSelectedGroupInfo(groupDetails[groupDetails.length-1]); //render just added group
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
    // friendsArr.push(friend);
    friendsListStored.push(friend);
    inputFriendName.value = '';
    renderFriends();
});
