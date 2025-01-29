import * as THREE from "three";

import { DeviceOrientationControls } from "./jsm/controls/DeviceOrientationControls.js";


import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const requestAccessButton = document.getElementById("request-access");
const gyroDataDiv = document.getElementById("gyro-data");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const domainURL = "https://3dgyroscope.netlify.app/";
camera.position.z = 5;

const orbitControls = new OrbitControls(camera, renderer.domElement);
let deviceOrientationControls = null;

requestAccessButton.addEventListener("click", async () => {
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission === "granted") {
        deviceOrientationControls = new DeviceOrientationControls(camera);
        gyroDataDiv.textContent = "Gyroscope access granted!";
      } else {
        gyroDataDiv.textContent = "Permission denied for gyroscope access.";
      }
    } catch (error) {
      gyroDataDiv.textContent = "Error requesting gyroscope access.";
      console.error(error);
    }
  } else {
    gyroDataDiv.textContent = "Gyroscope access does not require a prompt on this device.";
    deviceOrientationControls = new DeviceOrientationControls(camera);
  }
});

if ("DeviceOrientationEvent" in window) {
  const enableDeviceOrientationControls = async () => {
    try {
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === "granted") {
          deviceOrientationControls = new DeviceOrientationControls(camera);
          console.log("DeviceOrientationControls enabled");
        } else {
          console.warn("Permission denied for DeviceOrientationEvent.");
        }
      } else {
        deviceOrientationControls = new DeviceOrientationControls(camera);
        console.log("DeviceOrientationControls enabled (no permission request needed)");
      }
    } catch (error) {
      console.error("Error enabling device orientation controls:", error);
    }
  };

  enableDeviceOrientationControls();
} else {
  console.warn("DeviceOrientationEvent is not supported on this device.");
}

function sendDataToIframe() {
  const iframe = document.getElementById("childIframe");
  if (iframe && iframe.contentWindow) {
    const data = {
      rotation: {
        x: cube.rotation.x,
        y: cube.rotation.y,
        z: cube.rotation.z,
      },
      position: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      },
    };
    console.log('data', data)
    iframe.contentWindow.postMessage({ type: 'data', ...data }, "*");
    // Send data to the iframe
    // iframe.contentWindow.postMessage(data, "*");
  }
}

function animate() {
  requestAnimationFrame(animate);

  orbitControls.update();
  if (deviceOrientationControls) {
    deviceOrientationControls.update();
  }

  // Send camera position and rotation to the iframe
  sendDataToIframe();
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});