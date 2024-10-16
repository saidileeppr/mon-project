let audioInputSelect = document.querySelector('#audioInput');
let audioOutputSelect = document.querySelector('#audioOutput');

// Function to get available audio devices
async function getAudioDevices() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputDevices = devices.filter(device => device.kind === 'audioinput');
    const audioOutputDevices = devices.filter(device => device.kind === 'audiooutput');

    // Populate the dropdowns
    audioInputDevices.forEach(device => {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.text = device.label || `Microphone ${audioInputSelect.length + 1}`;
      audioInputSelect.appendChild(option);
    });

    audioOutputDevices.forEach(device => {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.text = device.label || `Speaker ${audioOutputSelect.length + 1}`;
      audioOutputSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error getting audio devices:', error);
  }
}

// Function to start audio recording with selected device
async function startRecording() {
  const audioSource = audioInputSelect.value;
  const constraints = {
    audio: {
      deviceId: audioSource ? { exact: audioSource } : undefined,
      autoGainControl: false 
    }
  };

  try {
    let audioStream = await navigator.mediaDevices.getUserMedia(constraints);
    let mediaRecorder = new MediaRecorder(audioStream);
    mediaRecorder.onstart = function(e) {
      this.chunks = [];
    };
    mediaRecorder.ondataavailable = function(e) {
      this.chunks.push(e.data);
    };
    mediaRecorder.onstop = function(e) {
      let aud = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' });
      socket.emit('c2s_radio', aud, roomDetail.roomId);
    };
    mediaRecorder.start();

    setInterval(function() {
      mediaRecorder.stop();
      mediaRecorder.start(); // Restart recording after sending chunk
    }, 1000);
  } catch (error) {
    console.error('Error accessing microphone:', error);
  }
}

// Function to play audio on selected output device
function playAudio(arrayBuffer) {
  const audioSink = audioOutputSelect.value;
  const blob = new Blob([arrayBuffer], { 'type' : 'audio/ogg; codecs=opus' });
  const audio = new Audio();

  if (audioSink) {
    audio.setSinkId(audioSink)
      .then(() => {
        audio.src = window.URL.createObjectURL(blob);
        audio.play();
      })
      .catch(error => {
        console.error('Error setting audio output device:', error);
        // Fallback to default output if setting sinkId fails
        audio.src = window.URL.createObjectURL(blob);
        audio.play();
      });
  } else {
    audio.src = window.URL.createObjectURL(blob);
    audio.play();
  }
}

// Add event listeners for device selection
audioInputSelect.addEventListener('change', startRecording); // Restart recording on input change
audioOutputSelect.addEventListener('change', () => { 
  // You might want to handle output device change differently
  // e.g., stop current audio and play the next one on the new device 
  
});

// Get devices and start recording initially
getAudioDevices();
startRecording(); 

// Socket.io event handling
socket.on('s2c_voice', playAudio);