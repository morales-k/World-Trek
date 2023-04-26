import { TextureLoader, BoxGeometry } from "three";

export const textures = {
  dirt: await new TextureLoader().loadAsync("assets/dirt.jpg"),
  grass: await new TextureLoader().loadAsync("assets/grass.png"),
  bark: await new TextureLoader().loadAsync("assets/bark.png"),
  leaves: await new TextureLoader().loadAsync("assets/leaves.jpg"),
  cobblestone: await new TextureLoader().loadAsync("assets/cobblestone.png"),
  stone: await new TextureLoader().loadAsync("assets/stone.png"),
  water: await new TextureLoader().loadAsync("assets/water.png"),
  player: await new TextureLoader().loadAsync("assets/player.jpg"),
};

export const textureGeos = {
  dirt: new BoxGeometry(0, 0, 0),
  grass: new BoxGeometry(0, 0, 0),
  bark: new BoxGeometry(0, 0, 0),
  leaves: new BoxGeometry(0, 0, 0),
  stone: new BoxGeometry(0, 0, 0),
  player: new BoxGeometry(0, 0, 0),
};