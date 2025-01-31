const iframe = document.getElementById('myIframe');
const sendDataButton = document.getElementById('send-data');
const connectionStatus = document.getElementById('connection-status');
const gyroDataDiv = document.getElementById('gyro-data');
const requestButton = document.getElementById('request-access');
// Throttle gyroscope data handling to 100ms
const throttledHandleGyroData = throttle(handleGyroData, 100);

// Function to send data to the iframe
sendDataButton.addEventListener('click', () => {
  const message = { type: 'data', content: 'Hello from parent!' };
  iframe.contentWindow.postMessage(message, "*"); // Send data to iframe
  connectionStatus.textContent = 'Data sent to iframe!';
  connectionStatus.style.color = 'green';
});

// Function to send gyroscope data to the iframe
const sendGyroData = (gyroData) => {
  iframe.contentWindow.postMessage({ type: 'gyroscope', ...gyroData }, "*");
};

// Function to update gyroscope data on the page
const updateGyroDisplay = (gyroData) => {
  gyroDataDiv.innerHTML = `
    <strong>Gyroscope Data:</strong><br>
    Alpha (Z-axis): ${gyroData.alpha}°<br>
    Beta (X-axis): ${gyroData.beta}°<br>
    Gamma (Y-axis): ${gyroData.gamma}° 
  `;
};

// Handle gyroscope data
const handleGyroData = (event) => {
  if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
    const gyroData = {
      alpha: event.alpha.toFixed(2),
      beta: event.beta.toFixed(2),
      gamma: event.gamma.toFixed(2),
    };

    // Update the display every 200ms
    if (!gyroDisplayUpdateTimer) {
      gyroDisplayUpdateTimer = setTimeout(() => {
        updateGyroDisplay(gyroData);
        gyroDisplayUpdateTimer = null;
      }, 200);
    }     // Send the data regardless of whether it has changed
    sendGyroData(gyroData); // Send the data continuously
  } else {
    gyroDataDiv.textContent = 'Gyroscope data is unavailable.';
  }
};

// Check gyroscope support and request permissions if needed
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
        window.addEventListener('deviceorientation', throttledHandleGyroData);
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
  window.addEventListener('deviceorientation', throttledHandleGyroData);
} else {
  // DeviceOrientationEvent not supported
  gyroDataDiv.textContent = 'Gyroscope is not supported on this device.';
  requestButton.style.display = 'none';
}

// Check iframe load and readiness
iframe.onload = () => {
  console.log('Iframe loaded and ready to receive messages.');
};
