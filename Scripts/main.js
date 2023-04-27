import { Scene, PerspectiveCamera, WebGLRenderer, Color, 
  ACESFilmicToneMapping, sRGBEncoding, PMREMGenerator, 
  FloatType, PCFShadowMap } from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { createAmbientLight } from "./light";
import { addHexes, createHexMesh } from "./hex";
import { createMapEdge, createMapFloor } from "./map";
import { createWater } from "./water";
import { setControls } from "./controls";
import { createPlayer, movePlayer } from "./player";
import { textures, textureGeos } from "./textures";
  
let playerCoords = [5, 5];
const scene = new Scene();
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
const renderer = new WebGLRenderer({ antialias: true });
const controls = setControls(camera, renderer);
const player = createPlayer(textures.player, playerCoords);

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

  addHexes(maxHeight, textureGeos);

  const dirtMesh = createHexMesh(envmap, textureGeos.dirt, textures.dirt);
  const grassMesh = createHexMesh(envmap, textureGeos.grass, textures.grass);
  const barkMesh = createHexMesh(envmap, textureGeos.bark, textures.bark);
  const leavesMesh = createHexMesh(envmap, textureGeos.leaves, textures.leaves);
  const stoneMesh = createHexMesh(envmap, textureGeos.stone, textures.stone);
  
  const ambientLight = createAmbientLight();
  const mapEdge = createMapEdge(envmap, textures.cobblestone, maxHeight);
  const mapFloor = createMapFloor(envmap, textures.cobblestone, maxHeight);
  const water = createWater(envmap, textures.water, maxHeight);

  scene.add(ambientLight, mapEdge, mapFloor, water, dirtMesh, grassMesh, barkMesh, 
    leavesMesh, stoneMesh, player);

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