const BOT_TOKEN = "7915501265:AAHl6Sfnd71WbqIDV6HjUfc2-HX0c6X2GTI"; // Replace with your bot token
const CHAT_ID = "-4580581724"; // Replace with the chat ID where messages should be sent

let isSending = false;
const submitButton = document.querySelector(".button");

// Load saved values from localStorage on page load
window.onload = () => {
  ["name", "email", "whatsapp", "message"].forEach(id => {
    document.getElementById(id).value = localStorage.getItem(id) || "";
  });
};

// Save values in localStorage on input
["name", "email", "whatsapp", "message"].forEach(id => {
  document.getElementById(id).addEventListener("input", (e) => {
    localStorage.setItem(id, e.target.value);
  });
});

// Clear localStorage on form reset
document.getElementById("contactForm").addEventListener("reset", () => {
  localStorage.clear();
});

// Sanitize input to prevent issues with special characters
function sanitizeInput(input) {
  return input.replace(/[<>*_'`]/g, "");
}

// Fetch user IP, with caching in sessionStorage
async function getUserIP() {
  if (sessionStorage.getItem("userIP")) return sessionStorage.getItem("userIP");
  const ipResponse = await fetch('https://api.ipify.org?format=json');
  const ipData = await ipResponse.json();
  sessionStorage.setItem("userIP", ipData.ip);
  return ipData.ip;
}

document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  if (isSending) return;
  isSending = true;
  submitButton.disabled = true;

  const name = sanitizeInput(document.getElementById("name").value);
  const email = sanitizeInput(document.getElementById("email").value);
  const whatsapp = sanitizeInput(document.getElementById("whatsapp").value);
  const messageContent = sanitizeInput(document.getElementById("message").value);
  const userAgent = navigator.userAgent;

  if (!/^\+?[1-9]\d{1,14}$/.test(whatsapp)) {
    document.getElementById("resultMessage").innerHTML = "Please enter a valid WhatsApp number.";
    document.getElementById("resultMessage").classList.add("error");
    isSending = false;
    submitButton.disabled = false;
    return;
  }

  document.getElementById("loadingSpinner").style.display = "block";
  document.getElementById("resultMessage").innerHTML = "";
  document.getElementById("resultMessage").classList.remove("success", "error");

  try {
    const userIP = await getUserIP();

    const message = `
📇 *New Contact Message*\n
👤 Name: ${name}\n
📧 Email: ${email}\n
📱 WhatsApp: ${whatsapp}\n
💬 Message: ${messageContent}\n
🌐 IP Address: ${userIP}\n
🖥️ User-Agent: ${userAgent}`;

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
      document.getElementById("resultMessage").classList.add("success");
      document.getElementById("contactForm").reset();
      localStorage.clear();
    } else {
      const error = await response.json();
      document.getElementById("resultMessage").innerHTML = `Failed to send message: ${error.description}`;
      document.getElementById("resultMessage").classList.add("error");
    }
  } catch (error) {
    document.getElementById("resultMessage").innerHTML = "Error: " + error.message;
    document.getElementById("resultMessage").classList.add("error");
  } finally {
    document.getElementById("loadingSpinner").style.display = "none";
    isSending = false;
    submitButton.disabled = false;
  }
});
