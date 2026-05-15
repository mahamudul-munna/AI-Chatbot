// =======================================
// CREAMY AI CHATBOT
// =======================================

// ----------------------
// CONFIG
// ----------------------

const API_KEY =
  "YOUR_OPENAI_API_KEY";

const API_URL =
  "https://api.openai.com/v1/chat/completions";


// ----------------------
// SELECT ELEMENTS
// ----------------------

const chatBox =
  document.getElementById(
    "chat-box"
  );

const userInput =
  document.getElementById(
    "user-input"
  );

const sendBtn =
  document.getElementById(
    "send-btn"
  );

const themeBtn =
  document.getElementById(
    "theme-btn"
  );


// ----------------------
// CHAT MEMORY
// ----------------------

let messages = [

  {
    role:"system",
    content:
      `You are a professional,
      smooth and friendly AI assistant.`
  }

];


// ----------------------
// INITIALIZE
// ----------------------

initialize();

function initialize(){

  loadChats();

  if(messages.length === 1){

    addMessage(
      "Hello 👋\nHow can I help you today?",
      "bot"
    );

  }

}


// ----------------------
// EVENTS
// ----------------------

sendBtn.addEventListener(
  "click",
  sendMessage
);

userInput.addEventListener(
  "keydown",
  (e)=>{

    if(e.key === "Enter"){

      sendMessage();

    }

  }
);

themeBtn.addEventListener(
  "click",
  toggleTheme
);


// ----------------------
// SEND MESSAGE
// ----------------------

async function sendMessage(){

  const text =
    userInput.value.trim();

  if(!text) return;

  // ADD USER MESSAGE

  addMessage(text,"user");

  messages.push({

    role:"user",
    content:text

  });

  userInput.value = "";

  showTyping();

  try{

    const response =
      await fetch(API_URL,{

        method:"POST",

        headers:{

          "Content-Type":
            "application/json",

          "Authorization":
            `Bearer ${API_KEY}`

        },

        body:JSON.stringify({

          model:"gpt-4.1-mini",

          messages:messages,

          temperature:0.7,

          max_tokens:500

        })

      });

    const data =
      await response.json();

    removeTyping();

    // API ERROR

    if(data.error){

      addMessage(
        "⚠️ " + data.error.message,
        "bot"
      );

      return;

    }

    const reply =
      data.choices[0]
      .message.content;

    // SAVE AI MESSAGE

    messages.push({

      role:"assistant",
      content:reply

    });

    // TYPE EFFECT

    typeEffect(reply);

    saveChats();

  }

  catch(error){

    removeTyping();

    addMessage(
      "⚠️ Failed to connect.",
      "bot"
    );

    console.error(error);

  }

}


// ----------------------
// ADD MESSAGE
// ----------------------

function addMessage(
  text,
  sender
){

  const wrapper =
    document.createElement("div");

  wrapper.className =
    "message-wrapper";

  const message =
    document.createElement("div");

  message.className =
    `message ${sender}`;

  message.innerText = text;

  const time =
    document.createElement("span");

  time.className = "time";

  time.innerText =
    getCurrentTime();

  wrapper.appendChild(message);

  wrapper.appendChild(time);

  chatBox.appendChild(wrapper);

  scrollBottom();

}


// ----------------------
// TYPING EFFECT
// ----------------------

function typeEffect(text){

  const wrapper =
    document.createElement("div");

  wrapper.className =
    "message-wrapper";

  const bubble =
    document.createElement("div");

  bubble.className =
    "message bot";

  wrapper.appendChild(bubble);

  chatBox.appendChild(wrapper);

  let index = 0;

  const interval =
    setInterval(()=>{

      bubble.innerText +=
        text.charAt(index);

      index++;

      scrollBottom();

      if(index >= text.length){

        clearInterval(interval);

        const time =
          document.createElement(
            "span"
          );

        time.className =
          "time";

        time.innerText =
          getCurrentTime();

        wrapper.appendChild(time);

      }

    },12);

}


// ----------------------
// TYPING ANIMATION
// ----------------------

function showTyping(){

  const typing =
    document.createElement("div");

  typing.className =
    "message-wrapper";

  typing.id = "typing";

  typing.innerHTML = `

    <div class="typing-box">

      <span></span>
      <span></span>
      <span></span>

    </div>

  `;

  chatBox.appendChild(typing);

  scrollBottom();

}

function removeTyping(){

  const typing =
    document.getElementById(
      "typing"
    );

  if(typing){

    typing.remove();

  }

}


// ----------------------
// SAVE CHATS
// ----------------------

function saveChats(){

  localStorage.setItem(

    "creamy-ai-chat",

    JSON.stringify(messages)

  );

}


// ----------------------
// LOAD CHATS
// ----------------------

function loadChats(){

  const saved =
    localStorage.getItem(
      "creamy-ai-chat"
    );

  if(!saved) return;

  messages =
    JSON.parse(saved);

  chatBox.innerHTML = "";

  messages.forEach(msg=>{

    if(msg.role === "system")
      return;

    addMessage(

      msg.content,

      msg.role === "user"
      ? "user"
      : "bot"

    );

  });

}


// ----------------------
// THEME TOGGLE
// ----------------------

function toggleTheme(){

  document.body.classList
    .toggle("dark-mode");

}


// ----------------------
// SCROLL
// ----------------------

function scrollBottom(){

  chatBox.scrollTop =
    chatBox.scrollHeight;

}


// ----------------------
// TIME
// ----------------------

function getCurrentTime(){

  const now =
    new Date();

  return now.toLocaleTimeString(
    [],
    {
      hour:"2-digit",
      minute:"2-digit"
    }
  );

}
