document.addEventListener('DOMContentLoaded', function () {
  const iframe = document.getElementById('dynamic-iframe');
  const loadButton = document.getElementById('load-iframe');
  const urlInput = document.getElementById('iframe-url');

  // Function to set the iframe URL dynamically
  function setIframeUrl(url) {
    iframe.src = url;
  }

  // Event listener for the button click
  loadButton.addEventListener('click', function () {
    const url = urlInput.value;
    if (url) {
      setIframeUrl(url);
    } else {
      alert('Please enter a URL.');
    }
  });
});




const iframe = document.getElementById('myIframe');

// Detect deviceorientation events
window.addEventListener('deviceorientation', (event) => {
  // Send the gyroscope data to the iframe
  iframe.contentWindow.postMessage({
    type: 'deviceorientation',
    alpha: event.alpha,
    beta: event.beta,
    gamma: event.gamma
  }, '*');
});

// You can also listen for devicemotion events if you want more detailed motion data
window.addEventListener('devicemotion', (event) => {
  iframe.contentWindow.postMessage({
    type: 'devicemotion',
    acceleration: event.acceleration,
    rotationRate: event.rotationRate
  }, '*');
});