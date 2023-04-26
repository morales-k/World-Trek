import { Mesh, CylinderGeometry, MeshPhysicalMaterial, DoubleSide } from "three";

export const createMapEdge = (envmap, texture, maxHeight) => {
  const mapEdge = new Mesh(
    new CylinderGeometry(17.1, 17.1, maxHeight * 0.25, 50, 1, true),
    new MeshPhysicalMaterial({
      envMap: envmap,
      map: texture,
      envMapIntensity: 0.2,
      side: DoubleSide,
    })
  );

  mapEdge.receiveShadow = true;
  mapEdge.position.set(0, maxHeight * 0.125, 0);

  return mapEdge;
};

export const createMapFloor = (envmap, texture, maxHeight) => {
  const mapFloor = new Mesh(
    new CylinderGeometry(18, 18, maxHeight * 0.1, 50),
    new MeshPhysicalMaterial({
      envMap: envmap,
      map: texture,
      envMapIntensity: 0.1,
      side: DoubleSide,
    })
  );

  mapFloor.receiveShadow = true;
  mapFloor.position.set(0, -maxHeight * 0.05, 0);

  return mapFloor;
};