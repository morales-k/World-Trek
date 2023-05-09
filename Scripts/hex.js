import { CylinderGeometry, Mesh, MeshPhysicalMaterial, Vector2 } from "three";

export let tiles = [];

/**
 * Creates & returns a hexagon using CylinderGeometry.
 * 
 * @param {Number} height - Indicates the height of the geometry.
 * @param {Object} position - X,Y coords used for tile positioning.
 * @returns 
 */
export const createHexGeometry = (height, position) => {
  let hexGeo = new CylinderGeometry(1, 1, height, 6, 1, false);
  hexGeo.translate(position.x, height * 0.5, position.y);

  return hexGeo;
};

/**
 * Creates & returns a mesh by attaching a texture to a geometry.
 * 
 * @param {Object} envmap - The enviornment map.
 * @param {Object} hexGeo - The geometry object to append the material to.
 * @param {Object} texture - Image texture used for the material.
 * @returns 
 */
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
  mesh.name = "tile";

  return mesh;
};

/**
 * Creates a map of possible hexagon positions, and calls addHexTexture for each kept position.
 * 
 * @param {Number} maxHeight - The maximum height a hex can have.
 * @param {Object} envmap - The enviornment map.
 * @param {Object} textures - A object containing a list of textures used for materials.
 * @param {Object} scene - The scene itself that hexes will be added to.
 */
export const addHexes = (maxHeight, envmap, textures, scene) => {
  // Start i & j from negative values for full circular map.
  for (let i = -10; i < 12; i++) {
    for (let j = -10; j < 12; j++) {
      let position = tileToPosition(i, j);

      // Skip tiles where position length > 16 to make map appear circular.
      if (position.length() > 16) {
        continue;
      }

      addHexTexture(Math.random() * maxHeight, position, maxHeight, envmap, textures, scene);
    }
  }
};

/**
 * Creates Vector2 for each tile, offseting any tiles where tileY % 2 returns an odd number.
 * 
 * @param {Number} tileX - X coordinate of a tile.
 * @param {Number} tileY - Y coordinate of a tile.
 * @returns 
 */
function tileToPosition(tileX, tileY) {
  return new Vector2((tileX + (tileY % 2) * 0.5) * 1.75, tileY * 1.50);
};

/**
 * Creates a hexagon geometry, attachs a mesh, and adds it to the scene.
 * 
 * @param {Number} height - The height assigned to the hexagon.
 * @param {Object} position - An object containing XY coords of the hexagon.
 * @param {Number} maxHeight - Maximum height a hexagon can have.
 * @param {Object} envmap - The enviornment map used for the material.
 * @param {Object} textures - An object containing a list of image textures.
 * @param {Object} scene - The scene itself that hexagons are added to.
 */
function addHexTexture(height, position, maxHeight, envmap, textures, scene) {
  let hexGeo = createHexGeometry(1, position);
  let hex;
  
  const stoneHeight = maxHeight * 0.8;
  const grassHeight = maxHeight * 0.3;
  const dirtHeight = maxHeight * 0;

  if (height > stoneHeight) {
    hex = createHexMesh(envmap, hexGeo, textures.stone);
  } else if (height > grassHeight) {
    hex = createHexMesh(envmap, hexGeo, textures.grass);
  } else if (height > dirtHeight) {
    hex = createHexMesh(envmap, hexGeo, textures.dirt);
  }

  scene.add(hex);
  trackTile(hex, position);
};

/**
 * Creates currentTile object from hex and position. Then adds to tiles array.
 * 
 * @param {Object} hex - The tile object.
 * @param {Object} position - X,Y coords used for tile positioning.
 */
function trackTile(hex, position) {
  const currentTile = {
    id: tiles.length,
    tileID: hex.id,
    position: position
  };
  
  tiles.push(currentTile);
}