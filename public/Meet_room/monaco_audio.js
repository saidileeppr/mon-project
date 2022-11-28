var constraints = {audio: {
    autoGainControl: false,
    echoCancellation: true,
    noiseSuppression:true
  }};
  navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream) {
      var mediaRecorder = new MediaRecorder(mediaStream);
      chunks = []
      mediaRecorder.onstart = function(e) {
          this.chunks = [];
      };
      mediaRecorder.ondataavailable = function(e) {
          this.chunks.push(e.data);
      };
      mediaRecorder.onstop = function(e) {
        var aud = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' });
        socket.emit('c2s_radio', aud,roomDetail.roomId);
      };
      mediaRecorder.start();
      setInterval(function() {
          mediaRecorder.stop();
          mediaRecorder.start();
      },500);
  });
  socket.on('s2c_voice', function(arrayBuffer) {
      var blob = new Blob([arrayBuffer], { 'type' : 'audio/ogg; codecs=opus' });
      var audio = document.createElement('audio');
      audio.src = window.URL.createObjectURL(blob);
      audio.play();
      console.log('Audio Played')
  });