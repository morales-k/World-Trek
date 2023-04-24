import { Color, Mesh, CylinderGeometry, MeshPhysicalMaterial } from "three";

export const createWater = (envmap, waterTexture, maxHeight) => {
  let waterMesh = new Mesh(
    new CylinderGeometry(17, 17, maxHeight * 0.2, 50),
    new MeshPhysicalMaterial({
      envMap: envmap,
      color: new Color("#55AAFF").convertSRGBToLinear().multiplyScalar(3),
      ior: 1.1, // Index of refraction
      transmission: 0.7,
      transparent: true,
      thickness: 1,
      envMapIntensity: 0.2,
      roughness: 0.7,
      metalness: 0.025,
      roughnessMap: waterTexture,
      metalnessMap: waterTexture
    })
  );

  waterMesh.receiveShadow = true;
  waterMesh.position.set(0, maxHeight * 0.1, 0);

  return waterMesh;
};