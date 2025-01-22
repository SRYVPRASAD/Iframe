const iframe = document.getElementById('myIframe');
const sendDataButton = document.getElementById('send-data');
const connectionStatus = document.getElementById('connection-status');

const gyroDataDiv = document.getElementById('gyro-data');
const requestButton = document.getElementById('request-access');

const domainURL = "https://3dgyroscope.netlify.app"

// Function to send data to the iframe
sendDataButton.addEventListener('click', () => {
  const message = { type: 'data', content: 'Hello from parent!' };
  iframe.contentWindow.postMessage(message, '*'); // Send data to iframe
});

// Listen for messages from the iframe
window.addEventListener('message', (event) => {
  // Ensure the message is from a trusted origin if needed (e.g., event.origin === 'https://trusted-domain.com')
  if (event.data && event.data.type === 'ack') {
    connectionStatus.textContent = 'Connection is healthy!';
    connectionStatus.style.color = 'green';
  }
});

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
        window.addEventListener('deviceorientation', (event) => {
          if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
            gyroDataDiv.innerHTML = `
                  <strong>Gyroscope Data:</strong><br>
                  Alpha (Z-axis): ${event.alpha.toFixed(2)}°<br>
                  Beta (X-axis): ${event.beta.toFixed(2)}°<br>
                  Gamma (Y-axis): ${event.gamma.toFixed(2)}°
                `;

            const gyroData = {
              alpha: event.alpha?.toFixed(2),
              beta: event.beta?.toFixed(2),
              gamma: event.gamma?.toFixed(2),
            };

            // Send the data to the iframe
            iframe.contentWindow.postMessage(gyroData, domainURL);
          } else {
            gyroDataDiv.textContent = 'Gyroscope data is unavailable.';
          }
        });
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
  window.addEventListener('deviceorientation', (event) => {
    if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
      gyroDataDiv.innerHTML = `
            <strong>Gyroscope Data:</strong><br>
            Alpha (Z-axis): ${event.alpha.toFixed(2)}°<br>
            Beta (X-axis): ${event.beta.toFixed(2)}°<br>
            Gamma (Y-axis): ${event.gamma.toFixed(2)}°
          `;
      const gyroData = {
        alpha: event.alpha?.toFixed(2),
        beta: event.beta?.toFixed(2),
        gamma: event.gamma?.toFixed(2),
      };
      // domain url became we are use different domains.
      // | Target Origin: Always specify the target origin in the postMessage method. This prevents potential security risks.
      iframe.contentWindow.postMessage(gyroData, domainURL);
    } else {
      gyroDataDiv.textContent = 'Gyroscope data is unavailable.';
    }
  });
} else {
  // DeviceOrientationEvent not supported
  gyroDataDiv.textContent = 'Gyroscope is not supported on this device.';
  requestButton.style.display = 'none';
}