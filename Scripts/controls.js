import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const setControls = (camera, renderer) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.dampingFactor = 0.02;
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI / 2;
  controls.enablePan = false;
  controls.minDistance = 20;
  controls.maxDistance = 175;

  return controls;
};