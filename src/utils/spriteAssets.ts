import kretImg from '../assets/images/kret_detective_1794499977527.jpg';
import sowaImg from '../assets/images/owl_wizard_1794499979122.jpg';
import lisImg from '../assets/images/fox_felix_1794499979593.jpg';
import borsukImg from '../assets/images/badger_barnaba_1794499979555.jpg';
import jezImg from '../assets/images/hedgehog_igielka_1794499979801.jpg';

// Bitmap Sprite Asset Paths bundled by Vite
export const SPRITE_URLS = {
  kret: kretImg,
  sowa: sowaImg,
  lis: lisImg,
  borsuk: borsukImg,
  jez: jezImg,
};

class SpriteManager {
  private images: { [key: string]: HTMLImageElement } = {};
  private loaded: { [key: string]: boolean } = {};

  constructor() {
    if (typeof window !== 'undefined') {
      this.preload();
    }
  }

  private preload() {
    Object.entries(SPRITE_URLS).forEach(([key, url]) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        this.loaded[key] = true;
      };
      this.images[key] = img;
    });
  }

  public getImage(key: keyof typeof SPRITE_URLS): HTMLImageElement | null {
    return this.loaded[key] ? this.images[key] : null;
  }
}

export const spriteManager = new SpriteManager();
