const socket = io();

const userName = document.querySelector("#userName");
// div som visar namn
const inputU = document.querySelector("#inputU");
//formulär som skickar namnet
const nameU = document.querySelector("#nameU");
// namnet
const startname = document.querySelector("#startname");
// titel på namnformuläret

// --------------------

const inputmessage = document.querySelector("#inputmessage");
//formulär för chatt
const chat = document.querySelector("#chat");
//input för chatt

// -----------------

const msg = document.querySelector("#msg");
//div för meddelande
const time = document.querySelector("#time");
//tiden för meddelandet
const messages = document.querySelector("#messages");

// ------

const dice = document.querySelector("#dice");
// Formulär för tärningsspel
const dicerandom = document.querySelector("#dicerandom");
// Knapp för spelet
const diceresult = document.querySelector("#diceresult");
// div för resultat
const dicelist = document.querySelector("#dicelist");
// lista för resultat
let nameofuser;

inputU.addEventListener("submit", function (e) {
  e.preventDefault();
  nameofuser = nameU.value;
  nameU.value = "";
  userName.innerHTML =
    "<h3>Du har valt " + nameofuser + " som användarnamn </h3>";
  document.getElementById("inputU").style.display = "none";
  document.getElementById("startname").style.display = "none";
  document.getElementById("sendmessage").style.display = "block";
  document.getElementById("inputmessage").style.display = "block";
});

// visar namnet på personen

inputmessage.addEventListener("submit", function (e) {
  e.preventDefault();
  if (chat.value) {
    socket.emit("chatMessage", {
      user: nameofuser,
      message: chat.value,
    });
    chat.value = "";
  }
});

socket.on("time", function (clockMsg) {
  time.innerHTML = clockMsg;
});

socket.on("newChatMessage", function (msg) {
  let item = document.createElement("li");
  //item.textContent = msg;
  item.textContent = msg.user + ": " + msg.message;
  messages.appendChild(item);
});

let sum = 0;
dice.addEventListener("submit", function (e) {
  e.preventDefault();
  let throwdice;
  throwdice = Math.floor(Math.random() * 6 + 1);
  sum += throwdice;
  console.log(throwdice);
  console.log(sum);
  socket.emit("dice", {
    user: nameofuser,
    throwdice: throwdice,
    sum: sum,
  });
});

socket.on("diceresult", function (msg) {
  let result = document.createElement("li");
  result.innerHTML =
    msg.user + " Resultat: " + msg.throwdice + " Total: " + msg.sum;
  dicelist.appendChild(result);
});
