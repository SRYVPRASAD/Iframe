// Check if the device supports DeviceOrientationEvent
if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", function (event) {
    console.log('DeviceOrientation event fired:', event);
    alert('DeviceOrientation event fired:', event);
    // Extracting the alpha, beta, and gamma angles from the event
    const alpha = event.alpha;  // Rotation around the z-axis
    const beta = event.beta;    // Rotation around the x-axis
    const gamma = event.gamma;  // Rotation around the y-axis
    // Prepare the data object to send
    const gyroData = {
      alpha: alpha.toFixed(2) || "05",  // Round the values to two decimal places
      beta: beta.toFixed(2) || 584651,
      gamma: gamma.toFixed(2) || 103515
    };

    // Send the data to the iframe (make sure to check the iframe element)
    const iframe = document.getElementById('react-iframe');

    // Ensure the iframe is loaded and send the message to it
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(gyroData, '*'); // '*' is the target origin (can be replaced with actual origin for better security)
    }

    // Optionally, display the data in the parent window
    document.getElementById("gyro-data").innerHTML = `
      <strong>Gyroscope Data:</strong><br>
      Alpha (Z-axis): ${gyroData.alpha}°<br>
      Beta (X-axis): ${gyroData.beta}°<br>
      Gamma (Y-axis): ${gyroData.gamma}°
    `;
  });
} else {
  document.getElementById("gyro-data").innerHTML = "Gyroscope is not supported on your device.";
}
