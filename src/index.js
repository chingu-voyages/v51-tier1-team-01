import { totalOutstandingCalc, memberStatus, memberTotal, totalCalc } from "./calcs.js";
import { getGroupSummary } from "./summary.js";
// import {downloadPDF} from "./pdf.js";

const groupCreateBtn = document.getElementById('group-create-btn');
const groupName = document.getElementById('group-name');
const addAnotherMember = document.getElementById('add-another-member');
const groupError = document.getElementById('group-error');
const groupForm = document.querySelector('#group-form');
const closeGroupForm = document.getElementById("close-group-form");
const fromUserInput = document.querySelector("#from-user input");
const sidebarAddGroup = document.getElementById('sidebar-add-group');
const selectedGroup = document.getElementById("selected-group");
const groupContainer = document.getElementById("group-info-container")
const groupsArr = JSON.parse(localStorage.getItem('groups')) || [];
const friendsListStored = JSON.parse(localStorage.getItem('friends')) || [];
let groupList = document.getElementById('group-list');
let friendsList = document.getElementById('friends-list');
let memberInputs = document.getElementById('member-inputs');
const summary = document.getElementById("summary")

const btnAddExpense = document.getElementById("btn-add-expense");
const formAddExpense = document.getElementById("form-add-expense");
const listExpenses = document.getElementById("list-expenses");

let selectedGroupIndex = -1; //just trying to fix the selectedGroupIndex is not defined

// selectedGroup.classList.add("hidden");
// document.querySelector(".main-group-add-expense").display = "none";

if (groupsArr.length !== 0) {
    hideForm()
    renderSelectedGroupInfo(groupsArr[0]);
    // renderSelectedGroupInfo(groupsArr[0])
} else {
	document.querySelector(".main-group-add-expense").classList.remove("show");
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
// groupList.addEventListener("click", handleGroupClick)

document.querySelector("body")?.addEventListener("click", (event) => {

	if (event.target.matches(".group-link") || event.target.matches(".group-balances") || event.target.matches(".group-members") || event.target.matches("#summary") ||  event.target.matches(".toggle")) {


        const selectedGroupId = event.target.closest(".group-link")?.id || event.target.closest(".section-main-group-info-nav-container")?.id;

        const selectedGroup = groupsArr.find(group => {
            return group.id == selectedGroupId ? group : console.log("there's no group with same id in group array")
        })

        console.log(event.target)
        // console.log(selectedGroupId)
        console.log(selectedGroup)

        document.querySelector(".active")?.classList.remove("active")
        event.target.closest(".section-main-group-info-nav li")?.classList.add("active")

        // const selectedGroupInfo = document.getElementById("group-info-container")
        // console.log(selectedGroupInfo === groupContainer)

        // groupContainer ? groupContainer.style.display = "block" : ""

		if (event.target.matches(".group-balances") || event.target.matches(".group-link")) {

			listExpenses.innerHTML = getExpensesHTML(selectedGroup)
			groupContainer.innerHTML = ""
			document.querySelector(".group-balances").classList.add("active")
			document.querySelector(".main-group-add-expense").classList.add("show");
			console.log("group",selectedGroup)
			renderSelectedGroupInfo(selectedGroup, groupContainer.appendChild(listExpenses))

        } else if (event.target.matches("#summary")){

			groupContainer.innerHTML = getGroupSummary(selectedGroup)
			document.querySelector(".main-group-add-expense").classList.remove("show");
			renderSelectedGroupInfo(selectedGroup, groupContainer)

		} else if (event.target.matches(".toggle")) {

			const expenseId = event.target.closest(".expense-item").id
			const expense = groupsArr[selectedGroupIndex].expenses.find( expense => expense.date === Number(expenseId))
			const member = expense.members.find(member => Number(member.id) === Number(event.target.id))
			console.log(member.name, expense)
			toggleMemberStatus(expense, member)
			listExpenses.innerHTML = getExpensesHTML(groupsArr[selectedGroupIndex])
			// event.target.parentNode.parentNode.parentNode.parentNode.classList.add("show")
			document.querySelector(".balances-expenses-container")?.classList.add("show")
			console.log(listExpenses)
			renderSelectedGroupInfo(groupsArr[selectedGroupIndex], listExpenses)

		} else if (event.target.matches(".group-members")){

			groupContainer.innerHTML = getGroupMembers(selectedGroup)
			document.querySelector(".main-group-add-expense").classList.remove("show");
			renderSelectedGroupInfo(selectedGroup, groupContainer)

        }


    } else {
        event.stopPropagation()
    }

    if (event.target.matches("#show-expenses-members")) {
        {
            event.stopPropagation()
            const toggle = event.target.parentNode.querySelector(".balances-expenses-container")
            return toggle.classList.contains("show") ? toggle.classList.remove("show") : toggle.classList.add("show");
        }
    } else {
        event.stopPropagation()
    }

    if (event.target.matches("#add-expense-member")) {
        event.stopPropagation()
        // handleExpenseClick(event);
        const groupId = document.querySelector(".section-main-group-info-nav-container").id
        const group = groupsArr.find(group => group.id === Number(groupId))
        console.log(group)
        const expenseId = Number(event.target.parentNode.id)

        addMembersToExpense(expenseId, group);
    } else {
        event.stopPropagation()
    }
    // add member btn below members section
    if (event.target.matches("#add-member-btn")) {
        event.stopPropagation()
        // handleExpenseClick(event);
        console.log("Showing friends dialog")
        // const groupId = document.querySelector(".section-main-group-info-nav-container").id
        // const group = groupsArr.find(group=> group.id === Number(groupId))
        // console.log(group)
        // const expenseId = Number(event.target.parentNode.id)
        addMembersToGroup(selectedGroupIndex);
        // addMembersToExpense(expenseId, group);
    } else {
        event.stopPropagation()
    }

    if (event.target.matches("#edit-expense-btn")) {
        {
            event.stopPropagation()
            // handleExpenseClick(event);

            const expenseId = Number(event.target.parentNode.id)
            const group = groupsArr.find(group => {
                return group.expenses.find(expense => expense.date === Number(expenseId))
            })
            const expense = group.expenses.find(expense => expense.date === Number(expenseId))

            console.log(expense)
            editExpense(expense)
        }
    } else {
        event.stopPropagation()
    }

    if (event.target.matches("#download-btn")) {

					const group = groupsArr.find(group => group.id === Number(event.target.parentNode.id))

					groupContainer.innerHTML = getGroupSummary(group);

					summary.classList.add("active")
					document.querySelector(".group-members").classList.remove("active")
					document.querySelector(".group-balances").classList.remove("active")

					console.log("Downloading PDF ...")
					setTimeout(()=>{
						if(confirm("Do you want to download your group's expense summary?")){
						const pdfExp = document.querySelector("#group-info-container");
						var opt = {
							margin:       1,
							filename:     `${group.groupName}-summary.pdf`,
							jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
						  };
						html2pdf(pdfExp, opt);
						}
					},1000)

    } else {
        event.stopPropagation()
    }
})

function getGroupMembers(selectedGroup) {
	return `
		<div class="balances-members-container">
			${selectedGroup.membersArr.map(member => {
        return `
						<div class = "balances-card-member">
							<div>
								<div>
								    <p class="balances-card-member-name editable" id=${member.id}>
								    ${member.name}
								    </p>
                                    <span class="pen"></span>
                                    <span class="delete">×</span>
								</div>
								<p class="badge badge-${memberTotal(member.name, selectedGroup) == 0 ? "paid" : "unpaid"}">$${memberTotal(member.name, selectedGroup)}</p>
							</div>
							<img class="balances-card-member-img ${memberTotal(member.name, selectedGroup) == 0 ? "paid" : "unpaid"}" src=${member.imgSrc} alt="Member icon">
						</div>
					`
    }).join("")
        }
		</div>
		<div class="balances-members-footer">
			<button class="add-btn" id="add-member-btn"><span>+</span>Add member</button>
		</div>
	`
}

// function handleGroupClick(e) {
//     // console.log(e.target.id)
//     e.stopPropagation()
//     groupsArr.forEach(group => {
//         if (e.target.id == Number(group.id)) {
//             selectedGroupIndex = groupsArr.indexOf(group);
//             renderSelectedGroupInfo(group)
//         }
//         // const selectedGroupInfo = document.getElementById("group-info-container")
//         // selectedGroupInfo.innerHTML = getGroupBalances(groupsArr[selectedGroupIndex])
//         listExpenses?.classList.remove("hidden");
//         // return Number(e.target.id) === Number(group.id) ? renderSelectedGroupInfo(group) : ""
//     })
// }



function renderSelectedGroupInfo(group, content) {
	if(groupsArr.length > 0) {
		selectedGroup.classList.remove("hidden");
		console.log(group,content)
		// document.querySelector(".main-group-add-expense").display = "flex";
    const { groupName, id, avatar, membersArr, expenses } = group;
	const header = document.querySelector(".section-main-group-header")
    header.innerHTML = "";
    document.querySelector(".section-main-group-info-nav-container").id = id;
	console.log(document.querySelector(".section-main-group-info-nav-container").id)
    selectedGroupIndex = groupsArr.indexOf(group);

        renderSelectPayerOptions();

        // getGroupBalances(groupsArr[selectedGroupIndex]);
        let friendsImages = membersArr.map(member => {
            return `<img src=${member.imgSrc} alt="Friend icon" class="group-title-friends-img">`
        })

        header.innerHTML += `
				<div>
					<div>
                        <h2 class="section-main-group-title editable" id=${id}>${titleCase(groupName)} </h2>
                                            <span class="pen"> </span>
                    </div>
					<p class="text-small">${membersArr.map(member => member.name).join(", ")}</p>
					${friendsImages.join(" ")}
					<p class="badge badge-${totalOutstandingCalc(groupsArr[selectedGroupIndex]) > 0 ? 'unpaid' : 'paid'}">${totalOutstandingCalc(groupsArr[selectedGroupIndex]) > 0 ? '$' + totalOutstandingCalc(groupsArr[selectedGroupIndex]) + ' outstanding' : "Nothing owed"}</p>
			    </div>
				<img src=${avatar} alt="Group icon">
`
		if(content) {
			content
		} else {
			groupContainer.innerHTML = ""
			listExpenses.innerHTML = getExpensesHTML(groupsArr[selectedGroupIndex])
			groupContainer.appendChild(listExpenses)
		}


	} else {
		selectedGroup.classList.add("hidden");
	}
}

//creating html list templates

function createListItem(content) {

    const element = document.createElement('li');
    element.textContent = titleCase(content);
    return element;
}

function titleCase(text) {
    if (text.length) {
        text = text.trim();
        // console.log(text)
        const words = text?.split(" ");
        return words.map(word => word[0].toUpperCase() + word.substring(1).toLowerCase()).join(" ")
    } else {
        return "No name"
    }

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
    document.querySelectorAll('.default').forEach(member => {
        defaultBorder(member.id);
    })
}

function hideForm() {
    groupForm.style.display = "none";
    // return;
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
            if (member.className.includes('default')) {
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
    return (isEmpty(groupName.value) || membersFilled < 2 && !tempExistingFriendsIdsArr.length) ? false : true;
}


function isEmpty(value) {
    return value.trim() === '';
}

// friend object

function createFriend(name, id = Date.now() + Math.floor(Math.random() * 1000), imgSrc = 'src/img/person-icon.png') { // function to create friend object from input
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
    groupsArr.push(newGroup);
    localStorage.setItem('groups', JSON.stringify(groupsArr));
    renderGroups();
    return newGroup; // Jelena added
}

function renderFriends() {
    friendsList.innerHTML = "";
    friendsListStored.forEach(friend => {
        const friendElement = createListItem(friend.name);
        const friendImg = document.createElement("img");
        const deleteIcon = document.createElement("span");
        // <span class="delete">&times</span>
        deleteIcon.classList.add("delete");
        deleteIcon.innerHTML = "&times";
        friendElement.setAttribute('id', friend.id);
        friendImg.setAttribute("src", friend.imgSrc);
        friendImg.classList.add("group-icon");
        friendElement.appendChild(friendImg);
        friendElement.appendChild(deleteIcon);
        friendsList.appendChild(friendElement);
        // return
    })
}

function renderGroups() {
    groupList.innerHTML = ""
    groupsArr.map(group => {
        let groupListElement = `
		<li>
            <img src=${group.avatar} alt="group icon" class="group-icon">
            <a id=${group.id} class="group-link" href="#">${titleCase(group.groupName)}</a>
            <span class="delete">&times;</span>
        </li>
		`
        groupList.innerHTML += groupListElement;
        // return
    })
}

function handleGroupCreation(e) {
    e.stopPropagation()
    console.log("Handle group creation is called...")
    e.preventDefault();
    let allMembersInput = document.querySelectorAll('.group-member');
    // add existing friends
    const tempMemberArr = [];
    if (tempExistingFriendsIdsArr.length) {
        tempExistingFriendsIdsArr.forEach(checkboxId => {
            friendsListStored.forEach(friend => {
                if (checkboxId.toLowerCase() === friend.name.toLowerCase()) {
                    tempMemberArr.push(friend)
                }
            })
        })
        console.log("temp member arr after checking existing friends: ")
        console.log(tempMemberArr)
    }
    if (!inputValidation(groupName, allMembersInput) && tempMemberArr.length < 2) {
        groupError.style.display = "block";
    }
    else {
        groupError.style.display = "none";
        allMembersInput.forEach(input => {
            if (!isEmpty(input.value)) {

                let inList = false;
                friendsListStored.forEach(friend => {
                    friend.name.toLowerCase() === input.value.toLowerCase() ? inList = true : ""
                })
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
            selectedGroupIndex = groupsArr.length - 1 // just added group
            tempMemberArr.forEach(member => {
                newGroup.membersArr.push(member);
                if (!friendsListStored.includes(member)) {
                    friendsListStored.push(member);
                }
            })
            localStorage.setItem('friends', JSON.stringify(friendsListStored));
            localStorage.setItem('groups', JSON.stringify(groupsArr));
        } else {
            alert("The group does not have two members so it's not created.")
        }
        renderFriends();
        hideForm();
		    document.querySelector(".main-group-add-expense").classList.add("show");
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
    formAddFriend.classList.toggle("form-add-visible");
});

formAddFriend.addEventListener("submit", (e) => { // function to create friend from input and add friend to overall friend array
    e.preventDefault();
    let name = inputFriendName.value;
    let inList = false;
    friendsListStored.forEach(friend => {
        if (friend.name.toLowerCase() === name.toLowerCase()) {
            inList = true;
        }
    })
    if (!inList) {
        const friend = createFriend(name);
        friendsListStored.push(friend);
    }
    localStorage.setItem('friends', JSON.stringify(friendsListStored))
    inputFriendName.value = '';
    renderFriends();
    formAddFriend.classList.remove("form-add-visible");
});

// close dialogs

const btnsCancelDialog = document.querySelectorAll(".btn-cancel-dialog");
btnsCancelDialog.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector(e.target.closest("dialog").close())
    })
});

const dialogs = document.querySelectorAll("dialog");
dialogs.forEach(dialog => {
    dialog.addEventListener("click", (e) => {
        if (e.target.children[0].classList.contains("dialog-body")) {
        dialog.close();
        }
    })
})



// dialog.addEventListener('click', (event) => {
//     if (event.target.id !== 'my-div') {
//         dialog.close();
//     }
// });



// add existing friends to group

const btnAddExistingFriend = document.getElementById("add-existing-friend");
const dialogAddExistingFriend = document.getElementById("dialog-add-friend");
const addExistingFriendContainer = document.getElementById("existing-friends-checkboxes");

function renderExistingFriendsForGroupCreation() {
    addExistingFriendContainer.textContent = "";
    addExistingFriendContainer.childNodes.forEach(node => node.remove())
    friendsListStored.forEach(friend => {
        // friendsArr.forEach(friend => {
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", friend.name);
        checkbox.classList.add("existing-friend")
        const label = document.createElement("label");
        label.setAttribute("for", friend.name);
        label.textContent = friend.name;
        const checkboxDiv = document.createElement("div");
        checkboxDiv.classList.add("form-control", "form-control-checkbox");
        checkboxDiv.appendChild(checkbox);
        checkboxDiv.appendChild(label);
        addExistingFriendContainer.appendChild(checkboxDiv);
    });
    checkboxes = [...document.querySelectorAll(".existing-friend")];
}


btnAddExistingFriend.addEventListener("click", () => {
    renderExistingFriendsForGroupCreation();
    dialogAddExistingFriend.showModal();
})

const btnCloseAddExistingFriends = document.getElementById("close-add-existing-friends-to-group")

const tempExistingFriendsIdsArr = [];
function addExistingFriensOnGroupCreation(e) {
    tempExistingFriendsIdsArr.length = 0;
    e.preventDefault()
    // handleGroupCreation(e);
    // groupsArr[selectedGroupIndex].membersArr.forEach(member => {
    //     checkboxes.forEach(checkbox => {
    //         if (checkbox.checked && checkbox.id.toLowerCase() === member.name.toLowerCase()) {
    //             // console.log(groupsArr[selectedGroupIndex].expenses[selectedExpenseIndex])
    //             groupsArr[selectedGroupIndex].members.push(member)
    //         }

    //     })
    // })
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            console.log("CHECKBOX: ")
            console.log(checkbox)
            tempExistingFriendsIdsArr.push(checkbox.id);
            console.log(checkbox.id)
        }
    })
    localStorage.setItem('groups', JSON.stringify(groupsArr));
    dialogAddExistingFriend.close();
    // getExpensesHTML(groupsArr[selectedGroupIndex]);
    renderSelectedGroupInfo(groupsArr[selectedGroupIndex]);
    console.log("temp existing friends ids arr")
    console.log(tempExistingFriendsIdsArr)
    return tempExistingFriendsIdsArr;
}

btnCloseAddExistingFriends.addEventListener("click", addExistingFriensOnGroupCreation);

// expense management

// create new expense

function createExpense(name, cost, payer, groupIndex) {
    console.log("Expense created")
    const date = Date.now();
    const members = [];
    members.push(payer);
    cost = Number(cost);
    const paid = [];
    return { name, cost, payer, members, date, paid }
}

function renderSelectPayerOptions() {
    const selectPayer = document.getElementById("select-payer");
    selectPayer.textContent = "";
    groupsArr[selectedGroupIndex].membersArr.forEach(member => {
        const option = document.createElement("option");
        option.textContent = member.name;
        option.setAttribute.value = member.name;
        selectPayer.appendChild(option);
    })
}

btnAddExpense.addEventListener("click", () => {
    renderSelectPayerOptions();
    formAddExpense.classList.toggle("hidden");
});

formAddExpense.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputExpenseName = document.getElementById("input-expense");
    const inputExpenseAmount = document.getElementById("input-amount");
    const selectOptions = [...document.querySelectorAll("option")];
    let selectedPayer = null;
    selectOptions.forEach(option => {
        if (option.selected) {
            console.log(option.value)
            groupsArr[selectedGroupIndex].membersArr.forEach(member => {
                if (member.name === option.value) {
                    selectedPayer = member;
                }
            })
        }


    })
    const newExpense = createExpense(inputExpenseName.value, inputExpenseAmount.value, selectedPayer, selectedGroupIndex);
    groupsArr[selectedGroupIndex].expenses.push(newExpense);
    console.table(groupsArr[selectedGroupIndex].expenses);
    localStorage.setItem('groups', JSON.stringify(groupsArr));
    // localStorage.setItem('groups',groupsArr);
    inputExpenseName.value = "";
    inputExpenseAmount.value = "";
    // inputExpenseParticipant.value = "";
    formAddExpense.classList.add("hidden");

    listExpenses.innerHTML = getExpensesHTML(groupsArr[selectedGroupIndex]);

    // getGroupBalances(groupsArr[selectedGroupIndex]);
})

const addMembersToExpenseDialog = document.getElementById("add-members-to-expense");

if (listExpenses) {
    listExpenses.addEventListener("click", handleExpenseClick)
}
let selectedExpenseIndex;

function handleExpenseClick(e) {
    // e.stopPropagation();
    let selectedExpenseId = Number(e.target.closest(".expense-item").id);
    groupsArr.forEach(group => {
        group.expenses.forEach(expense => {
            if (expense.date === selectedExpenseId) {
                selectedExpenseIndex = group.expenses.indexOf(expense);
            }
        })
    })
    console.log(selectedExpenseIndex);
}

/*
function renderExpenses(group) {
    listExpenses.textContent = "";
    group.expenses.forEach(expense => {
        const listItem = document.createElement("li");
        listItem.setAttribute("id", expense.date.toString());
        listItem.classList.add("expense-item");
        const expenseHeader = document.createElement("h3");
        expenseHeader.classList.add("balances-members-header");
        const expenseName = document.createElement("span");
        const expenseDate = document.createElement("span");
        expenseName.textContent = titleCase(expense.name);
        expenseDate.textContent = expense.date.toString();
        expenseHeader.appendChild(expenseName);
        expenseHeader.appendChild(expenseDate);
        const deleteIcon = document.createElement("span");
        // <span class="delete">&times</span>
        deleteIcon.classList.add("delete");
        deleteIcon.innerHTML = "&times";
        expenseHeader.appendChild(deleteIcon);
        const expenseMembers = document.createElement("div");

        expenseMembers.classList.add("balances-members-container");

        console.log("What are expense members now...");
        console.log(expense);
        console.log(`This is expense members`,expense.members);
        expense.members.forEach(member => {
            const memberDiv = document.createElement("div");
            memberDiv.classList.add("balances-card-member");
            memberDiv.setAttribute("id", member.id)
            const memberName = document.createElement("p");
            memberName.classList.add("balances-card-member-name");
            const memberImg = document.createElement("img");
            // memberImg.classList.add("balances-card-member-img", "paid");
            memberImg.setAttribute("src", member.imgSrc);
            memberImg.setAttribute("alt", "Member icon");
            memberName.textContent = titleCase(member.name);
            memberName.textContent = member.name;
            const memberCardStatus = document.createElement("div")
            memberCardStatus.textContent = memberStatus(member, expense)

            memberCardStatus.textContent == "Paid" ? memberImg.classList.add("balances-card-member-img", "paid") :
            memberCardStatus.textContent == "Paid the bill" ? memberImg.classList.add("balances-card-member-img", "payer") :
            memberImg.classList.add("balances-card-member-img", "unpaid")

            memberCardStatus.textContent == "Paid" ? memberCardStatus.classList.add("badge", "badge-paid") :
            memberCardStatus.textContent == "Paid the bill" ? memberCardStatus.classList.add("badge", "badge-payer") :
            memberCardStatus.classList.add("badge", "badge-unpaid")

            const memberSubDiv = document.createElement("div")
            memberSubDiv.classList.add("card-sub-div")

            memberSubDiv.appendChild(memberName);
            memberSubDiv.appendChild(memberCardStatus);

            memberDiv.appendChild(memberSubDiv)
            memberDiv.appendChild(memberImg);

            expenseMembers.appendChild(memberDiv);
        })
*/

function toggleMemberStatus(expense, member) {
	console.log(expense.paid)
	if(expense.paid.includes(member.name)){
		const index = expense.paid.indexOf(member.name)
		expense.paid.splice(index, 1)
	} else {
		expense.paid.push(member.name)
	}
	localStorage.setItem('groups', JSON.stringify(groupsArr))
}

function getExpensesHTML(group) {
    const groupTotalBlock = document.getElementById("group-total")
    groupTotalBlock.innerText = `Total Cost: $${totalCalc(group)}`
	const {expenses} = group;
	// document.querySelector(".main-group-add-expense").display = "flex";
	// document.querySelector(".balances-expenses-container").display = "none";
	return `${
				expenses.map(expense => {
					return `
							<li class= "expense-item" id=${expense.date.toString()}>
								<div class="balances-expenses-header" id="show-expenses-members">
									<span>${titleCase(expense.name)}</span>
									<span class="date">${new Date(expense.date).toLocaleDateString()}</span>
									<span class="delete">&times</span>
								</div>
								<div class="balances-expenses-container">
       					 		${expense.members.map(member => {
           							 const status = memberStatus(member, expense)
           							 const paidClass = status == "Paid the bill" ? 'payer' : status == "Paid" ? 'paid' : 'unpaid'
           							 return `
																		<div class = "balances-card-member">
																			<div>
																				<div>
																				    <p class="balances-card-member-name editable" id=${member.id}>
																				    ${member.name}
																				    </p>
           							     					                    <span class="pen"></span>
																				</div>
           							                                         <div id="badges">
																					<p class="badge badge-${paidClass}">${status}</p> ${status == "Paid the bill" ? "" : `<p id=${member.id} class="toggle toggle-${paidClass}"></p>`}
           							                                         </div>
																			</div>
																			<img class="balances-card-member-img ${paidClass}" src=${member.imgSrc} alt="Member icon">
																		</div>
																	`
        							}).join("")
        						}

									<div class="balances-members-footer" id=${expense.date.toString()}>
										<button class="add-btn" id="add-expense-member" title="Select expense members"><span>+</span>Add members</button>
										<button class="add-btn" id="edit-expense-btn"><span>+</span>Edit expense</button>
										<span>Subtotal $${expense.cost}</span>
									</div>
								</div>

							</li>
					`
    }).join("")
        }`
}

// !!! ---- currently getExpensesHTML is used wherever renderEsxenses used to be ---- !!!

// function renderExpenses(group) {
// 	if(listExpenses){
//     // listExpenses.textContent = "";
//     group.expenses.forEach(expense => {
//         const listItem = document.createElement("li");
//         listItem.setAttribute("id", expense.date.toString());
//         listItem.classList.add("expense-item");
//         const expenseHeader = document.createElement("h3");
//         expenseHeader.classList.add("balances-members-header");
//         const expenseName = document.createElement("span");
//         const expenseDate = document.createElement("span");
//         expenseName.textContent = titleCase(expense.name);
//         expenseDate.textContent = expense.date.toString();
//         expenseHeader.appendChild(expenseName);
//         expenseHeader.appendChild(expenseDate);
//         const deleteIcon = document.createElement("span");
//         // <span class="delete">&times</span>
//         deleteIcon.classList.add("delete");
//         deleteIcon.innerHTML = "&times";
//         expenseHeader.appendChild(deleteIcon);
//         const expenseMembers = document.createElement("div");

//         expenseMembers.classList.add("balances-members-container");

//         console.log("What are expense members now...");
//         console.log(expense);
//         console.log(`This is expense members`,expense.members);
//         expense.members.forEach(member => {
//             const memberDiv = document.createElement("div");
//             memberDiv.classList.add("balances-card-member");
//             memberDiv.setAttribute("id", member.id)
//             const memberName = document.createElement("p");
//             memberName.classList.add("balances-card-member-name");
//             const memberImg = document.createElement("img");
//             memberImg.classList.add("balances-card-member-img", "paid");
//             memberImg.setAttribute("src", member.imgSrc);
//             memberImg.setAttribute("alt", "Member icon");
//             memberName.textContent = titleCase(member.name);
//             memberName.textContent = member.name;
//             const memberCardStatus = document.createElement("div")
//             memberCardStatus.textContent = memberStatus(member, expense)

//             memberCardStatus.textContent == "Paid" ? memberCardStatus.classList.add("badge", "badge-paid") :
//             memberCardStatus.textContent == "Paid the bill" ? memberCardStatus.classList.add("badge", "badge-payer") :
//             memberCardStatus.classList.add("badge", "badge-unpaid")

//             memberDiv.appendChild(memberName);
//             memberDiv.appendChild(memberCardStatus);
//             memberDiv.appendChild(memberImg);
//             expenseMembers.appendChild(memberDiv);
//         })

//         const expenseFooter = document.createElement("div");
//         expenseFooter.classList.add("balances-members-footer");
//         const btnAddMember = document.createElement("button");
//         btnAddMember.classList.add("add-btn");
//         btnAddMember.textContent = "Add member";
//         btnAddMember.addEventListener("click", (e) => {
//             handleExpenseClick(e);
//             addMembersToExpense(groupsArr[selectedGroupIndex]);
//         })

//         const btnEditExpense = document.createElement("button");
//         btnEditExpense.textContent = "Edit expense";
//         btnEditExpense.addEventListener("click", (e) => {
//             handleExpenseClick(e);
//             editExpense(group.expenses[selectedExpenseIndex])
//         })
//         const spanSubTotal = document.createElement("span");
//         spanSubTotal.textContent = `Subtotal $${expense.cost}`;
//         expenseFooter.appendChild(btnAddMember);
//         expenseFooter.appendChild(btnEditExpense);
//         expenseFooter.appendChild(spanSubTotal);

//         listItem.appendChild(expenseHeader);
//         listItem.appendChild(expenseMembers)
//         listItem.appendChild(expenseFooter)

//         listExpenses.appendChild(listItem);
//     })
// }
// }



const editExpenseDialog = document.getElementById("edit-expense");
const editExpenseForm = document.getElementById("form-edit");
const editExpenseNameInput = document.getElementById("edit-name");
const editExpenseCostInput = document.getElementById("edit-cost");

function editExpense(expense) {
    console.log("editing expense")
    console.log(expense.name)
    console.log(expense.cost)
    editExpenseDialog.showModal();

    editExpenseNameInput.value = expense.name;
    editExpenseCostInput.value = expense.cost;
}

editExpenseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let selectedExpense = groupsArr[selectedGroupIndex].expenses[selectedExpenseIndex];
    selectedExpense.name = editExpenseNameInput.value
    selectedExpense.cost = Number(editExpenseCostInput.value)

    listExpenses.innerHTML = getExpensesHTML(groupsArr[selectedGroupIndex]);

    localStorage.setItem('groups', JSON.stringify(groupsArr));
    editExpenseDialog.close();
})





const otherMembersContainer = document.getElementById("other-members-container")
let checkboxes = [...document.querySelectorAll(".add-member-to-expense")];

function addMembersToExpense(id, group) {
    console.log("Add members to expense called")
    console.log(group)
    otherMembersContainer.textContent = "";
    const expense = group.expenses.find(expense => expense.date === id);
    console.log(expense)
    console.log(group.expense)
    group.expense
    group.membersArr.forEach(member => {
        if (!expense.members.includes(member)) {
            const listItem = document.createElement("li");
            const checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute("id", member.name);
            console.log("Member to add")
            console.log(member.name)
            checkbox.classList.add("add-member-to-expense")
            const label = document.createElement("label");
            label.setAttribute("for", member.name);
            label.textContent = member.name;
            listItem.classList.add("form-control", "form-control-checkbox");
            listItem.appendChild(checkbox);
            listItem.appendChild(label);
            otherMembersContainer.appendChild(listItem)
        }
    })
    checkboxes = [...document.querySelectorAll(".add-member-to-expense")]
    addMembersToExpenseDialog.showModal();
}

// function addMembersToExpense(group) {
//     otherMembersContainer.textContent = "";
//     group.membersArr.forEach(member => {

//         if (!group.expenses[selectedExpenseIndex].members.includes(member)) {
//             const listItem = document.createElement("li");
//             const checkbox = document.createElement("input");
//             checkbox.setAttribute("type", "checkbox");
//             checkbox.setAttribute("id", member.name);
//             checkbox.classList.add("add-member-to-expense")
//             const label = document.createElement("label");
//             label.setAttribute("for", member.name);
//             label.textContent = member.name;
//             listItem.classList.add("form-control-checkbox");
//             listItem.appendChild(checkbox);
//             listItem.appendChild(label);
//             otherMembersContainer.appendChild(listItem)
//         }
//     })
//     checkboxes = [...document.querySelectorAll(".add-member-to-expense")]
//     addMembersToExpenseDialog.showModal();
// }



const btnCloseAddMembersToExpense = document.getElementById("close-add-members-to-expense")

btnCloseAddMembersToExpense.addEventListener("click", (e) => {
    e.preventDefault()
    groupsArr[selectedGroupIndex].membersArr.forEach(member => {
        checkboxes.forEach(checkbox => {
            if (checkbox.checked && checkbox.id.toLowerCase() === member.name.toLowerCase()) {
                // console.log(groupsArr[selectedGroupIndex].expenses[selectedExpenseIndex])
                groupsArr[selectedGroupIndex].expenses[selectedExpenseIndex].members.push(member)
            }

        })
    })
    localStorage.setItem('groups', JSON.stringify(groupsArr));
    addMembersToExpenseDialog.close();
    getExpensesHTML(groupsArr[selectedGroupIndex]);
    renderSelectedGroupInfo(groupsArr[selectedGroupIndex])
});

// console.log(selectedGroupIndex);
// selectedGroup.addEventListener('click', function(event) {
//     if (event.target && event.target.classList.contains('pen')) {
//         const h2 = event.target.closest('.section-main-group-header').querySelector('.section-main-group-title');
//         console.log(h2);
//         const originalName = h2.innerText.trim();
//         const input = document.createElement('input');
//         input.type = "text";
//         input.value = originalName;
//         // input.value = h2.innerText.trim();
//         h2.innerHTML = "";
//         h2.appendChild(input);
//         input.focus();

//         input.addEventListener('keydown', function(e) {
//             if (e.key === 'Enter') {
//                 const updatedName = input.value.trim();
//                 console.log(updatedName);
//                 if (updatedName) {
//                     if (elementType=='h2'){
//                     const groupId = parseInt(editElement.getAttribute('id'));
//                     // console.log(groupId);
//                     const groupIndex = groupsArr.findIndex(group => group.id === groupId);
//                     console.log(groupIndex);
//                     if (groupIndex !== -1) {
//                         console.log(groupsArr[groupIndex])
//                         groupsArr[groupIndex].groupName = updatedName;
//                         console.log(groupsArr);
//                         localStorage.setItem('groups', JSON.stringify(groupsArr));

//                         editElement.innerHTML = `${titleCase(updatedName)}`;
//                     }
//                     }
//                     else if(elementType=='p'){
//                         const memberId = parseInt(editElement.getAttribute('id'));
//                         const groupId = parseInt(editElement.closest('.section-main-group').querySelector('.section-main-group-title').getAttribute('id'));
//                         console.log(`This is group id: ${groupId}`);
//                         const groupIndex = groupsArr.findIndex(group => group.id === groupId);
//                         if (groupIndex!=-1){
//                             const memberIndex = groupsArr[groupIndex].membersArr.findIndex(member=>member.id===memberId);
//                             const friendIndex = friendsListStored.findIndex(friend=>friend.id ===memberId);
//                             console.log(memberIndex);
//                             if(memberIndex!=-1&&friendIndex!=-1){
//                                 groupsArr[groupIndex].membersArr[memberIndex].name = updatedName;
//                                 friendsListStored[friendIndex].name = updatedName;
//                                 localStorage.setItem('groups',JSON.stringify(groupsArr));
//                                 localStorage.setItem('friends',JSON.stringify(friendsListStored));
//                                 editElement.innerHTML = `${titleCase(updatedName)}`
//                             }
//                         }
//                     }

//                 }else{
//                     editElement.innerHTML = `${titleCase(originalName)}`;
//                     // console.log(h2);
//                 }
//             }
//             renderGroups();
//             renderFriends()
//         });
//     }
// });

// name editing
selectedGroup.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('pen')) {
        const editElement = event.target.closest('div').querySelector('.editable');
        // const editElement = event.target.closest('.section-main-group-info-nav-container').previousElementSibling.querySelector('.editable');
        const superDuperParentElement =editElement.parentNode.parentNode.parentNode.parentNode.parentNode;
        console.log(`Edit element parent node`,editElement.parentNode.parentNode.parentNode.parentNode.parentNode.id);
        console.log(`This is value of editelement: ${editElement}`);
        // to check if it is h2(group name) or p (member name)
        const elementType = editElement.tagName.toLowerCase();
        const originalName = editElement.innerText.trim();

        const input = document.createElement('input');
        input.type = "text";
        input.value = originalName;
        // input.value = h2.innerText.trim();
        editElement.innerHTML = ""
        editElement.appendChild(input);
        input.focus();
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                const updatedName = input.value.trim();
                console.log(updatedName);
                if (updatedName) {
                    if (elementType == 'h2') {
                        const groupId = parseInt(editElement.getAttribute('id'));
                        // console.log(groupId);
                        const groupIndex = groupsArr.findIndex(group => group.id === groupId);
                        console.log(groupIndex);
                        if (groupIndex !== -1) {
                            console.log(groupsArr[groupIndex])
                            groupsArr[groupIndex].groupName = updatedName;
                            console.log(groupsArr);
                            localStorage.setItem('groups', JSON.stringify(groupsArr));

                            editElement.innerHTML = `${titleCase(updatedName)}`;
                            renderSelectedGroupInfo(groupsArr[groupIndex]);

                            listExpenses.innerHTML = getExpensesHTML(groupsArr[groupIndex]);
                        }
                        console.log(groupsArr[groupIndex]);
                    }
                    else if (elementType == 'p') {
                        const memberId = parseInt(editElement.getAttribute('id'));
                        const groupId = parseInt(editElement.closest('.section-main-group').querySelector('.section-main-group-title').getAttribute('id'));
                        console.log(`This is group id: ${groupId}`);
                        const groupIndex = groupsArr.findIndex(group => group.id === groupId);
                        if (groupIndex != -1) {
                            const memberIndex = groupsArr[groupIndex].membersArr.findIndex(member => member.id === memberId);
                            const friendIndex = friendsListStored.findIndex(friend => friend.id === memberId);
                            // const expenseMemberIndex = groupsArr[groupIndex].expenses.members.findIndex(expenseMember=>expenseMember.id===memberId);
                            // const expenseMemberIndex = groupsArr[groupIndex].expenses
                            // console.log(`This is expensememberIndex`,expenseMemberIndex);
                            console.log(`This is member index ${memberIndex}`);
                            if (memberIndex != -1 && friendIndex != -1) {
                                groupsArr[groupIndex].expenses.forEach(expense => {
                                    if (parseInt(expense.payer.id) === memberId) {
                                        expense.payer.name = updatedName;
                                    }

                                    expense.members.forEach(member => {
                                        if (member.id === memberId) {
                                            member.name = updatedName;
                                        }
                                    });
                                });
                                groupsArr[groupIndex].membersArr[memberIndex].name = updatedName;
                                // groupsArr[groupIndex].expenses[expenseMemberIndex].name = updatedName;
                                friendsListStored[friendIndex].name = updatedName;
                                localStorage.setItem('groups', JSON.stringify(groupsArr));
                                localStorage.setItem('friends', JSON.stringify(friendsListStored));
                                editElement.innerHTML = `${titleCase(updatedName)}`;
                                console.log(`This is the group`, groupsArr[groupIndex]);
                                console.log(`This is the group with slected`, groupsArr[selectedGroupIndex]);
                                renderFriends();
                                // getExpensesHTML(groupsArr[groupIndex]);

                                // listExpenses.innerHTML = getExpensesHTML(groupsArr[selectedGroupIndex]);

                                renderSelectedGroupInfo(groupsArr[selectedGroupIndex]);
                                // getGroupMembers(groupsArr[selectedGroupIndex]);
                                // groupContainer.innerHTML = getGroupMembers(groupsArr[selectedGroupIndex]);
                                // renderExistingFriendsForGroupCreation(groupsArr[selectedGroupIndex]);
                                if(superDuperParentElement.id=='group-info-container'){
                                    groupContainer.innerHTML = getGroupMembers(groupsArr[selectedGroupIndex]);
                                }else{
                                listExpenses.innerHTML = getExpensesHTML(groupsArr[selectedGroupIndex]);

                                }
                            } else {
                                console.log("Either memberIndex or friendIndex does not exist");
                            }
                        }
                        console.log(groupsArr[groupIndex])
                    }

                } else {
                    editElement.innerHTML = `${titleCase(originalName)}`;
                    // console.log(h2);
                }
            }

            renderGroups();
            renderFriends();
        });
    }
});

// group deletion
document.getElementById('group-list').addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('delete')) {
        const listItem = event.target.closest('li');
        const groupCont = listItem.querySelector('.group-link');
        const groupName = groupCont.childNodes[0].nodeValue.trim();
        // const groupName = listItem.querySelector('group-link').textContent.trim();
        console.log(`Deleting group name: ${groupName}`);
        console.log(`This is group id ${groupCont.id}`);
        const confirmDelete = confirm(`Are you sure you want to delete ${groupName}`)
        if (confirmDelete) {
            const groupIndex = groupsArr.findIndex(group => group.id == groupCont.id);
            if (groupIndex !== -1) {
                console.log(groupIndex);
                groupsArr.splice(groupIndex, 1);
                localStorage.setItem('groups', JSON.stringify(groupsArr));
                renderGroups();
				document.querySelector(".main-group-add-expense").classList.remove("show");
                renderSelectedGroupInfo();
            }
        }
        // listItem.remove();
    }
})

// friend deletion
document.getElementById('friends-list').addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('delete')) {
        console.log(event);
        const listItem = event.target.closest('li');
        const friendName = listItem.childNodes[0].nodeValue.trim();
        console.log(`Deleting friend: ${friendName}`);
        console.log(`This is friend id: ${listItem.id}`);
        const confirmDelete = confirm(`Are you sure you want to delete  ${friendName}`)
        if (confirmDelete) {

            const friendIndex = friendsListStored.findIndex(friend => friend.id == listItem.id);
            console.log(friendIndex);
            if (friendIndex !== -1) {

                friendsListStored.splice(friendIndex, 1);
                localStorage.setItem('friends', JSON.stringify(friendsListStored));
                renderFriends();
            }
            groupsArr.forEach(group => {
                const memberIndex = group.membersArr.findIndex(member => member.id == listItem.id);
                console.log(`deleted the member at ${memberIndex}`);
                if (memberIndex !== -1) {
                    group.membersArr.splice(memberIndex, 1)
                }
            })
            localStorage.setItem('groups', JSON.stringify(groupsArr));
            renderSelectedGroupInfo();
            groupContainer.innerHTML = getGroupMembers(groupsArr[selectedGroupIndex]);
            // renderFriends();
        }
        // listItem.remove();

    }
});

// member deletion
document.getElementById('selected-group').addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('delete')) {
        // console.log('clicked');
        const memberContainer = event.target.closest('.balances-card-member');

        if (memberContainer) {
            const memberItem = memberContainer.querySelector('.balances-card-member-name');
            const memberNameText = memberItem.innerText.trim();
            // console.log(memberNameText);
            console.log(`Trying to delete: ${memberNameText}, with ID: ${memberItem.id}`);
            const confirmDelete = confirm(`Are you sure, you want to delete: ${memberNameText}`);
            if (confirmDelete) {
                console.log("This is selected group array: ", groupsArr[selectedGroupIndex].membersArr);
                const memberIndex = groupsArr[selectedGroupIndex].membersArr.findIndex(member => member.id == memberItem.id);
                console.log('This is member index', memberIndex);
                if (memberIndex !== -1) {
                    groupsArr[selectedGroupIndex].membersArr.splice(memberIndex, 1);
                    localStorage.setItem('groups', JSON.stringify(groupsArr));
                    renderGroups();
                    // renderriends();
                    renderSelectedGroupInfo(groupsArr[selectedGroupIndex]);
                    groupContainer.innerHTML = getGroupMembers(groupsArr[selectedGroupIndex])
                }

            }
        } else {
            console.log('Not found')
        }
    }
})

// expense deletion
if (listExpenses) {
    listExpenses.addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('delete')) {
            // console.log("The expense delete btn was clicked")
            const listItem = event.target.closest('li');
            console.log(listItem);
            // const expenseName = listItem.childNodes[0].childNodes[0].innerText.trim();
            const expenseName = listItem.querySelector('.balances-expenses-header span').innerText;
            const expenseId = listItem.id;
            console.log(expenseName);
            const confirmDelete = confirm(`Are you sure you want to delete: ${expenseName}`)
            if (confirmDelete) {
                let groupIndex = -1;

                groupsArr.forEach((group, index) => {
                    const expenseExists = group.expenses.find(expense => expense.date == expenseId);
                    if (expenseExists) {
                        groupIndex = index;
                    }
                });

                if (groupIndex !== -1) {
                    const expenseIndex = groupsArr[groupIndex].expenses.findIndex(expense => expense.date == expenseId);

                    if (expenseIndex !== -1) {
                        groupsArr[groupIndex].expenses.splice(expenseIndex, 1);
                        localStorage.setItem('groups', JSON.stringify(groupsArr));

                        listExpenses.innerHTML = getExpensesHTML(groupsArr[groupIndex]);

                    }
                }
            }

        }
    });
}

// add member btn under members section
const addMembersToGroupDialog = document.getElementById('add-members-to-group-dialog');
const otherFriendsContainer = document.getElementById('other-friends-container');
const addMemberBtnInsideDialog= document.getElementById('add-member-btn-inside-dialog');
const newMemberInput = document.getElementById('new-member-input');
let friendCheckBoxes = [...document.querySelectorAll(".add-friend-to-group")]


function enterDown(e){
    if (e.key === 'Enter') {
        e.preventDefault();
        addMembers(true);
    }
}

function clickedOn(e){
    e.preventDefault();
    addMembers(true);
}

function clickedClose(e){
    e.preventDefault();
    console.log("Closing friends dialog");
    addMembers(false);
}

function addMembers(includeInput = true) {
    if (includeInput) {
        const inputValue = newMemberInput.value.trim();
        console.log(`This is isnput value`,inputValue);
        let inList = false;

        if (!isEmpty(inputValue)) {
            friendsListStored.forEach(friend => {
                if (friend.name.toLowerCase() === inputValue.toLowerCase()) {
                    inList = true;
                }
            });
            groupsArr[selectedGroupIndex].membersArr.forEach(member => {
                if (member.name.toLowerCase() === inputValue.toLowerCase()) {
                    inList = true;
                }
            });
            if (!inList) {
                const newFriend = createFriend(titleCase(inputValue));
                friendsListStored.push(newFriend);
                groupsArr[selectedGroupIndex].membersArr.push(newFriend);
                clearInputField(newMemberInput);
                newMemberInput.style.display = "none";
                addMemberBtnInsideDialog.style.display = "none";
                newMemberInput.value="";
            } else {
                alert(`Friend ${inputValue} already exists, please enter another one, or choose ${inputValue} from existing friends.`);
                newMemberInput.value = "";
                newMemberInput.focus();
                return false;
            }
        }else{
            alert("Empty values are not allowed");
            newMemberInput.focus();
            return false;
        }
    }

    friendCheckBoxes.forEach(friendCheck=>{
        if(friendCheck.checked){
            const friendToAdd = friendsListStored.find(friend => friend.name === friendCheck.id);
            if(friendToAdd){
                groupsArr[selectedGroupIndex].membersArr.push(friendToAdd);

            }
        }
    })
    localStorage.setItem('friends', JSON.stringify(friendsListStored));
    localStorage.setItem('groups', JSON.stringify(groupsArr));
    groupContainer.innerHTML = getGroupMembers(groupsArr[selectedGroupIndex]);
    addMembersToGroupDialog.close();
    newMemberInput.value="";
    newMemberInput.style.display = "none";
    addMemberBtnInsideDialog.style.display = "none"
}

function addMembersToGroup(index) {
    otherFriendsContainer.textContent = "";
    const addSomeOtherPerson = document.getElementById('add-someother-person');
    addSomeOtherPerson.addEventListener('click', function(e) {
        e.preventDefault();
        newMemberInput.style.display = "block";
        addMemberBtnInsideDialog.style.display = "block";
        newMemberInput.focus();
    });

    newMemberInput.removeEventListener('keydown',enterDown);
    addMemberBtnInsideDialog.removeEventListener('click',clickedOn);
    const btnCloseAddFriendsToGroup = document.getElementById('close-add-members-to-group');
    btnCloseAddFriendsToGroup.removeEventListener('click',clickedClose)

    newMemberInput.addEventListener('keydown',enterDown);
    addMemberBtnInsideDialog.addEventListener('click',clickedOn);
    btnCloseAddFriendsToGroup.addEventListener('click',clickedClose)

    newMemberInput.addEventListener('keydown',enterDown);
    addMemberBtnInsideDialog.addEventListener('click',clickedOn);
    friendsListStored.forEach(friend => {
        const isFriendInGroup = groupsArr[index].membersArr.some(member => member.name === friend.name);
        if (!isFriendInGroup) {
            const listItem = document.createElement("li");
            const checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute("id", friend.name);
            checkbox.classList.add("add-friend-to-group");
            const label = document.createElement("label");
            label.setAttribute("for", friend.name);
            label.textContent = friend.name;
            listItem.classList.add("form-control", "form-control-checkbox");
            listItem.appendChild(checkbox);
            listItem.appendChild(label);
            otherFriendsContainer.appendChild(listItem);
        }
    });
    friendCheckBoxes = [...document.querySelectorAll(".add-friend-to-group")];
    addMembersToGroupDialog.showModal();
}
