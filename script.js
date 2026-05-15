const API_KEY = "YOUR_OPENAI_API_KEY";

async function sendMessage() {

  const input = document.getElementById("userInput");
  const message = input.value;

  if (!message) return;

  addMessage(message, "user");

  input.value = "";

  try {

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    const botReply = data.choices[0].message.content;

    addMessage(botReply, "bot");

  } catch (error) {
    addMessage("Error connecting to AI", "bot");
  }
}

function addMessage(text, sender) {

  const chatBox = document.getElementById("chatBox");

  const messageDiv = document.createElement("div");

  messageDiv.classList.add("message", sender);

  messageDiv.innerText = text;

  chatBox.appendChild(messageDiv);

  chatBox.scrollTop = chatBox.scrollHeight;
}