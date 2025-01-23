const iframe = document.getElementById('myIframe');
const sendDataButton = document.getElementById('send-data');
const connectionStatus = document.getElementById('connection-status');

const gyroDataDiv = document.getElementById('gyro-data');
const requestButton = document.getElementById('request-access');

const domainURL = "https://dev.vizylab.app/";

let lastGyroData = { alpha: null, beta: null, gamma: null }; // Track last gyroscope data to avoid redundant sends

// Function to send data to the iframe
sendDataButton.addEventListener('click', () => {
  const message = { type: 'data', content: 'Hello from parent!' };
  iframe.contentWindow.postMessage(message, domainURL); // Send data to iframe
});

// Listen for messages from the iframe
window.addEventListener('message', (event) => {
  // Ensure the message is from the trusted origin
  if (event.origin === domainURL && event.data && event.data.type === 'ack') {
    connectionStatus.textContent = 'Connection is healthy!';
    connectionStatus.style.color = 'green';
  }
});

// Function to send gyroscope data to the iframe
const sendGyroData = (gyroData) => {
  iframe.contentWindow.postMessage({ type: 'gyroscope', ...gyroData }, domainURL);
};

// Check if the device supports DeviceOrientationEvent
if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
  // Show the request access button
  requestButton.style.display = 'block';

  // Add click event listener to request permission
  requestButton.addEventListener('click', async () => {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission === 'granted') {
        // Permission granted, start listening for gyroscope data
        gyroDataDiv.textContent = 'Access granted. Waiting for gyroscope data...';
        window.addEventListener('deviceorientation', (event) => handleGyroData(event));
      } else {
        gyroDataDiv.textContent = 'Permission denied for gyroscope access.';
      }
    } catch (error) {
      gyroDataDiv.textContent = 'Error requesting gyroscope access.';
      console.error('Permission request failed:', error);
    }
  });
} else if (window.DeviceOrientationEvent) {
  // For non-iOS devices or older iOS versions
  gyroDataDiv.textContent = 'Gyroscope access is supported without permission.';
  window.addEventListener('deviceorientation', (event) => handleGyroData(event));
} else {
  // DeviceOrientationEvent not supported
  gyroDataDiv.textContent = 'Gyroscope is not supported on this device.';
  requestButton.style.display = 'none';
}

// Handle gyroscope data
const handleGyroData = (event) => {
  if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
    const gyroData = {
      alpha: event.alpha.toFixed(2),
      beta: event.beta.toFixed(2),
      gamma: event.gamma.toFixed(2),
    };

    // Update the display
    gyroDataDiv.innerHTML = `
      <strong>Gyroscope Data:</strong><br>
      Alpha (Z-axis): ${gyroData.alpha}°<br>
      Beta (X-axis): ${gyroData.beta}°<br>
      Gamma (Y-axis): ${gyroData.gamma}°
    `;

    // Send the data only if it has changed
    if (
      lastGyroData.alpha !== gyroData.alpha ||
      lastGyroData.beta !== gyroData.beta ||
      lastGyroData.gamma !== gyroData.gamma
    ) {
      sendGyroData(gyroData);
      lastGyroData = gyroData; // Update the last sent data
    }
  } else {
    gyroDataDiv.textContent = 'Gyroscope data is unavailable.';
  }
};
