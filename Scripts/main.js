import { Scene, PerspectiveCamera, WebGLRenderer, Color, 
  ACESFilmicToneMapping, sRGBEncoding, PMREMGenerator, 
  FloatType, PCFShadowMap, Raycaster, Vector2 } from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { createAmbientLight } from "./light";
import { addHexes } from "./hex";
import { createMapEdge, createMapFloor } from "./map";
import { createWater } from "./water";
import { setControls } from "./controls";
import { createPlayer, movePlayer } from "./player";
import { textures } from "./textures";
  
let playerCoords = [5, 5];
const scene = new Scene();
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
const renderer = new WebGLRenderer({ antialias: true });
const controls = setControls(camera, renderer);
const player = createPlayer(textures.player, playerCoords);
// Raycasting
let prevClickedTile;
let pointer = new Vector2();
const raycaster = new Raycaster();
renderer.domElement.addEventListener("click", raycast, false);

scene.background = new Color("#71A9B6");
camera.position.set(20, 50, 0);

renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = ACESFilmicToneMapping;
renderer.outputEncoding = sRGBEncoding;
renderer.useLegacyLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFShadowMap;

document.body.appendChild(renderer.domElement);

const handleResize = () => {
  let width = window.innerWidth;
  let height = window.innerHeight;
  
  camera.updateProjectionMatrix();
  camera.aspect = (width / height);
  renderer.setSize(width, height);
  camera.position.set(20, 50, 0);
};

const loop = async (playerCoords, textures) => {
  // Process enviornment map
  let pmrem = new PMREMGenerator(renderer);
  let envmapTexture = await new RGBELoader().setDataType(FloatType).loadAsync("assets/envmap.hdr");
  let envmap = pmrem.fromEquirectangular(envmapTexture).texture;
  const maxHeight = 3;

  addHexes(maxHeight, envmap, textures, scene);
  
  const ambientLight = createAmbientLight();
  const mapEdge = createMapEdge(envmap, textures.cobblestone, maxHeight);
  const mapFloor = createMapFloor(envmap, textures.cobblestone, maxHeight);
  const water = createWater(envmap, textures.water, maxHeight);

  scene.add(ambientLight, mapEdge, mapFloor, water, player);

  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });
}
loop(playerCoords, textures);

// Set event listener for resizing window.
window.addEventListener("resize", async () => {
  handleResize();
});

window.addEventListener("keydown", async (e) => {
  const directions = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];

  if (directions.includes(e.key)) {
    // Clear the player object.
    const player = scene.getObjectByName("player");
    scene.remove(player);
    // Update player coordinates based on key & re-add to scene.
    let updatedPlayerCoords = movePlayer(e.key, playerCoords);
    playerCoords = updatedPlayerCoords;
    scene.add(createPlayer(textures.player, updatedPlayerCoords));
  }
});

// Update the pointer values on mouse move to prevent delay when adding tile glow.
window.addEventListener("mousemove", async (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = - (e.clientY / window.innerHeight) * 2 + 1;
});

/**
 * Determines if a tile was intersected(clicked) based on pointer & camera position.
 */
function raycast () {
  raycaster.setFromCamera(pointer, camera);
  let intersects = raycaster.intersectObjects(scene.children.filter(child => child.name === "tile"));
  let clickedTile = intersects[0].object;

  if (prevClickedTile) {
    removeTileGlow();
  }

  if (clickedTile) {
    addTileGlow(clickedTile);
  }
}

/**
 * Sets emissive property for a clicked tile.
 * 
 * @param {Object} clickedTile - The intersected mesh that was clicked.
 */
const addTileGlow = (clickedTile) => {
  clickedTile.material.emissive.setHex(clickedTile.currentHex);
  clickedTile.currentHex = clickedTile.material.emissive.getHex();
  clickedTile.material.emissive.setHex(0x0067ff);
  prevClickedTile = clickedTile;
};

/**
 * Sets previously clicked tiles emissive property to null.
 */
const removeTileGlow = async () => {
  prevClickedTile.material.emissive.setHex(null);
};