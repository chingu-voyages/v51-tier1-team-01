import { totalOutstandingCalc, memberStatus, memberTotal, totalCalc } from "./calcs.js";
import { getGroupSummary } from "./summary.js";

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

const suggestionsList = document.querySelector(".suggestions")
const suggestionsContainer = document.querySelector(".suggestions-container")

let selectedGroupIndex = -1;

if (groupsArr.length !== 0) {
    hideForm()
    renderSelectedGroupInfo(groupsArr[0]);
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

    if (event.target.matches(".group-link") || event.target.matches(".group-balances") || event.target.matches(".group-members") || event.target.matches("#summary") || event.target.matches(".toggle")) {


        const selectedGroupId = event.target.closest(".group-link")?.id || event.target.closest(".section-main-group-info-nav-container")?.id;

        const selectedGroup = groupsArr.find(group => {
            return group.id == selectedGroupId ? group : console.log("there's no group with same id in group array")
        })

        document.querySelector(".active")?.classList.remove("active")
        event.target.closest(".section-main-group-info-nav li")?.classList.add("active")

        if (event.target.matches(".group-balances") || event.target.matches(".group-link")) {

            listExpenses.innerHTML = getExpensesHTML(selectedGroup)
            groupContainer.innerHTML = ""
            document.querySelector(".group-balances").classList.add("active")
            document.querySelector(".main-group-add-expense").classList.add("show");
            renderSelectedGroupInfo(selectedGroup, groupContainer.appendChild(listExpenses))

        } else if (event.target.matches("#summary")) {

            groupContainer.innerHTML = getGroupSummary(selectedGroup)
            document.querySelector(".main-group-add-expense").classList.remove("show");
            renderSelectedGroupInfo(selectedGroup, groupContainer)

        } else if (event.target.matches(".toggle")) {

			const expenseId = event.target.closest(".expense-item").id
			const expense = groupsArr[selectedGroupIndex].expenses.find( expense => expense.date === Number(expenseId))
			const member = expense.members.find(member => Number(member.id) === Number(event.target.id))
			toggleMemberStatus(expense, member)
			listExpenses.innerHTML = getExpensesHTML(groupsArr[selectedGroupIndex])
			// event.target.parentNode.parentNode.parentNode.parentNode.classList.add("show")
			document.querySelector(".balances-expenses-container")?.classList.add("show")
			document.querySelector(".balances-expenses-header")?.classList.add("show")
			renderSelectedGroupInfo(groupsArr[selectedGroupIndex], listExpenses)

        } else if (event.target.matches(".group-members")) {

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
            toggle.classList.contains("show") ? toggle.classList.remove("show") : toggle.classList.add("show");
			toggle.classList.contains("show") ? document.querySelector(".balances-expenses-header")?.classList.add("show") : document.querySelector(".balances-expenses-header")?.classList.remove("show")
			return
        }
    } else {
        event.stopPropagation()
    }

    if (event.target.matches("#add-expense-member")) {
        event.stopPropagation()
        const groupId = document.querySelector(".section-main-group-info-nav-container").id
        const group = groupsArr.find(group => group.id === Number(groupId))
        const expenseId = Number(event.target.parentNode.id)

        addMembersToExpense(expenseId, group);
        listExpenses.innerHTML = getExpensesHTML(group)
        document.querySelector(".balances-expenses-container")?.classList.add("show")
        renderSelectedGroupInfo(group, listExpenses)
    } else {
        event.stopPropagation()
    }
    // add member btn below members section
    if (event.target.matches("#add-member-btn")) {
        event.stopPropagation()
        addMembersToGroup(selectedGroupIndex);
    } else {
        event.stopPropagation()
    }

    if (event.target.matches("#edit-expense-btn")) {
        {
            event.stopPropagation()

            const expenseId = Number(event.target.parentNode.id)
            const group = groupsArr.find(group => {
                return group.expenses.find(expense => expense.date === Number(expenseId))
            })
            const expense = group.expenses.find(expense => expense.date === Number(expenseId))
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

        setTimeout(() => {
            if (confirm("Do you want to download your group's expense summary?")) {
                const pdfExp = document.querySelector("#group-info-container");
                var opt = {
                    margin: 1,
                    filename: `${group.groupName}-summary.pdf`,
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                };
                html2pdf(pdfExp, opt);
            }
        }, 1000)

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

function renderSelectedGroupInfo(group, content) {
    if (groupsArr.length > 0) {
        selectedGroup.classList.remove("hidden");
        const { groupName, id, avatar, membersArr, expenses } = group;
        const header = document.querySelector(".section-main-group-header")
        header.innerHTML = "";
        document.querySelector(".section-main-group-info-nav-container").id = id;
        selectedGroupIndex = groupsArr.indexOf(group);

        renderSelectPayerOptions();

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
        if (content) {
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
    fromUserInput.style.borderColor = "#006091";
    document.querySelectorAll('.default').forEach(member => {
        defaultBorder(member.id);
    })
}

function hideForm() {
    groupForm.style.display = "none";
    const inputs = [...((document.querySelectorAll(".group-member"))), (document.querySelector("#group-name"))]
    inputs.forEach(input => input.value = "")
}

//manage fields
function addMemberInputField() {
    const fields = Array.from(document.querySelectorAll(".group-member"))
    const notFilled = fields.find(field => !field.value)
    if (fields.length < 5 || (fields.length > 4 && !notFilled)) {
        const newMemberInput = document.createElement('input');
        newMemberInput.className = 'group-member';
        newMemberInput.placeholder = 'Add Member';
        memberInputs.appendChild(newMemberInput);
    } else {
        alert("Fill in previous fields please")
    }
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

function createFriend(name, id = Date.now() + Math.floor(Math.random() * 1000), imgSrc = 'src/img/person-icon.png') { 
    return { name, id, imgSrc }

}

//group object
function createNewGroup(name) {

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
    return newGroup;
}

function renderFriends() {
    friendsList.innerHTML = "";
    friendsListStored.forEach(friend => {
        const friendElement = createListItem(friend.name);
        const friendImg = document.createElement("img");
        const deleteIcon = document.createElement("span");
        deleteIcon.classList.add("delete");
        deleteIcon.innerHTML = "&times";
        friendElement.setAttribute('id', friend.id);
        friendImg.setAttribute("src", friend.imgSrc);
        friendImg.classList.add("group-icon");
        friendElement.appendChild(friendImg);
        friendElement.appendChild(deleteIcon);
        friendsList.appendChild(friendElement);
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
    })
}

//group form autocomplete

memberInputs.addEventListener("keyup", suggestedFriend)

document.getElementById("close-suggestion").addEventListener("click", () => {
    suggestionsContainer.classList.remove("show");
})

suggestionsList.addEventListener("click", (event) => {
    const userInput = event.target.closest("li").textContent
    const inputsArr = Array.from(document.querySelectorAll(".group-member"))
    inputsArr.forEach(input => {
        if (input.classList.contains("current-input")) {
            input.value = userInput
            suggestionsContainer.classList.remove("show")
            input.classList.remove("current-input")
        }
    })
})

function showSuggestions(list) {
    suggestionsContainer.classList.add("show")
    suggestionsList.innerHTML = ""
    list.map(item => {
        const li = document.createElement("li")
        li.textContent = titleCase(item.name)
        suggestionsList.appendChild(li)
    })
}

function suggestedFriend() {
    const inputsArr = Array.from(document.querySelectorAll(".group-member"))
    inputsArr.forEach(input => {
        if (document.activeElement === input) {
            input.classList.add("current-input")
            const searchValue = input.value
            let suggestions = []
            if (searchValue.length) {
                suggestions = friendsListStored.filter(friend => friend.name.toLowerCase().includes(searchValue.toLowerCase()))
            }
            suggestions.length ? showSuggestions(suggestions) : suggestionsContainer.classList.remove("show")
            suggestions.forEach(sugg => {
                if (searchValue.toLowerCase() === sugg.name.toLowerCase()) { suggestionsContainer.classList.remove("show") }
            })
        } else {
            input.classList.remove("current-input")
        }
    })
}

function handleGroupCreation(e) {
    e.stopPropagation()
    e.preventDefault();
    let allMembersInput = document.querySelectorAll('.group-member');
    if (allMembersInput.length > 0) {
        let inputMemberNames = Array.from(allMembersInput).map(input => input.value.trim().toLowerCase());
        if (new Set(inputMemberNames).size !== inputMemberNames.length) {
            alert("Duplicate name");
            return false;
        }
    } else {
        console.log("allMembersInput is empty");
    }
    const tempMemberArr = [];
    if (tempExistingFriendsIdsArr.length) {
        tempExistingFriendsIdsArr.forEach(checkboxId => {
            friendsListStored.forEach(friend => {
                if (checkboxId.toLowerCase() === friend.name.toLowerCase()) {
                    tempMemberArr.push(friend)
                }
            })
        })
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
                    tempMemberArr.push(newFriend);
                } else {
                    console.log(friendsListStored.find(friend => {
                        if (friend.name.toLowerCase() === input.value.toLowerCase()) {
                            console.log(friend)
                            tempMemberArr.push(friend)
                        }
                    }))
                }
                clearInputField(input);
            }
        });

        if (tempMemberArr.length >= 2) {
            const newGroup = createNewGroup(groupName.value); 
            selectedGroupIndex = groupsArr.length - 1 
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
        renderSelectedGroupInfo(groupsArr[selectedGroupIndex]); 
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

showAddFriendForm.addEventListener("click", () => { 
    formAddFriend.classList.toggle("form-add-visible");
});

formAddFriend.addEventListener("submit", (e) => { 
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

const tempExistingFriendsIdsArr = [];

// expense management

// create new expense

function createExpense(name, cost, payer, groupIndex) {
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
            groupsArr[selectedGroupIndex].membersArr.forEach(member => {
                if (member.name === option.value) {
                    selectedPayer = member;
                }
            })
        }


    })
    const newExpense = createExpense(inputExpenseName.value, inputExpenseAmount.value, selectedPayer, selectedGroupIndex);
    groupsArr[selectedGroupIndex].expenses.push(newExpense);
    localStorage.setItem('groups', JSON.stringify(groupsArr));
    inputExpenseName.value = "";
    inputExpenseAmount.value = "";
    formAddExpense.classList.add("hidden");
    listExpenses.innerHTML = getExpensesHTML(groupsArr[selectedGroupIndex]);
})

const addMembersToExpenseDialog = document.getElementById("add-members-to-expense");

if (listExpenses) {
    listExpenses.addEventListener("click", handleExpenseClick)
}
let selectedExpenseIndex;

function handleExpenseClick(e) {
    let selectedExpenseId = Number(e.target.closest(".expense-item").id);
    groupsArr.forEach(group => {
        group.expenses.forEach(expense => {
            if (expense.date === selectedExpenseId) {
                selectedExpenseIndex = group.expenses.indexOf(expense);
            }
        })
    })
}

function toggleMemberStatus(expense, member) {
    if (expense.paid.includes(member.name)) {
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
    const { expenses } = group;
    return `${expenses.map(expense => {
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

const editExpenseDialog = document.getElementById("edit-expense");
const editExpenseForm = document.getElementById("form-edit");
const editExpenseNameInput = document.getElementById("edit-name");
const editExpenseCostInput = document.getElementById("edit-cost");

function editExpense(expense) {
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

    otherMembersContainer.textContent = "";
    const expense = group.expenses.find(expense => expense.date === id);
    group.membersArr.forEach(groupMember => {
        const isMemberInExpense = expense.members.some(expenseMember => expenseMember.name === groupMember.name)
        if (!isMemberInExpense) {
            const listItem = document.createElement("li");
            const checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute("id", groupMember.name);
            checkbox.classList.add("add-member-to-expense")
            const label = document.createElement("label");
            label.setAttribute("for", groupMember.name);
            label.textContent = groupMember.name;
            listItem.classList.add("form-control", "form-control-checkbox");
            listItem.appendChild(checkbox);
            listItem.appendChild(label);
            otherMembersContainer.appendChild(listItem)
        }
    })

    checkboxes = [...document.querySelectorAll(".add-member-to-expense")]
    addMembersToExpenseDialog.showModal();
}

const btnCloseAddMembersToExpense = document.getElementById("close-add-members-to-expense")

btnCloseAddMembersToExpense.addEventListener("click", (e) => {
    e.preventDefault()
    groupsArr[selectedGroupIndex].membersArr.forEach(member => {
        checkboxes.forEach(checkbox => {
            if (checkbox.checked && checkbox.id.toLowerCase() === member.name.toLowerCase()) {
                groupsArr[selectedGroupIndex].expenses[selectedExpenseIndex].members.push(member)
            }

        })
    })
    localStorage.setItem('groups', JSON.stringify(groupsArr));
    addMembersToExpenseDialog.close();
    listExpenses.innerHTML = getExpensesHTML(groupsArr[selectedGroupIndex])
	  document.querySelector(".balances-expenses-container")?.classList.add("show")
	  document.querySelector(".balances-expenses-header")?.classList.add("show")
	  renderSelectedGroupInfo(groupsArr[selectedGroupIndex], listExpenses)
});

// name editing
selectedGroup.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('pen')) {
        const editElement = event.target.closest('div').querySelector('.editable');
        const superDuperParentElement = editElement.parentNode.parentNode.parentNode.parentNode.parentNode;
        const elementType = editElement.tagName.toLowerCase();
        const originalName = editElement.innerText.trim();

        const input = document.createElement('input');
        input.type = "text";
        input.value = originalName;
        editElement.innerHTML = ""
        editElement.appendChild(input);
        input.focus();
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                const updatedName = input.value.trim();
                if (updatedName) {
                    if (elementType == 'h2') {
                        const groupId = parseInt(editElement.getAttribute('id'));
                        const groupIndex = groupsArr.findIndex(group => group.id === groupId);
                        if (groupIndex !== -1) {
                            groupsArr[groupIndex].groupName = updatedName;
                            localStorage.setItem('groups', JSON.stringify(groupsArr));

                            editElement.innerHTML = `${titleCase(updatedName)}`;
                            renderSelectedGroupInfo(groupsArr[groupIndex]);

                            listExpenses.innerHTML = getExpensesHTML(groupsArr[groupIndex]);
                        }
                    }
                    else if (elementType == 'p') {
                        const memberId = parseInt(editElement.getAttribute('id'));
                        const groupId = parseInt(editElement.closest('.section-main-group').querySelector('.section-main-group-title').getAttribute('id'));
                        const groupIndex = groupsArr.findIndex(group => group.id === groupId);
                        if (groupIndex != -1) {
                            const memberIndex = groupsArr[groupIndex].membersArr.findIndex(member => member.id === memberId);
                            const friendIndex = friendsListStored.findIndex(friend => friend.id === memberId);
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
                                friendsListStored[friendIndex].name = updatedName;
                                localStorage.setItem('groups', JSON.stringify(groupsArr));
                                localStorage.setItem('friends', JSON.stringify(friendsListStored));
                                editElement.innerHTML = `${titleCase(updatedName)}`;
                                renderFriends();
                                renderSelectedGroupInfo(groupsArr[selectedGroupIndex]);
                                if (superDuperParentElement.id == 'group-info-container') {
                                    groupContainer.innerHTML = getGroupMembers(groupsArr[selectedGroupIndex]);
                                } else {
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
        const confirmDelete = confirm(`Are you sure you want to delete ${groupName}`)
        if (confirmDelete) {
            const groupIndex = groupsArr.findIndex(group => group.id == groupCont.id);
            if (groupIndex !== -1) {
                groupsArr.splice(groupIndex, 1);
                localStorage.setItem('groups', JSON.stringify(groupsArr));
                renderGroups();
                document.querySelector(".main-group-add-expense").classList.remove("show");
                renderSelectedGroupInfo();
            }
        }
    }
})

// friend deletion
document.getElementById('friends-list').addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('delete')) {
        const listItem = event.target.closest('li');
        const friendName = listItem.childNodes[0].nodeValue.trim();
        const confirmDelete = confirm(`Are you sure you want to delete  ${friendName}`)
        if (confirmDelete) {

            const friendIndex = friendsListStored.findIndex(friend => friend.id == listItem.id);
            if (friendIndex !== -1) {

                friendsListStored.splice(friendIndex, 1);
                localStorage.setItem('friends', JSON.stringify(friendsListStored));
                renderFriends();
            }
            groupsArr.forEach(group => {
                const memberIndex = group.membersArr.findIndex(member => member.id == listItem.id);
                if (memberIndex !== -1) {
                    group.membersArr.splice(memberIndex, 1)
                }
            })
            localStorage.setItem('groups', JSON.stringify(groupsArr));
            renderSelectedGroupInfo();
            groupContainer.innerHTML = getGroupMembers(groupsArr[selectedGroupIndex]);
        }

    }
});

// member deletion
document.getElementById('selected-group').addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('delete')) {
        const memberContainer = event.target.closest('.balances-card-member');

        if (memberContainer) {
            const memberItem = memberContainer.querySelector('.balances-card-member-name');
            const memberNameText = memberItem.innerText.trim();
            const confirmDelete = confirm(`Are you sure, you want to delete: ${memberNameText}`);
            if (confirmDelete) {
                const memberIndex = groupsArr[selectedGroupIndex].membersArr.findIndex(member => member.id == memberItem.id);
                if (memberIndex !== -1) {
                    groupsArr[selectedGroupIndex].membersArr.splice(memberIndex, 1);
                    localStorage.setItem('groups', JSON.stringify(groupsArr));
                    renderGroups();
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
            const listItem = event.target.closest('li');
            const expenseName = listItem.querySelector('.balances-expenses-header span').innerText;
            const expenseId = listItem.id;
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
const addMemberBtnInsideDialog = document.getElementById('add-member-btn-inside-dialog');
const newMemberInput = document.getElementById('new-member-input');
let friendCheckBoxes = [...document.querySelectorAll(".add-friend-to-group")]


function enterDown(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addMembers(true);
    }
}

function clickedOn(e) {
    e.preventDefault();
    addMembers(true);
}

function clickedClose(e) {
    e.preventDefault();
    addMembers(false);
}

function addMembers(includeInput = true) {
    if (includeInput) {
        const inputValue = newMemberInput.value.trim();
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
                newMemberInput.value = "";
            } else {
                alert(`Friend ${inputValue} already exists, please enter another one, or choose ${inputValue} from existing friends.`);
                newMemberInput.value = "";
                newMemberInput.focus();
                return false;
            }
        } else {
            alert("Empty values are not allowed");
            newMemberInput.focus();
            return false;
        }
    }

    friendCheckBoxes.forEach(friendCheck => {
        if (friendCheck.checked) {
            const friendToAdd = friendsListStored.find(friend => friend.name === friendCheck.id);
            if (friendToAdd) {
                groupsArr[selectedGroupIndex].membersArr.push(friendToAdd);

            }
        }
    })
    localStorage.setItem('friends', JSON.stringify(friendsListStored));
    localStorage.setItem('groups', JSON.stringify(groupsArr));
    groupContainer.innerHTML = getGroupMembers(groupsArr[selectedGroupIndex]);
    addMembersToGroupDialog.close();
    newMemberInput.value = "";
    newMemberInput.style.display = "none";
    addMemberBtnInsideDialog.style.display = "none"
}

function addMembersToGroup(index) {
    otherFriendsContainer.textContent = "";
    const addSomeOtherPerson = document.getElementById('add-someother-person');
    addSomeOtherPerson.addEventListener('click', function (e) {
        e.preventDefault();
        newMemberInput.style.display = "block";
        addMemberBtnInsideDialog.style.display = "block";
        newMemberInput.focus();
    });

    newMemberInput.removeEventListener('keydown', enterDown);
    addMemberBtnInsideDialog.removeEventListener('click', clickedOn);
    const btnCloseAddFriendsToGroup = document.getElementById('close-add-members-to-group');
    btnCloseAddFriendsToGroup.removeEventListener('click', clickedClose)

    newMemberInput.addEventListener('keydown', enterDown);
    addMemberBtnInsideDialog.addEventListener('click', clickedOn);
    btnCloseAddFriendsToGroup.addEventListener('click', clickedClose)

    newMemberInput.addEventListener('keydown', enterDown);
    addMemberBtnInsideDialog.addEventListener('click', clickedOn);
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
