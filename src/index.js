const groupCreateBtn = document.getElementById('group-create-btn');
const groupName = document.getElementById('group-name');
const addAnotherMember = document.getElementById('add-another-member');
const groupError = document.getElementById('group-error');
const groupForm = document.querySelector('#group-form');
const fromUserInput = document.querySelector("#from-user input");
const sidebarAddGroup = document.getElementById('sidebar-add-group');
let groupList = document.getElementById('group-list');
let friendsList = document.getElementById('friends-list');
let memberInputs = document.getElementById('member-inputs');

// array with all friends
const friendsArr = [
	{name: "Jane Doe", id: Date.now()},
	{name: "John Doe", id: Date.now()},
	{name: "Jessy Doe", id: Date.now()},
	{name: "Jafar Doe", id: Date.now()}
	];

// array with all groups, don't forget to delete fake data
const groupsArr = [{
	groupName: "Fake Group 1",
	id: Date.now(),
	avatar: "src/img/group-icon.png",
	friends: friendsArr,
	expenses:[{name:"Bali", cost:1000, friends:["Jane,Jessy,Jafar"], payer:"Jane"}, {name:"Shmali", cost:2000, friends:["John,Jessy,Jane"], payer:"John"}]
},
{
	groupName: "Fake Group 2",
	id: Date.now(),
	avatar: "src/img/group-icon.png",
	friends: friendsArr,
	expenses:[{name:"Movie Night", cost:200, friends:["John,Jessy"], payer:"John"}, {name:"Boat Tour", cost:2000, friends:["Jafar,Jessy,Jane,John"], payer:"John"}]
}
];


//rendering of existing data from localStorage on page load

renderFriends();
renderGroups();

//events

groupCreateBtn.addEventListener('click', handleGroupCreation);
addAnotherMember.addEventListener('click', addMemberInputField);


//creating html list templates

function createListItem(content){
    const element = document.createElement('li');
    element.textContent = titleCase(content);
    return element;
}

function titleCase(text){
	const words = text.split(" ");
	return words.map(word=>word[0].toUpperCase() + word.substring(1).toLowerCase()).join(" ")
}

function addImg(avatar) {
	const groupImg = document.createElement("img")
	groupImg.setAttribute("src", avatar)
	groupImg.classList.add("group-icon")
	return groupImg
}

//manage fields

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

function clearInputField(field){
    return field.value="";
}

function removeNewInputs(className){
    let nonDefault = document.querySelectorAll('.group-member:not(.default)');
    nonDefault.forEach(field=>field.remove());
}

//validation

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

//group object

function createNewGroup(name) {
	//create new group, push it in groupsArr
	const newGroup ={
		groupName: name,
		id: Date.now(),
		avatar: "src/img/group-icon.png",
		friends: friendsArr,
		expenses:[{name:"Bali", cost:1000, friends:["Jane,Jessy,Jafar"], payer:"Jane"}, {name:"Shmali", cost:2000, friends:["John,Jessy,Jane"], payer:"John"}]
	};
	groupsArr.push(newGroup)
	console.log(friendsArr)
	console.log(groupsArr)
	renderGroups()
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
		groupElement = createListItem(group.groupName)
		groupElement.id = group.id;
		groupElement.append(addImg(group.avatar))
		groupList.appendChild(groupElement)
		return
	})
}

function handleGroupCreation(e){
    e.preventDefault();
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

				let inList = false;

				friendsArr.forEach(friend=> {
					friend.name.toLowerCase() === input.value.toLowerCase() ? inList = true : ""
				})

				!inList ? friendsArr.push({name:titleCase(input.value), id: Date.now()}) : ""

                clearInputField(input);
				renderFriends();
            }
        });
        createNewGroup(groupName.value);
        clearInputField(groupName);
        groupForm.style.display = "none";
    }
    // allgroupObject[randomId] = groupObject;
    // console.log(allgroupObject);
    removeNewInputs();
}
function showForm(){
    groupForm.style.display = "block";
}

sidebarAddGroup.addEventListener('click',showForm);
groupForm.addEventListener('submit',handleGroupCreation);
// groupForm.addEventListener('submit',handleGroupCreation);
// groupCreateBtn.addEventListener('click', handleGroupCreation);
addAnotherMember.addEventListener('click', addMemberInputField);
