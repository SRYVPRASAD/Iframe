const iframe = document.getElementById('myIframe');
const sendDataButton = document.getElementById('send-data');
const connectionStatus = document.getElementById('connection-status');
const gyroDataDiv = document.getElementById('gyro-data');
const requestButton = document.getElementById('request-access');

let lastGyroData = { alpha: null, beta: null, gamma: null }; // Track last gyroscope data to avoid redundant sends
let gyroDisplayUpdateTimer = null; // Timer for display throttling

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
    }

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

// Utility to throttle events
const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    if (!inThrottle) {
      func.apply(this, arguments);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
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

// Throttle gyroscope data handling to 100ms
const throttledHandleGyroData = throttle(handleGyroData, 100);
