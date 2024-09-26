const groupCreateBtn = document.getElementById('group-create-btn');
const groupName = document.getElementById('group-name');
const addAnotherMember = document.getElementById('add-another-member');
const groupError = document.getElementById('group-error');

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
    newMemberInput.placeholder = "Enter member";
    memberInputs.appendChild(newMemberInput);
}

function clearInputField(field){
    return field.value="";
}

function removeNewInputs(className){
    let nonDefault = document.querySelectorAll('.group-member:not(.default)');
    nonDefault.forEach(field=>field.remove());
}

//validation

function inputValidation(groupName,groupMembers){
    let allFilled = true;
    groupMembers.forEach(member=>{
        if(isEmpty(member.value)){
            allFilled = false;
        }
    });

    return (isEmpty(groupName.value)||!allFilled) ? false:true;
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

function handleFormDisplay() {
	
}

function handleGroupCreation(){
    let allMembersInput = document.querySelectorAll('.group-member');

    if (!inputValidation(groupName,allMembersInput)) {
        groupError.style.display = "block";
        return;
    } else {
		//add info from input into group obj
		groupError.style.display = "none";

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
		handleFormDisplay();
        createNewGroup(groupName.value);
        clearInputField(groupName);
		removeNewInputs();
    }
    
}



  




