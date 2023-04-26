import { SphereGeometry, MeshLambertMaterial, Mesh } from "three";

export const createPlayer = (envmap, texture, position) => {
  const px = Math.random() * 0.04;
  const pz = Math.random() * 0.04;
  const geo = new SphereGeometry(1, 16, 16);
  
  geo.translate(position[0] + px, 2, position[1] + pz);

  const mesh = new Mesh(
    geo,
    new MeshLambertMaterial({ map: texture })
  );

  return mesh;
};

export const movePlayer = (key) => {
  console.log(key);
};
