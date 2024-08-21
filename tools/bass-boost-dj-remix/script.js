document.getElementById('applyEffectsButton').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select an audio file first.');
        return;
    }

    const audioUrl = URL.createObjectURL(file);
    const audioPlayer = document.getElementById('audioPlayer');
    const downloadButton = document.getElementById('downloadButton');

    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await fetchAudioBuffer(audioUrl, audioContext);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        const bassBoost = audioContext.createBiquadFilter();
        bassBoost.type = 'lowshelf';
        bassBoost.frequency.value = 150;
        bassBoost.gain.value = 15;

        // Connect the nodes
        source.connect(bassBoost);
        bassBoost.connect(audioContext.destination);

        // Start playback
        source.start();

        // Create WAV Blob and set it for download
        const audioBlob = await bufferToWav(audioBuffer, audioContext);
        const audioUrlProcessed = URL.createObjectURL(audioBlob);

        audioPlayer.src = audioUrlProcessed;
        downloadButton.href = audioUrlProcessed;
        downloadButton.download = 'bass-boosted-remix.wav';
        downloadButton.style.display = 'inline';

    } catch (error) {
        console.error('Error processing audio:', error);
        alert('An error occurred while processing the audio.');
    }
});

async function fetchAudioBuffer(url, audioContext) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return audioContext.decodeAudioData(arrayBuffer);
}

async function bufferToWav(buffer, audioContext) {
    const numOfChan = buffer.numberOfChannels,
          length = buffer.length * numOfChan * 2 + 44,
          sampleRate = buffer.sampleRate,
          wavBuffer = new ArrayBuffer(length),
          view = new DataView(wavBuffer);
    
    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }
    
    function floatTo16BitPCM(output, offset, input) {
        for (let i = 0; i < input.length; i++, offset += 2) {
            const s = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
    }

    writeString(view, 0, 'RIFF');
    view.setUint32(4, length - 8, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numOfChan, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2 * numOfChan, true);
    view.setUint16(32, numOfChan * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, length - 44, true);

    for (let i = 0; i < numOfChan; i++) {
        floatTo16BitPCM(view, 44 + i * buffer.length * 2, buffer.getChannelData(i));
    }

    return new Blob([view], { type: 'audio/wav' });
}
