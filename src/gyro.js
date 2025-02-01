// // Throttle gyroscope data handling to 100ms
// const throttle = (func, limit) => {
//   let inThrottle;
//   return function () {
//     if (!inThrottle) {
//       func.apply(this, arguments);
//       inThrottle = true;
//       setTimeout(() => (inThrottle = false), limit);
//     }
//   };
// };
// console.log(iframe.contentWindow);
// iframe.addEventListener('load', () => {
//   console.log('Iframe is ready!');
//   // Now you can send data to the iframe
// });


// // Function to send data to the iframe
// const sendGyroData = (gyroData) => {
//   iframe.contentWindow.postMessage({ type: 'gyroscope', ...gyroData }, domainURL);
// };

// // Function to update gyroscope data on the page
// const updateGyroDisplay = (gyroData) => {
//   gyroDataDiv.innerHTML = `
//     <strong>Gyroscope Data:</strong><br>
//     Alpha (Z-axis): ${gyroData.alpha}°<br>
//     Beta (X-axis): ${gyroData.beta}°<br>
//     Gamma (Y-axis): ${gyroData.gamma}°
//   `;
// };

// // Handle gyroscope data
// const handleGyroData = (event) => {
//   if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
//     const gyroData = {
//       alpha: event.alpha.toFixed(2),
//       beta: event.beta.toFixed(2),
//       gamma: event.gamma.toFixed(2),
//     };

//     // Update the display every 200ms
//     if (!gyroDisplayUpdateTimer) {
//       gyroDisplayUpdateTimer = setTimeout(() => {
//         updateGyroDisplay(gyroData);
//         gyroDisplayUpdateTimer = null;
//       }, 200);
//     }

//     // Send the data only if it has changed
//     if (
//       lastGyroData.alpha !== gyroData.alpha ||
//       lastGyroData.beta !== gyroData.beta ||
//       lastGyroData.gamma !== gyroData.gamma
//     ) {
//       sendGyroData(gyroData);
//       lastGyroData = gyroData; // Update the last sent data
//     }
//   } else {
//     gyroDataDiv.textContent = 'Gyroscope data is unavailable.';
//   }
// };

// // Throttled function to handle gyro data with throttle limit of 100ms
// const throttledHandleGyroData = throttle(handleGyroData, 100);

// // The rest of your existing code remains unchanged

// const iframe = document.getElementById('myIframe');
// const sendDataButton = document.getElementById('send-data');
// const connectionStatus = document.getElementById('connection-status');
// const gyroDataDiv = document.getElementById('gyro-data');
// const requestButton = document.getElementById('request-access');
// const domainURL = "https://3dgyroscope.netlify.app/";

// let lastGyroData = { alpha: null, beta: null, gamma: null }; // Track last gyroscope data to avoid redundant sends
// let gyroDisplayUpdateTimer = null; // Timer for display throttling

// // // Function to send data to the iframe
// // sendDataButton.addEventListener('click', () => {
// //   const message = { type: 'data', content: 'Hello from parent!' };
// //   iframe.contentWindow.postMessage(message, domainURL); // Send data to iframe
// // });

// // Listen for messages from the iframe
// // window.addEventListener('message', (event) => {
// //   // Ensure the message is from the trusted origin
// //   if (event.origin === domainURL && event.data && event.data.type === 'ack') {
// //     connectionStatus.textContent = 'Connection is healthy!';
// //     connectionStatus.style.color = 'green';
// //   }
// // });

// // Check gyroscope support and request permissions if needed
// if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
//   // Show the request access button
//   requestButton.style.display = 'block';

//   // Add click event listener to request permission
//   requestButton.addEventListener('click', async () => {
//     try {
//       const permission = await DeviceOrientationEvent.requestPermission();
//       if (permission === 'granted') {
//         // Permission granted, start listening for gyroscope data
//         gyroDataDiv.textContent = 'Access granted. Waiting for gyroscope data...';
//         window.addEventListener('deviceorientation', throttledHandleGyroData);
//       } else {
//         gyroDataDiv.textContent = 'Permission denied for gyroscope access.';
//       }
//     } catch (error) {
//       gyroDataDiv.textContent = 'Error requesting gyroscope access.';
//       console.error('Permission request failed:', error);
//     }
//   });
// } else if (window.DeviceOrientationEvent) {
//   // For non-iOS devices or older iOS versions
//   gyroDataDiv.textContent = 'Gyroscope access is supported without permission.';
//   window.addEventListener('deviceorientation', throttledHandleGyroData);
// } else {
//   // DeviceOrientationEvent not supported
//   gyroDataDiv.textContent = 'Gyroscope is not supported on this device.';
//   requestButton.style.display = 'none';
// }
// // const iframe = document.getElementById('myIframe');

// iframe.addEventListener('load', () => {
//   console.log('Iframe is ready! ✅✅✅✅');
//   console.log(iframe.contentWindow); // Now this will print the iframe's contentWindow

//   // Now you can safely send data to the iframe
//   // You can also send your gyroscope data here once the iframe is ready
// });

window.addEventListener('DOMContentLoaded', () => {
  const iframe = document.getElementById('myIframe');
  const gyroDataDiv = document.getElementById('gyro-data');
  const requestAccessButton = document.getElementById('request-access');

  if (!iframe || !gyroDataDiv || !requestAccessButton) {
    console.error('Required elements not found!');
    return;
  }

  // Function to update the gyroscope data display
  function updateGyroscopeDataDisplay(gyroData) {
    gyroDataDiv.innerHTML = `
      <strong>Gyroscope Data (Parent):</strong><br>
      Alpha: ${gyroData.alpha}°<br>
      Beta: ${gyroData.beta}°<br>
      Gamma: ${gyroData.gamma}°`;
  }

  // Function to send gyroscope data to iframe
  function sendGyroscopeDataToIframe(gyroData) {
    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        { type: 'gyroscope', ...gyroData },
        '*' // Adjust this to match iframe origin
      );
      console.log('Gyroscope data sent to iframe:', gyroData);
    }
  }

  // Function to start gyroscope tracking
  function startGyroscopeTracking() {
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (event) => {
        console.log('Device Orientation event:', event);

        const gyroData = {
          alpha: event.alpha ? event.alpha.toFixed(2) : 0.00,
          beta: event.beta ? event.beta.toFixed(2) : 0.00,
          gamma: event.gamma ? event.gamma.toFixed(2) : 0.00
        };

        updateGyroscopeDataDisplay(gyroData);
        sendGyroscopeDataToIframe(gyroData);
      });
    } else {
      console.log('Gyroscope is not supported on this device.');
      updateGyroscopeDataDisplay({ alpha: 0.00, beta: 0.00, gamma: 0.00 });
      sendGyroscopeDataToIframe({ alpha: 0.00, beta: 0.00, gamma: 0.00 });
    }
  }

  // Handle permission request on iOS
  requestAccessButton.addEventListener('click', async () => {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          requestAccessButton.style.display = 'none'; // Hide button after access
          startGyroscopeTracking();
        } else {
          gyroDataDiv.innerHTML = 'Permission denied. Please allow gyroscope access.';
        }
      } catch (error) {
        console.error('Error requesting gyroscope permission:', error);
        gyroDataDiv.innerHTML = 'Error requesting permission. Try again.';
      }
    } else {
      startGyroscopeTracking(); // For non-iOS devices
    }
  });
});
