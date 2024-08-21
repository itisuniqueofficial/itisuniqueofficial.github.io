document.addEventListener('DOMContentLoaded', () => {
    tsParticles.load('particles-js', {
        background: {
            color: {
                value: '#f5f5f5'
            }
        },
        particles: {
            color: {
                value: '#007bff'
            },
            links: {
                color: '#007bff',
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1
            },
            collisions: {
                enable: true
            },
            move: {
                direction: 'none',
                enable: true,
                outModes: {
                    default: 'bounce'
                },
                random: false,
                speed: 1,
                straight: false
            },
            number: {
                density: {
                    enable: true,
                    area: 800
                },
                value: 100
            },
            opacity: {
                value: 0.5,
                random: true,
                animation: {
                    enable: true,
                    speed: 1,
                    minimumValue: 0.1
                }
            },
            shape: {
                type: 'circle'
            },
            size: {
                value: { min: 1, max: 5 },
                random: true,
                animation: {
                    enable: true,
                    speed: 5,
                    minimumValue: 0.1
                }
            }
        },
        detectRetina: true
    });

    const fileInput = document.getElementById('fileInput');
    const applyEffectsButton = document.getElementById('applyEffectsButton');
    const audioPlayer = document.getElementById('audioPlayer');
    const downloadButton = document.getElementById('downloadButton');

    applyEffectsButton.addEventListener('click', async () => {
        const file = fileInput.files[0];

        if (!file) {
            alert('Please select an audio file first.');
            return;
        }

        const audioUrl = URL.createObjectURL(file);

        // Animate the button during processing
        applyEffectsButton.classList.add('processing');
        applyEffectsButton.disabled = true;
        applyEffectsButton.textContent = 'Processing...';

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate effects application
        audioPlayer.src = audioUrl;
        downloadButton.href = audioUrl;
        downloadButton.style.display = 'inline';
        applyEffectsButton.disabled = false;
        applyEffectsButton.textContent = 'Apply Bass Boost';
        applyEffectsButton.classList.remove('processing');
    });

    // Add CSS animation for button processing state
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }

        button.processing {
            animation: pulse 1s infinite;
            background: #0056b3;
            cursor: wait;
        }
    `;
    document.head.appendChild(styleSheet);
});
