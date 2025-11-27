
export interface Vector2 {
  x: number;
  y: number;
}

export interface Dimension {
  id: string;
  start: Vector2;
  end: Vector2;
  value: number; // Length in meters
  floor: number;
}

export type MaterialType = 'MATTE' | 'GLOSSY' | 'WOOD' | 'METAL' | 'GLASS' | 'FABRIC' | 'STONE' | 'GRASS';

export interface Wall {
  id: string;
  start: Vector2;
  end: Vector2;
  thickness: number;
  height: number;
  elevation: number; // Added elevation for walls
  color: string;
  floor: number;
  material: MaterialType; 
  roughness: number;
  metalness: number;
  emissivity: number;
  textureUrl?: string;
  textureScale?: number; // Tiles per meter
}

export enum FurnitureType {
  DEFAULT = 'DEFAULT',
  DOOR = 'DOOR',
  WINDOW = 'WINDOW',
  STAIRS = 'STAIRS',
  LIGHT = 'LIGHT',
  RUG = 'RUG',
  ROOF = 'ROOF',
  FOUNDATION = 'FOUNDATION',
  CUSTOM = 'CUSTOM',
  VEHICLE = 'VEHICLE',
  RAILING = 'RAILING'
}

export interface SavedMaterial {
  id: string;
  name: string;
  color: string;
  type: MaterialType;
  roughness: number;
  metalness: number;
  emissivity: number;
  textureUrl?: string;
}

export interface Furniture {
  id: string;
  type: FurnitureType;
  category: string;
  position: Vector2;
  rotation: number; // in radians
  width: number;
  depth: number;
  height: number;
  elevation: number; // Height from floor in meters
  color: string;
  material: MaterialType;
  name: string;
  floor: number;
  modelUrl?: string;
  // Advanced Finishes
  roughness?: number;
  metalness?: number;
  emissivity?: number;
  lightIntensity?: number; // For lights
  textureUrl?: string;
  textureScale?: number;
}

export interface CatalogItem {
  type: FurnitureType;
  category: string;
  name: string;
  width: number;
  depth: number;
  height: number;
  color: string;
  material: MaterialType;
  roughness?: number;
  metalness?: number;
}

export type ToolMode = 'SELECT' | 'DRAW_WALL' | 'PLACE_FURNITURE' | 'MEASURE';

export type CameraView = 'PERSPECTIVE' | 'TOP' | 'FRONT' | 'RIGHT' | 'BACK' | 'LEFT';

export interface SceneSettings {
  ambientIntensity: number;
  sunIntensity: number;
  sunPosition: [number, number, number];
  showCeiling: boolean;
  showFloor: boolean;
}

export interface ProjectState {
  walls: Wall[];
  furniture: Furniture[];
  dimensions: Dimension[];
  materials: SavedMaterial[];
  selectedId: string | null;
  activeFloor: number;
  scene: SceneSettings;
}
