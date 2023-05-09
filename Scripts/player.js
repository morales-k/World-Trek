import { SphereGeometry, MeshLambertMaterial, Mesh } from "three";
import { textures } from "./textures";

export let playerCoords = [0, 0];

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

export const movePlayer = (selectedTile) => {
  const updatedCoords = [selectedTile.position.x, selectedTile.position.y];
  playerCoords = updatedCoords;
  return createPlayer(textures.player, updatedCoords);
};

export const removePlayer = (scene, player) => {
  // Remove mesh from scene
  scene.remove(player);
  // Remove mesh material & texture
  player.material.dispose();
  player.material.map.dispose();
  // Remove mesh geometry
  player.geometry.dispose();
};

// Determines if a tile is adjacent to the player's current position. 
// No adjacent tiles should have a greater difference than 1.75 in their position values.
export const isTileAdjacent = (tile) => {
  const diffX = Math.abs(tile.position.x - playerCoords[0]);
  const diffY = Math.abs(tile.position.y - playerCoords[1]);

  return diffX <= 1.75 && diffY <= 1.75;
}
