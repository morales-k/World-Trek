import { CylinderGeometry, Mesh, MeshPhysicalMaterial, Vector2 } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

export const createHexGeometry = (height, position) => {
  let hexGeo = new CylinderGeometry(1, 1, height, 6, 1, false);
  hexGeo.translate(position.x, height * 0.5, position.y);

  return hexGeo;
};

export const createHexMesh = (envmap, hexGeo, texture) => {
    let mat = new MeshPhysicalMaterial({
    envMap: envmap,
    envMapIntensity: 0.5,
    flatShading: true,
    map: texture,
  });

  let mesh = new Mesh(hexGeo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
};

export const addHexes = (maxHeight, textureGeos) => {
  // Start i & j from negative values for full circular map.
  for (let i = -10; i < 12; i++) {
    for (let j = -10; j < 12; j++) {
      let position = tileToPosition(i, j);

      // Skip tiles where position length > 16 to make map appear circular.
      if (position.length() > 16) {
        continue;
      }

      addHexTexture(Math.random() * maxHeight, position, maxHeight, textureGeos);
    }
  }
};

function tileToPosition(tileX, tileY) {
  // If tileY % 2 returns an odd number, hexagon becomes offset.
  return new Vector2((tileX + (tileY % 2) * 0.5) * 1.75, tileY * 1.50);
};

function addHexTexture(height, position, maxHeight, textureGeos) {
  let hexGeo = createHexGeometry(1, position);
  
  const stoneHeight = maxHeight * 0.8;
  const grassHeight = maxHeight * 0.3;
  const dirtHeight = maxHeight * 0;

  if (height > stoneHeight) {
    textureGeos.stone = mergeGeometries([hexGeo, textureGeos.stone]);
  } else if (height > grassHeight) {
      textureGeos.grass = mergeGeometries([hexGeo, textureGeos.grass]);
  } else if (height > dirtHeight) {
      textureGeos.dirt = mergeGeometries([hexGeo, textureGeos.dirt]);
  }
};