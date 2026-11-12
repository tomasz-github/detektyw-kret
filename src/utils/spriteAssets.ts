// Bitmap Sprite Asset Paths generated via image generation tool
export const SPRITE_URLS = {
  kret: '/src/assets/images/kret_detective_1794499977527.jpg',
  sowa: '/src/assets/images/owl_wizard_1794499979122.jpg',
  lis: '/src/assets/images/fox_felix_1794499979593.jpg',
  borsuk: '/src/assets/images/badger_barnaba_1794499979555.jpg',
  jez: '/src/assets/images/hedgehog_igielka_1794499979801.jpg',
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
