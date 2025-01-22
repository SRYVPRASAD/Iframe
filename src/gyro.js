// Check if the device supports DeviceOrientationEvent
if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", function (event) {
    alert("Headers")
    // Extracting the alpha, beta, and gamma angles from the event
    const alpha = event.alpha;  // Rotation around the z-axis
    const beta = event.beta;    // Rotation around the x-axis
    const gamma = event.gamma;  // Rotation around the y-axis

    // Display the gyroscope data in the div
    document.getElementById("gyro-data").innerHTML = `
          <strong>Gyroscope Data:</strong><br>
          Alpha (Z-axis): ${alpha.toFixed(2)}°<br>
          Beta (X-axis): ${beta.toFixed(2)}°<br>
          Gamma (Y-axis): ${gamma.toFixed(2)}°
        `;
  });
} else {
  document.getElementById("gyro-data").innerHTML = "Gyroscope is not supported on your device.";
}
