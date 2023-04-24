import { AmbientLight, PointLight, Color } from "three";

export const createAmbientLight = () => {
  const light = new AmbientLight("#ffffff", 1);
  light.position.set(0, 10, 10);
  return light;
}

export const createPointLight = () => {
  const light = new PointLight(new Color("#F5F5F5").convertSRGBToLinear(), 1, 500, 2);
  light.position.set(10, 10, -15);
  light.castShadow = true;
  light.shadow.mapSize.width = 512;
  light.shadow.mapSize.height = 512;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 500;
  
  return light;
};