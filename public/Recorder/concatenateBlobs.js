
(function() {
    window.ConcatenateBlobs = function(blobs, type, callback) {
        let  buffers = [];

        let  index = 0;

        function readAsArrayBuffer() {
            if (!blobs[index]) {
                return concatenateBuffers();
            }
            let  reader = new FileReader();
            reader.onload = function(event) {
                buffers.push(event.target.result);
                index++;
                readAsArrayBuffer();
            };
            reader.readAsArrayBuffer(blobs[index]);
        }

        readAsArrayBuffer();

        function concatenateBuffers() {
            let  byteLength = 0;
            buffers.forEach(function(buffer) {
                byteLength += buffer.byteLength;
            });
            
            let  tmp = new Uint16Array(byteLength);
            let  lastOffset = 0;
            buffers.forEach(function(buffer) {
                // BYTES_PER_ELEMENT == 2 for Uint16Array
                let  reusableByteLength = buffer.byteLength;
                if (reusableByteLength % 2 != 0) {
                    buffer = buffer.slice(0, reusableByteLength - 1)
                }
                tmp.set(new Uint16Array(buffer), lastOffset);
                lastOffset += reusableByteLength;
            });

            let  blob = new Blob([tmp.buffer], {
                type: type
            });

            callback(blob);
        }
    };
})();