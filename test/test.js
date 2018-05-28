window.AudioContext = window.AudioContext || window.webkitAudioContext;
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

  window.addEventListener('load', record(new AudioContext()), false);
  var outputEl = document.getElementById("outputEl");

  function record(context) {
    navigator.getUserMedia({ audio: true }, sound, error);

    function sound (stream) {
      var analyser = context.createAnalyser();
      analyser.smoothingTimeConstant = 0.2;
      analyser.fftSize = 1024;

      var node = context.createScriptProcessor(2048, 1, 1);

      var values = 0;
      var average;
      node.onaudioprocess = function () {
        // bitcount is fftsize / 2
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);

        var length = array.length;


        for (var i = 0; i < length; i++) {
          values += array[i];
        }

        average = values / length;
        // console.log(average);
        document.getElementById("outputEl").innerHTML = average.toFixed();
        document.getElementById("outputEl").style.boxShadow = `0px 0px ${average.toFixed()+1*5}px ${average.toFixed()+1*5}px whitesmoke`;
        average = values = 0;
      };

      var input = context.createMediaStreamSource(stream);

      input.connect(analyser);
      analyser.connect(node);
      node.connect(context.destination);

      // return sound to browser
      // input.connect(context.destination);
    }

    function error () { console.log(arguments); }
  }
