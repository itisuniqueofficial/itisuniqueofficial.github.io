const revealButton = document.getElementById('revealButton');
const countdownDisplay = document.getElementById('countdown');
const linkButton = document.getElementById('link');

const startCountdown = () => {
    let countdown = 30; // Reset countdown
    countdownDisplay.textContent = `Link will be revealed in ${countdown} seconds...`;
    revealButton.style.display = 'none'; // Hide the reveal button

    const countdownInterval = setInterval(() => {
        countdown--;
        countdownDisplay.textContent = `Link will be revealed in ${countdown} seconds...`;

        if (countdown <= 0) {
            clearInterval(countdownInterval);
            countdownDisplay.textContent = ''; // Clear countdown message
            linkButton.style.display = 'block'; // Show the link button
        }
    }, 1000);
};

revealButton.addEventListener('click', startCountdown);
