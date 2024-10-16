const audioInputSelect = document.getElementById("audioInputSelect");
function getAudioInputDevices() {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        devices.forEach(device => {
          if (device.kind === 'audioinput') {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Microphone ${audioInputSelect.length + 1}`;
            audioInputSelect.appendChild(option);
          }
        });
      })
      .catch(err => console.error('Error getting audio devices:', err));
  }

  // Call the function to populate audio devices on page load
  getAudioInputDevices();

  async function getUserMedia(){
    const audioSource = audioInputSelect.value;
      const constraints = {
        audio: {
          deviceId: audioSource ? { exact: audioSource } : undefined,
          autoGainControl: false 
        }
      };
      try {
        let audioStream =  await navigator.mediaDevices.getUserMedia(constraints);
        let mediaRecorder = new MediaRecorder(audioStream);
        return mediaRecorder;
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
  }
