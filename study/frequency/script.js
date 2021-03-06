let audioContext = new AudioContext();

document.querySelector('button').addEventListener('click', () => {
  audioContext.resume();
});

window.onload = () => {
  document.querySelector('button').dispatchEvent(new MouseEvent('click'))
}

const analyser = audioContext.createAnalyser();
const pitchSamples = [];
let audioReady = false;

navigator.getUserMedia(
  { audio: true },
  stream => {
    audioContext.createMediaStreamSource(stream).connect(analyser);
    audioReady = true;
  },
  err => console.log(err)
);

const dataArray = new Uint8Array(analyser.frequencyBinCount);
const canvasContext = document.getElementById('canvas').getContext('2d');
canvasContext.fillStyle = 'firebrick';

const drawWave = () => { // this gets called via requestAnimationFrame, so runs roughly every 16ms
  analyser.getByteTimeDomainData(dataArray);

  let lastPos = 0;
  dataArray.forEach((item, i) => {
    if (item > 128 && lastItem <= 128) { // we have crossed below the mid point
      const elapsedSteps = i - lastPos; // how far since the last time we did this
      lastPos = i;

      const hertz = 1 / (elapsedSteps / 44100);

      console.log(hertz);


      pitchSamples.push(hertz); // an array of every pitch encountered
    }

    canvasContext.fillRect(i, item, 1, 1); // point in the wave

    lastItem = item;
  });
};

const renderAudio = () => {
  requestAnimationFrame(renderAudio);

  if (!audioReady) return;

  canvasContext.clearRect(0, 0, 1024, 300);

  drawWave();
};

renderAudio(); // kick the whole thing off

  // setInterval(() => {
  //   // renderKey(pitchSamples); // defined elsewhere, will get the average pitch and render a key
  // }, 250);
