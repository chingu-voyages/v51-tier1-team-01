const groupName = document.getElementById('group-name');
const groupCreateBtn = document.getElementById('group-create-btn');
const groupError = document.getElementById('group-error');
let groupList = document.getElementById('group-list');
groupCreateBtn.addEventListener('click',function(){
    let randomId = Date.now();
    if (groupName.value.trim() === ''){
        groupError.style.display="block";
    }else{
        groupName.value = groupName.value.trim()[0].toUpperCase() + groupName.value.trim().slice(1);
        groupList.innerHTML+=`<li id=${randomId}>${groupName.value}</li>`
        groupName.value='';
        groupError.style.display = "none";
    }
});

// friends management

const friendsList = []; // the overall friends array, the group creation button should pull friends from here

function createFriend(firstName, lastName, imgSrc = './src/images/5907.jpg') { // function to create friend object from input, can be reused in group creation process
    return { firstName, lastName, imgSrc }
}

const groupFriends = document.getElementById("list-friends"); // rendered list of all friends
const btnAddFriend = document.getElementById('btn-add-friend'); // button to show friend creation form

const formAddFriend = document.getElementById('form-add-friend'); // the friend creation form
const inputFriendName = document.getElementById('friend-first-name');
const inputFriendLastName = document.getElementById('friend-last-name');

btnAddFriend.addEventListener("click", () => { // the add friend button just shows the form
    formAddFriend.classList.add("form-add-visible");
});

formAddFriend.addEventListener("submit", (e) => { // function to create friend from input and add friend to overall friend array
    e.preventDefault();
    let firstName = inputFriendName.value;
    let lastName = inputFriendLastName.value;
    const friend = createFriend(firstName, lastName);
    friendsList.push(friend);
    console.table(friendsList);
    inputFriendName.value = '';
    inputFriendLastName.value = '';
    renderFriendList();
});

function renderFriendList() {
    groupFriends.textContent = '';
    friendsList.forEach(friend => {
        const listItemFriend = document.createElement("li");
        const imgFriend = document.createElement("img");
        imgFriend.classList.add("avatar-small");
        imgFriend.setAttribute("src", friend.imgSrc);
        const paraFriendName = document.createElement("p");
        paraFriendName.textContent = `${friend.firstName} ${friend.lastName}`;
        listItemFriend.appendChild(imgFriend);
        listItemFriend.appendChild(paraFriendName);
        listItemFriend.classList.add("list-item-friend");
        groupFriends.appendChild(listItemFriend);
        formAddFriend.classList.remove('form-add-visible');
    })
}









