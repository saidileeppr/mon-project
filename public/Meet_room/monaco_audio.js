const constraints = {audio: {
    autoGainControl: false
  }};
  navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream) {
      let mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorder.onstart = function(e) {
          this.chunks = [];
      };
      mediaRecorder.ondataavailable = function(e) {
          this.chunks.push(e.data);
      };
      mediaRecorder.onstop = function(e) {
        let aud = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' });
        socket.emit('c2s_radio', aud,roomDetail.roomId);
      };
      mediaRecorder.start();
      setInterval(function() {
          mediaRecorder.stop();
          mediaRecorder.start();
      },1000);
  });
  socket.on('s2c_voice', function(arrayBuffer) {
      let blob = new Blob([arrayBuffer], { 'type' : 'audio/ogg; codecs=opus' });
      let audio = document.createElement('audio');
      audio.src = window.URL.createObjectURL(blob);
      audio.play();
  });
