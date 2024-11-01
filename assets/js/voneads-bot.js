const BOT_TOKEN = "7742082412:AAEj848FPq8YiiCJ3L-12nI18FLPe9G4l2c";
const CHAT_ID = "-1002404668598";
let isSending = false;

const messageField = document.getElementById("message");
const charCount = document.getElementById("charCount");

messageField.addEventListener("input", () => {
  charCount.textContent = `${messageField.value.length}/500 characters`;
});

async function submitForm() {
  if (isSending || !confirm("Are you sure you want to send this message?")) return;
  
  isSending = true;
  document.getElementById("loadingSpinner").style.display = "block";
  document.getElementById("resultMessage").innerHTML = "";

  const name = sanitizeInput(document.getElementById("name").value);
  const telegramUsername = sanitizeInput(document.getElementById("telegramUsername").value);
  const requestType = document.getElementById("requestType").value;
  const messageContent = sanitizeInput(messageField.value);
  const pageURL = window.location.href;

  try {
    if (!telegramUsername) {
      document.getElementById("resultMessage").innerHTML = "Telegram username is required.";
      return;
    }

    const userIP = await getUserIP();
    const formattedUsername = telegramUsername.replace(/_/g, '#');

    const message = `
📇 *New Contact Message*\n
👤 Name: ${name}\n
✉️ Telegram Username: ${formattedUsername}\n
📂 Request Type: ${requestType}\n
💬 Message: ${messageContent}\n
🌐 IP Address: ${userIP}\n
🔗 Page URL: ${pageURL}`;

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown"
      })
    });

    if (response.ok) {
      document.getElementById("resultMessage").innerHTML = "Message sent successfully!";
      document.getElementById("contactForm").reset();
    } else {
      const error = await response.json();
      document.getElementById("resultMessage").innerHTML = `Failed to send message: ${error.description}`;
    }
  } catch (error) {
    document.getElementById("resultMessage").innerHTML = "Error: " + error.message;
  } finally {
    document.getElementById("loadingSpinner").style.display = "none";
    isSending = false;
  }
}

async function getUserIP() {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  return data.ip;
}

function sanitizeInput(input) {
  return input.replace(/[<>&"'/]/g, "");
}
