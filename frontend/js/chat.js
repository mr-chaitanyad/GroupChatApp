const socket = io();

let username = prompt("Enter your name:");
if (!username || username.trim() === "") username = "Anonymous";

document.getElementById("userDisplay").textContent = `You: ${username}`;

socket.emit("new_user", username);

const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const chatBox = document.getElementById("chatBox");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (message) {
    socket.emit("send_message", { username, message });
    appendMessage("You", message, "right");
    input.value = "";
  }
});

socket.on("receive_message", (data) => {
  if (data.username === "System") {
    const msg = document.createElement("p");
    msg.className = "system";
    msg.textContent = data.message;
    chatBox.appendChild(msg);
  } else if (data.username !== username) {
    appendMessage(data.username, data.message, "left");
  }
  chatBox.scrollTop = chatBox.scrollHeight;
});

function appendMessage(name, message, position) {
  const msg = document.createElement("div");
  msg.classList.add("message", position);
  msg.textContent = `${name}: ${message}`;
  chatBox.appendChild(msg);
}
