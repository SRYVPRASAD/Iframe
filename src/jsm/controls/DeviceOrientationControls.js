/**
 * @author richt
 * @author WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

import * as THREE from 'three';

export class DeviceOrientationControls {
  constructor(object) {
    this.object = object;
    this.object.rotation.reorder('YXZ');

    this.enabled = true;

    this.deviceOrientation = {};
    this.screenOrientation = 0;

    this.alphaOffset = 0; // radians

    this.onDeviceOrientationChangeEvent = (event) => {
      this.deviceOrientation = event;
    };

    this.onScreenOrientationChangeEvent = () => {
      this.screenOrientation = window.orientation || 0;
    };

    this.setObjectQuaternion = (() => {
      const zee = new THREE.Vector3(0, 0, 1);
      const euler = new THREE.Euler();
      const q0 = new THREE.Quaternion();
      const q1 = new THREE.Quaternion(
        -Math.sqrt(0.5),
        0,
        0,
        Math.sqrt(0.5)
      ); // - PI/2 around the x-axis

      return (quaternion, alpha, beta, gamma, orient) => {
        euler.set(beta, alpha, -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us

        quaternion.setFromEuler(euler); // orient the device
        quaternion.multiply(q1); // camera looks out the back of the device, not the top
        quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation
      };
    })();

    this.connect();
  }

  connect() {
    this.onScreenOrientationChangeEvent(); // run once on load

    window.addEventListener(
      'orientationchange',
      this.onScreenOrientationChangeEvent,
      false
    );
    window.addEventListener(
      'deviceorientation',
      this.onDeviceOrientationChangeEvent,
      false
    );

    this.enabled = true;
  }

  disconnect() {
    window.removeEventListener(
      'orientationchange',
      this.onScreenOrientationChangeEvent,
      false
    );
    window.removeEventListener(
      'deviceorientation',
      this.onDeviceOrientationChangeEvent,
      false
    );

    this.enabled = false;
  }

  update() {
    if (this.enabled === false) return;

    const device = this.deviceOrientation;

    if (device) {
      const alpha = device.alpha
        ? THREE.MathUtils.degToRad(device.alpha) + this.alphaOffset
        : 0; // Z

      const beta = device.beta ? THREE.MathUtils.degToRad(device.beta) : 0; // X'

      const gamma = device.gamma
        ? THREE.MathUtils.degToRad(device.gamma)
        : 0; // Y''

      const orient = this.screenOrientation
        ? THREE.MathUtils.degToRad(this.screenOrientation)
        : 0; // O

      this.setObjectQuaternion(
        this.object.quaternion,
        alpha,
        beta,
        gamma,
        orient
      );
    }
  }

  dispose() {
    this.disconnect();
  }
}
