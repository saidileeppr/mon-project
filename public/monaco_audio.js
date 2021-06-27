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
        socket.emit('radio', aud,loc_roomId1);
      };
      mediaRecorder.start();
      setInterval(function() {
          mediaRecorder.stop();
          mediaRecorder.start();
      },1000);
  });
  socket.on('voice', function(arrayBuffer) {
      var blob = new Blob([arrayBuffer], { 'type' : 'audio/ogg; codecs=opus' });
      var audio = document.createElement('audio');
      audio.src = window.URL.createObjectURL(blob);
      audio.play();
  });