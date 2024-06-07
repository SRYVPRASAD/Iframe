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
