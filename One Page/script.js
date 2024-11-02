document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Show loader
    document.getElementById('loader').style.display = 'block';

    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    // Fetch user's IP address
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const userIp = data.ip;

            // Prepare message to send to Telegram
            const telegramMessage = `*New Message*\n`
                + `*Name:* ${name}\n`
                + `*Email:* ${email}\n`
                + `*WhatsApp Number:* ${phone}\n`
                + `*IP Address:* ${userIp}\n`
                + `*Message:* ${message}`;

            // Your Bot Token and Chat ID
            const botToken = '8198746363:AAGuztWsp29HhpSY94OIy2ZlngBfRykQsC8';
            const chatId = '-4539770686';
            const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

            // Send message to Telegram
            fetch(telegramApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: telegramMessage,
                    parse_mode: 'Markdown' // Use Markdown for formatting
                })
            })
            .then(response => {
                // Hide loader
                document.getElementById('loader').style.display = 'none';

                if (response.ok) {
                    alert('Message sent successfully!');
                    document.getElementById('contactForm').reset(); // Reset form
                } else {
                    alert('Failed to send message.');
                }
            })
            .catch(error => {
                console.error('Error sending message:', error);
                alert('An error occurred. Please try again later.');
                // Hide loader
                document.getElementById('loader').style.display = 'none';
            });
        })
        .catch(error => {
            console.error('Error fetching IP address:', error);
            // Hide loader
            document.getElementById('loader').style.display = 'none';
        });
});