// list of all our groups, will be stored in Local Storage
const groupsList = [];
console.log(groupsList);

const groupForm = document.getElementById("group-form");

groupForm.addEventListener("submit", createNewGroup);

class Group {
  constructor(groupName, memberNames) {
    this.groupName = groupName;
    this.memberNames = memberNames;
  }
}

// function that takes input values for each group, creates new group, and pushes it into the array og groups
function createNewGroup(event) {
  event.preventDefault();
  console.log("submitted");

  //input variables
  const groupNameInput = document.getElementById("group-name");
  const groupMembersInput = document.querySelectorAll(".member-name");

  //get group name, clear input field
  const groupName = groupNameInput.value;
  groupNameInput.value = "";

  //get members array, clear input fields
  const groupMembersArr = Array.from(groupMembersInput).map((input) => {
    let value = input.value;
    input.value = "";
    return value;
  });

  //create new group, push it in groupsList array
  const newGroup = new Group(groupName, groupMembersArr);
  console.log(newGroup);
  return groupsList.push(newGroup);
}
