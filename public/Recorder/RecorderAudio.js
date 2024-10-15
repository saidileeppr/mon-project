function getAudioInputDevices() {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const audioInputSelect = document.getElementById("audioInputSelect");
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