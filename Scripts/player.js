import { SphereGeometry, MeshLambertMaterial, Mesh } from "three";

export const createPlayer = (texture, position) => {
  const geo = new SphereGeometry(1, 16, 16);
  
  geo.translate(position[0], 2, position[1]);

  const mesh = new Mesh(
    geo,
    new MeshLambertMaterial({ map: texture })
  );
  // Name object for easy removal when updating movement.
  mesh.name = "player";

  return mesh;
};

export const movePlayer = (key, playerCoords) => {
  let updatedPlayerCoords = [...playerCoords];

  switch (key) {
    case "ArrowUp": {
      updatedPlayerCoords[0] -= 1;
      break;
    }
    case "ArrowDown": {
      updatedPlayerCoords[0] += 1;
      break;
    }
    case "ArrowLeft": {
      updatedPlayerCoords[1] += 1;
      break;
    }
    case "ArrowRight": {
      updatedPlayerCoords[1] -= 1;
      break;
    }
    default:
      break;
  }

  return updatedPlayerCoords;
};
