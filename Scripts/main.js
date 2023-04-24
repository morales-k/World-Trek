import { Scene, PerspectiveCamera, WebGLRenderer, Color, 
  ACESFilmicToneMapping, sRGBEncoding, PMREMGenerator, 
  FloatType, PCFShadowMap, TextureLoader, BoxGeometry } from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { createAmbientLight } from "./light";
import { addHexes, createHexMesh } from "./hex";
import { createMapEdge, createMapFloor } from "./map";
import { createWater } from "./water";
import { setControls } from "./controls";
  
const scene = new Scene();
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
const renderer = new WebGLRenderer({ antialias: true });
const controls = setControls(camera, renderer);

scene.background = new Color("#AECFE6");
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

const loop = async () => {
  // Process enviornment map
  let pmrem = new PMREMGenerator(renderer);
  let envmapTexture = await new RGBELoader().setDataType(FloatType).loadAsync("assets/envmap.hdr");
  let envmap = pmrem.fromEquirectangular(envmapTexture).texture;

  const maxHeight = 3;
  let textures = {
    dirt: await new TextureLoader().loadAsync("assets/dirt.jpg"),
    grass: await new TextureLoader().loadAsync("assets/grass.png"),
    bark: await new TextureLoader().loadAsync("assets/bark.png"),
    leaves: await new TextureLoader().loadAsync("assets/leaves.jpg"),
    stone: await new TextureLoader().loadAsync("assets/stone.png"),
    water: await new TextureLoader().loadAsync("assets/water.png"),
  };

  let textureGeos = {
    dirt: new BoxGeometry(0, 0, 0),
    grass: new BoxGeometry(0, 0, 0),
    bark: new BoxGeometry(0, 0, 0),
    leaves: new BoxGeometry(0, 0, 0),
    stone: new BoxGeometry(0, 0, 0)
  };

  addHexes(maxHeight, textureGeos);

  let dirtMesh = createHexMesh(envmap, textureGeos.dirt, textures.dirt);
  let grassMesh = createHexMesh(envmap, textureGeos.grass, textures.grass);
  let barkMesh = createHexMesh(envmap, textureGeos.bark, textures.bark);
  let leavesMesh = createHexMesh(envmap, textureGeos.leaves, textures.leaves);
  let stoneMesh = createHexMesh(envmap, textureGeos.stone, textures.stone);

  const ambientLight = createAmbientLight();
  const mapEdge = createMapEdge(envmap, textures.dirt, maxHeight);
  const mapFloor = createMapFloor(envmap, textures.dirt, maxHeight);
  const water = createWater(envmap, textures.water, maxHeight);

  scene.add(ambientLight, mapEdge, mapFloor, water, dirtMesh, grassMesh, barkMesh, 
    leavesMesh, stoneMesh);

  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });
}
loop();

// Set event listener for resizing window.
window.addEventListener("resize", async () => {
  handleResize();
});