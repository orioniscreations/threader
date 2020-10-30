const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// get username and room from URL
const {
  username,
  room
} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

socket.on('connect', () => {
  //  when user joins room:
  socket.emit('joinRoom', {
    username,
    room
  });
})
// get room and users
socket.on('roomUsers', ({
  room,
  users
}) => {
  outputRoomName(room);
  outputUsers(users);
});

// message from server
socket.on('message', message => {
  outputMessage(message);

  // scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message from server
socket.on('msglist', messages => {
  console.log({
    messages
  });
});

// message submit:
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get message text
  const msg = e.target.elements.msg.value;
  // emit the message to the server
  socket.emit('chatMessage', msg);
  // clear input after sending
  e.target.elements.msg.value = '';
  // focuses on empty input
  e.target.elements.msg.focus();

});

// output message to dom
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
          <p class="text">
           ${message.text}
          </p>`;
  document.querySelector('.chat-messages').appendChild(div);
};

// add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
};

// add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
  ${users.map(user => `<li>${user.username}</li>`).join('')}
  `
};