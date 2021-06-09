var constraints = {audio: {
    autoGainControl: false
  }};
  navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream) {
      var mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorder.onstart = function(e) {
          this.chunks = [];
      };
      mediaRecorder.ondataavailable = function(e) {
          this.chunks.push(e.data);
      };
      mediaRecorder.onstop = function(e) {
          var aud = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' });
          console.log(roomId1,"audio");
          socket.emit('radio', aud,roomId1);
          if(rec==1){
              audFile+=aud;
          }
      };
      // Start recording
      mediaRecorder.start();
      // Stop recording after 5 seconds and broadcast it to server
      setInterval(function() {
          mediaRecorder.stop();
          mediaRecorder.start();
      }, 1500);
  });
  // When the client receives a voice message it will play the sound
  socket.on('voice', function(arrayBuffer) {
      var blob = new Blob([arrayBuffer], { 'type' : 'audio/ogg; codecs=opus' });
      var audio = document.createElement('audio');
      audio.src = window.URL.createObjectURL(blob);
      audio.play();
  });