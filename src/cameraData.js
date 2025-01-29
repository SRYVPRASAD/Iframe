import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DeviceOrientationControls } from "./jsm/controls/DeviceOrientationControls.js";

const requestAccessButton = document.getElementById("request-access");
const gyroDataDiv = document.getElementById("gyro-data");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enabled = false;
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
        x: camera.rotation.x,
        y: camera.rotation.y,
        z: camera.rotation.z,
      },
      position: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      },
    };
    iframe.contentWindow.postMessage({ type: 'data', ...data }, "*");
  }
}

function animate() {
  requestAnimationFrame(animate);

  if (deviceOrientationControls) {
    deviceOrientationControls.update();
  } else {
    orbitControls.update();
  }

  sendDataToIframe();
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});