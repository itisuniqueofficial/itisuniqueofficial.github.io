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

    // Create a new AudioContext
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Load the audio file
    const audioBuffer = await fetchAudioBuffer(audioUrl, audioContext);

    // Create a buffer source and set it to the loaded audio buffer
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    // Create a bass boost filter
    const bassBoost = audioContext.createBiquadFilter();
    bassBoost.type = 'lowshelf';
    bassBoost.frequency.value = 150; // Frequency for bass boost
    bassBoost.gain.value = 15; // Gain for bass boost

    // Create a buffer to store the processed audio
    const processedAudioBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioContext.sampleRate
    );
    
    // Copy data from the original buffer to the processed buffer
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        processedAudioBuffer.copyToChannel(audioBuffer.getChannelData(i), i);
    }

    // Process the audio with the bass boost effect
    const processor = audioContext.createScriptProcessor(4096, audioBuffer.numberOfChannels, audioBuffer.numberOfChannels);
    processor.onaudioprocess = (event) => {
        const inputData = event.inputBuffer.getChannelData(0);
        const outputData = event.outputBuffer.getChannelData(0);
        // Apply bass boost effect here
        for (let i = 0; i < inputData.length; i++) {
            outputData[i] = inputData[i]; // Replace with effect processing
        }
    };

    source.connect(bassBoost);
    bassBoost.connect(processor);
    processor.connect(audioContext.destination);

    // Start the source
    source.start();

    // Create a WAV Blob and set it for download
    const audioBlob = await bufferToWav(processedAudioBuffer);
    const audioUrlProcessed = URL.createObjectURL(audioBlob);

    audioPlayer.src = audioUrlProcessed;
    downloadButton.href = audioUrlProcessed;
    downloadButton.style.display = 'inline';
});

async function fetchAudioBuffer(url, audioContext) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return audioContext.decodeAudioData(arrayBuffer);
}

async function bufferToWav(buffer) {
    const numOfChan = buffer.numberOfChannels,
          length = buffer.length * numOfChan * 2 + 44,
          sampleRate = buffer.sampleRate,
          wavBuffer = new ArrayBuffer(length),
          view = new DataView(wavBuffer),
          channels = [];
    
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
    view.setUint32(28, sampleRate * 4, true);
    view.setUint16(32, numOfChan * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, length - 44, true);

    for (let i = 0; i < numOfChan; i++) {
        channels.push(buffer.getChannelData(i));
    }

    const offset = 44;
    channels.forEach(channelData => floatTo16BitPCM(view, offset, channelData));

    return new Blob([view], { type: 'audio/wav' });
}
