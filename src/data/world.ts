export interface Platform {
  x1: number;
  x2: number;
  y: number;
  layerName: string;
}

export interface Ladder {
  x: number;
  yTop: number;
  yBottom: number;
  label: string;
}

export interface WorldRoom {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  floorY: number;
  theme: 'bedroom' | 'pantry' | 'tavern' | 'office' | 'cave' | 'cellar' | 'surface_owl' | 'surface_fence';
  ambientLightColor?: string;
}

export const WORLD_WIDTH = 1600;
export const WORLD_HEIGHT = 1000;
export const SURFACE_Y = 220;

export const WORLD_ROOMS: WorldRoom[] = [
  {
    id: 'surface_owl_tree',
    name: 'Wielki Dąb & Dziupla Czarodziejki',
    x: 180,
    y: 20,
    width: 260,
    height: 180,
    floorY: 190,
    theme: 'surface_owl',
  },
  {
    id: 'surface_meadow',
    name: 'Łąka z Kopczykami i Płot Ludzi',
    x: 480,
    y: 60,
    width: 1080,
    height: 140,
    floorY: 190,
    theme: 'surface_fence',
  },
  {
    id: 'kret_home',
    name: 'Nora Detektywa Kreta (Sypialnia)',
    x: 80,
    y: 260,
    width: 320,
    height: 180,
    floorY: 420,
    theme: 'bedroom',
    ambientLightColor: '#fbbf24',
  },
  {
    id: 'upper_pantry',
    name: 'Główna Spiżarnia Podziemia',
    x: 520,
    y: 260,
    width: 380,
    height: 180,
    floorY: 420,
    theme: 'pantry',
    ambientLightColor: '#f59e0b',
  },
  {
    id: 'mouse_office',
    name: 'Gabinet Architekta Pana Myszki',
    x: 1040,
    y: 260,
    width: 340,
    height: 180,
    floorY: 420,
    theme: 'office',
    ambientLightColor: '#38bdf8',
  },
  {
    id: 'tavern_under_root',
    name: 'Tawerna "Pod Wilgotnym Korzeniem"',
    x: 460,
    y: 500,
    width: 520,
    height: 200,
    floorY: 680,
    theme: 'tavern',
    ambientLightColor: '#fb923c',
  },
  {
    id: 'hedgehog_nook',
    name: 'Cicha Norka Jeża Igiełki',
    x: 100,
    y: 520,
    width: 280,
    height: 180,
    floorY: 680,
    theme: 'bedroom',
    ambientLightColor: '#a8a29e',
  },
  {
    id: 'badger_gate',
    name: 'Posterunek i Archiwum Borsuka',
    x: 1080,
    y: 520,
    width: 320,
    height: 180,
    floorY: 680,
    theme: 'pantry',
    ambientLightColor: '#94a3b8',
  },
  {
    id: 'crystal_cave',
    name: 'Kryształowa Grota i Podziemny Staw',
    x: 160,
    y: 740,
    width: 440,
    height: 200,
    floorY: 920,
    theme: 'cave',
    ambientLightColor: '#38bdf8',
  },
  {
    id: 'secret_cellar',
    name: 'Stara Piwnica pod Korzeniami',
    x: 740,
    y: 740,
    width: 520,
    height: 200,
    floorY: 920,
    theme: 'cellar',
    ambientLightColor: '#818cf8',
  },
];

// Horizontal floor platforms that Kret can walk on
export const WORLD_PLATFORMS: Platform[] = [
  // Surface
  { x1: 50, x2: 1550, y: 190, layerName: 'Powierzchnia' },
  // Oak tree branch next to Owl's hollow
  { x1: 140, x2: 300, y: 110, layerName: 'Gałąź Czarodziejki Sowy' },
  // Upper burrow floor
  { x1: 60, x2: 1450, y: 420, layerName: 'Górny Poziom' },
  // Central burrow floor (Tavern level)
  { x1: 80, x2: 1480, y: 680, layerName: 'Środkowy Poziom (Tawerna)' },
  // Deep burrow floor
  { x1: 120, x2: 1350, y: 920, layerName: 'Głęboki Poziom (Jaskinie)' },
];

// Ladders / Roots connecting levels
export const WORLD_LADDERS: Ladder[] = [
  // Oak tree ladder (Surface to Owl's Hollow Branch)
  { x: 200, yTop: 110, yBottom: 190, label: 'Kroki i Szczeble na Pniu Wielkiego Dębu' },
  // West burrow ladder (Surface to Upper Burrow)
  { x: 360, yTop: 190, yBottom: 420, label: 'Korzenie Kreciego Kopca Zachodniego' },
  // East burrow ladder (Surface to Upper Burrow)
  { x: 1080, yTop: 190, yBottom: 420, label: 'Drabinka ze Szponów Dębu' },
  // Central tavern ladder (Upper to Central)
  { x: 480, yTop: 420, yBottom: 680, label: 'Główny Szyb Tawerny' },
  // East corridor ladder (Upper to Central)
  { x: 1240, yTop: 420, yBottom: 680, label: 'Pionowy Tunel Archiwum' },
  // Deep caves ladder (Central to Deep)
  { x: 320, yTop: 680, yBottom: 920, label: 'Szlak Krętych Korzeni' },
  // Cellar ladder (Central to Deep)
  { x: 860, yTop: 680, yBottom: 920, label: 'Kamienne Schodki do Piwnicy' },
];
