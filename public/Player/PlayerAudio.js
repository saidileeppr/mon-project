// Get references to the audio element and output device select element
const audioElement = document.getElementById("audRec");
const outputDeviceSelect = document.getElementById("outputDevice");

// Function to get available audio output devices
async function getAudioOutputDevices() {
  try {
    // Request access to user's media devices (including audio output)
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Get available audio output devices
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioOutputDevices = devices.filter(
      (device) => device.kind === "audiooutput"
    );

    // Populate the output device select element
    populateOutputDeviceSelect(audioOutputDevices);

    // Stop the media stream (we only needed it to enumerate devices)
    mediaStream.getTracks().forEach((track) => track.stop());
  } catch (error) {
    console.error("Error getting audio output devices:", error);
    // Handle the error appropriately (e.g., display an error message)
  }
}

// Function to populate the output device select element
function populateOutputDeviceSelect(devices) {
  outputDeviceSelect.innerHTML = ""; // Clear existing options

  // Add each device as an option
  devices.forEach((device) => {
    const option = document.createElement("option");
    option.value = device.deviceId;
    option.text = device.label || `Device ${device.deviceId}`;
    outputDeviceSelect.appendChild(option);
  });
}

// Function to set the audio output device
function setAudioOutputDevice(deviceId) {
  if (audioElement.setSinkId) {
    audioElement.setSinkId(deviceId)
      .then(() => {
        console.log(`Audio output set to: ${deviceId}`);
      })
      .catch((error) => {
        console.error("Error setting audio output device:", error);
        // Handle the error appropriately
      });
  } else {
    console.warn("Browser does not support audio output device selection.");
    // Handle the lack of support gracefully (e.g., display a message)
  }
}

// Event listener for output device selection change
outputDeviceSelect.addEventListener("change", () => {
  const selectedDeviceId = outputDeviceSelect.value;
  setAudioOutputDevice(selectedDeviceId);
});

// Get and populate the output devices when the page loads
getAudioOutputDevices();