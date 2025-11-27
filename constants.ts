
import { CatalogItem, FurnitureType, SavedMaterial } from './types';

export const GRID_SIZE = 20; // pixels per meter
export const WALL_HEIGHT_DEFAULT = 2.5;
export const WALL_THICKNESS_DEFAULT = 0.2;
export const FLOOR_THICKNESS = 0.2;
export const WALL_COLOR_DEFAULT = '#e2e8f0';
export const SCENE_BACKGROUND_COLOR = '#f1f5f9';

export const CATEGORIES = [
  'Doors & Windows',
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Bathroom',
  'Office',
  'Lighting',
  'Stairs',
  'Decoration',
  'Electronics',
  'Outdoor',
  'Roofing',
  'Structural',
  'Vehicles'
];

export const DEFAULT_CUSTOM_MATERIALS: SavedMaterial[] = [
  // Roofing
  { id: 'mat_asphalt', name: 'Roof: Asphalt Shingles', color: '#334155', type: 'MATTE', roughness: 0.9, metalness: 0, emissivity: 0 },
  { id: 'mat_metal_roof', name: 'Roof: Metal (Red)', color: '#7f1d1d', type: 'METAL', roughness: 0.3, metalness: 0.7, emissivity: 0 },
  { id: 'mat_tile', name: 'Roof: Terracotta Tile', color: '#c2410c', type: 'STONE', roughness: 0.6, metalness: 0, emissivity: 0 },
  { id: 'mat_thatch', name: 'Roof: Thatch', color: '#eab308', type: 'MATTE', roughness: 1.0, metalness: 0, emissivity: 0 },
  
  // Exterior Walls
  { id: 'mat_brick_red', name: 'Ext: Brick Wall (Red)', color: '#7f3928', type: 'STONE', roughness: 0.9, metalness: 0, emissivity: 0 },
  { id: 'mat_siding_white', name: 'Ext: Siding (White)', color: '#f8fafc', type: 'MATTE', roughness: 0.8, metalness: 0, emissivity: 0 },
  { id: 'mat_stucco_grey', name: 'Ext: Stucco (Grey)', color: '#94a3b8', type: 'STONE', roughness: 1.0, metalness: 0, emissivity: 0 },
  { id: 'mat_concrete', name: 'Ext: Concrete (Polished)', color: '#cbd5e1', type: 'STONE', roughness: 0.4, metalness: 0, emissivity: 0 },

  // Interior / Flooring
  { id: 'mat_wood_dark', name: 'Int: Dark Oak Floor', color: '#451a03', type: 'WOOD', roughness: 0.6, metalness: 0, emissivity: 0 },
  { id: 'mat_wood_light', name: 'Int: Light Birch Floor', color: '#d6d3d1', type: 'WOOD', roughness: 0.7, metalness: 0, emissivity: 0 },
  { id: 'mat_marble', name: 'Int: White Marble', color: '#f8fafc', type: 'GLOSSY', roughness: 0.1, metalness: 0.1, emissivity: 0 },
  { id: 'mat_tile_slate', name: 'Int: Slate Tile', color: '#334155', type: 'STONE', roughness: 0.8, metalness: 0, emissivity: 0 },
  { id: 'mat_paint_cream', name: 'Int: Wall Paint (Cream)', color: '#fef3c7', type: 'MATTE', roughness: 0.9, metalness: 0, emissivity: 0 },
  { id: 'mat_accent_blue', name: 'Int: Accent Wall (Navy)', color: '#1e3a8a', type: 'MATTE', roughness: 0.9, metalness: 0, emissivity: 0 },
];

export const FURNITURE_CATALOG: CatalogItem[] = [
  // 1. Doors & Windows
  { type: FurnitureType.DOOR, category: 'Doors & Windows', name: 'Standard Door', width: 0.9, depth: 0.1, height: 2.1, color: '#475569', material: 'WOOD' },
  { type: FurnitureType.DOOR, category: 'Doors & Windows', name: 'Double Door', width: 1.8, depth: 0.1, height: 2.1, color: '#475569', material: 'WOOD' },
  { type: FurnitureType.DOOR, category: 'Doors & Windows', name: 'Sliding Door', width: 1.6, depth: 0.1, height: 2.1, color: '#94a3b8', material: 'METAL' },
  { type: FurnitureType.DOOR, category: 'Doors & Windows', name: 'Garage Door', width: 3.0, depth: 0.1, height: 2.2, color: '#334155', material: 'METAL' },
  { type: FurnitureType.DOOR, category: 'Doors & Windows', name: 'Glass Door', width: 0.9, depth: 0.05, height: 2.1, color: '#bfdbfe', material: 'GLASS' },
  { type: FurnitureType.DOOR, category: 'Doors & Windows', name: 'Opening Frame', width: 1.0, depth: 0.2, height: 2.1, color: '#334155', material: 'WOOD' },
  { type: FurnitureType.DOOR, category: 'Doors & Windows', name: 'Arch Opening', width: 1.2, depth: 0.2, height: 2.2, color: '#334155', material: 'MATTE' },
  
  { type: FurnitureType.WINDOW, category: 'Doors & Windows', name: 'Window', width: 1.2, depth: 0.1, height: 1.2, color: '#bfdbfe', material: 'GLASS' },
  { type: FurnitureType.WINDOW, category: 'Doors & Windows', name: 'Large Window', width: 2.0, depth: 0.1, height: 1.5, color: '#bfdbfe', material: 'GLASS' },
  { type: FurnitureType.WINDOW, category: 'Doors & Windows', name: 'French Window', width: 1.0, depth: 0.1, height: 2.0, color: '#bfdbfe', material: 'GLASS' },
  { type: FurnitureType.WINDOW, category: 'Doors & Windows', name: 'Bay Window', width: 2.5, depth: 0.5, height: 1.5, color: '#bfdbfe', material: 'GLASS' },
  { type: FurnitureType.WINDOW, category: 'Doors & Windows', name: 'Round Window', width: 1.0, depth: 0.1, height: 1.0, color: '#bfdbfe', material: 'GLASS' },

  // 2. Living Room
  { type: FurnitureType.DEFAULT, category: 'Living Room', name: 'Sofa (1-seater)', width: 1.0, depth: 0.9, height: 0.8, color: '#475569', material: 'FABRIC' },
  { type: FurnitureType.DEFAULT, category: 'Living Room', name: 'Sofa (2-seater)', width: 1.6, depth: 0.9, height: 0.8, color: '#475569', material: 'FABRIC' },
  { type: FurnitureType.DEFAULT, category: 'Living Room', name: 'Sofa (3-seater)', width: 2.2, depth: 0.9, height: 0.8, color: '#475569', material: 'FABRIC' },
  { type: FurnitureType.DEFAULT, category: 'Living Room', name: 'Corner Sofa', width: 2.5, depth: 2.0, height: 0.8, color: '#475569', material: 'FABRIC' },
  { type: FurnitureType.DEFAULT, category: 'Living Room', name: 'Armchair', width: 0.9, depth: 0.9, height: 0.9, color: '#64748b', material: 'FABRIC' },
  { type: FurnitureType.DEFAULT, category: 'Living Room', name: 'Coffee Table', width: 1.2, depth: 0.6, height: 0.45, color: '#78350f', material: 'WOOD' },
  { type: FurnitureType.DEFAULT, category: 'Living Room', name: 'Side Table', width: 0.5, depth: 0.5, height: 0.5, color: '#78350f', material: 'WOOD' },
  { type: FurnitureType.DEFAULT, category: 'Living Room', name: 'TV Unit', width: 1.8, depth: 0.4, height: 0.5, color: '#1e293b', material: 'WOOD' },
  { type: FurnitureType.DEFAULT, category: 'Living Room', name: 'Bookshelf', width: 0.8, depth: 0.3, height: 1.8, color: '#78350f', material: 'WOOD' },
  { type: FurnitureType.DEFAULT, category: 'Living Room', name: 'Display Cabinet', width: 1.0, depth: 0.4, height: 1.9, color: '#f8fafc', material: 'GLASS' },
  { type: FurnitureType.RUG, category: 'Living Room', name: 'Carpet', width: 3.0, depth: 2.0, height: 0.02, color: '#e2e8f0', material: 'FABRIC' },

  // 3. Bedroom
  { type: FurnitureType.DEFAULT, category: 'Bedroom', name: 'Single Bed', width: 0.9, depth: 2.0, height: 0.5, color: '#3b82f6', material: 'FABRIC' },
  { type: FurnitureType.DEFAULT, category: 'Bedroom', name: 'Double Bed', width: 1.4, depth: 2.0, height: 0.5, color: '#3b82f6', material: 'FABRIC' },
  { type: FurnitureType.DEFAULT, category: 'Bedroom', name: 'King Bed', width: 1.8, depth: 2.0, height: 0.5, color: '#3b82f6', material: 'FABRIC' },
  { type: FurnitureType.DEFAULT, category: 'Bedroom', name: 'Bunk Bed', width: 1.0, depth: 2.0, height: 1.7, color: '#3b82f6', material: 'WOOD' },
  { type: FurnitureType.DEFAULT, category: 'Bedroom', name: 'Mattress', width: 1.4, depth: 2.0, height: 0.2, color: '#ffffff', material: 'FABRIC' },
  { type: FurnitureType.DEFAULT, category: 'Bedroom', name: 'Wardrobe', width: 1.2, depth: 0.6, height: 2.0, color: '#78350f', material: 'WOOD' },
  { type: FurnitureType.DEFAULT, category: 'Bedroom', name: 'Dressing Table', width: 1.0, depth: 0.5, height: 1.4, color: '#78350f', material: 'WOOD' },
  { type: FurnitureType.DEFAULT, category: 'Bedroom', name: 'Bedside Table', width: 0.5, depth: 0.4, height: 0.5, color: '#78350f', material: 'WOOD' },
  { type: FurnitureType.DEFAULT, category: 'Bedroom', name: 'Mirror', width: 0.6, depth: 0.05, height: 1.2, color: '#bfdbfe', material: 'GLASS' },

  // 4. Kitchen
  { type: FurnitureType.DEFAULT, category: 'Kitchen', name: 'Kitchen Cabinet', width: 0.6, depth: 0.6, height: 0.9, color: '#f1f5f9', material: 'GLOSSY' },
  { type: FurnitureType.DEFAULT, category: 'Kitchen', name: 'Wall Cabinet', width: 0.6, depth: 0.35, height: 0.7, color: '#f1f5f9', material: 'GLOSSY' },
  { type: FurnitureType.DEFAULT, category: 'Kitchen', name: 'Kitchen Island', width: 1.5, depth: 0.9, height: 0.9, color: '#f8fafc', material: 'GLOSSY' },
  { type: FurnitureType.DEFAULT, category: 'Kitchen', name: 'Sink', width: 0.8, depth: 0.6, height: 0.9, color: '#cbd5e1', material: 'METAL' },
  { type: FurnitureType.DEFAULT, category: 'Kitchen', name: 'Refrigerator', width: 0.9, depth: 0.7, height: 1.8, color: '#e2e8f0', material: 'METAL' },
  { type: FurnitureType.DEFAULT, category: 'Kitchen', name: 'Stove/Cooktop', width: 0.8, depth: 0.6, height: 0.9, color: '#1e293b', material: 'METAL' },
  { type: FurnitureType.DEFAULT, category: 'Kitchen', name: 'Oven', width: 0.6, depth: 0.6, height: 0.6, color: '#1e293b', material: 'METAL' },
  { type: FurnitureType.DEFAULT, category: 'Kitchen', name: 'Microwave', width: 0.5, depth: 0.4, height: 0.35, color: '#e2e8f0', material: 'METAL' },
  { type: FurnitureType.DEFAULT, category: 'Kitchen', name: 'Dining Table', width: 1.5, depth: 0.9, height: 0.75, color: '#78350f', material: 'WOOD' },
  { type: FurnitureType.DEFAULT, category: 'Kitchen', name: 'Dining Chair', width: 0.5, depth: 0.5, height: 0.9, color: '#78350f', material: 'WOOD' },
  { type: FurnitureType.DEFAULT, category: 'Kitchen', name: 'Bar Stool', width: 0.4, depth: 0.4, height: 1.0, color: '#1e293b', material: 'METAL' },

  // 5. Bathroom
  { type: FurnitureType.DEFAULT, category: 'Bathroom', name: 'Toilet', width: 0.4, depth: 0.6, height: 0.8, color: '#ffffff', material: 'GLOSSY' },
  { type: FurnitureType.DEFAULT, category: 'Bathroom', name: 'Washbasin', width: 0.6, depth: 0.5, height: 0.9, color: '#ffffff', material: 'GLOSSY' },
  { type: FurnitureType.DEFAULT, category: 'Bathroom', name: 'Shower Cabinet', width: 0.9, depth: 0.9, height: 2.1, color: '#bae6fd', material: 'GLASS' },
  { type: FurnitureType.DEFAULT, category: 'Bathroom', name: 'Bathtub', width: 1.7, depth: 0.8, height: 0.6, color: '#ffffff', material: 'GLOSSY' },
  { type: FurnitureType.DEFAULT, category: 'Bathroom', name: 'Bathroom Cabinet', width: 0.6, depth: 0.4, height: 1.8, color: '#ffffff', material: 'GLOSSY' },
  { type: FurnitureType.DEFAULT, category: 'Bathroom', name: 'Towel Rack', width: 0.6, depth: 0.1, height: 0.1, color: '#cbd5e1', material: 'METAL' },
  { type: FurnitureType.DEFAULT, category: 'Bathroom', name: 'Water Heater', width: 0.4, depth: 0.4, height: 0.8, color: '#ffffff', material: 'GLOSSY' },

  // 6. Office
  { type: FurnitureType.DEFAULT, category: 'Office', name: 'Office Desk', width: 1.4, depth: 0.7, height: 0.75, color: '#cbd5e1', material: 'WOOD' },
  { type: FurnitureType.DEFAULT, category: 'Office', name: 'Workstation', width: 1.8, depth: 1.6, height: 0.75, color: '#e2e8f0', material: 'WOOD' },
  { type: FurnitureType.DEFAULT, category: 'Office', name: 'Office Chair', width: 0.6, depth: 0.6, height: 1.1, color: '#1e293b', material: 'FABRIC' },
  { type: FurnitureType.DEFAULT, category: 'Office', name: 'Filing Cabinet', width: 0.5, depth: 0.6, height: 1.2, color: '#64748b', material: 'METAL' },
  { type: FurnitureType.DEFAULT, category: 'Office', name: 'Printer', width: 0.5, depth: 0.4, height: 0.3, color: '#1e293b', material: 'MATTE' },
  { type: FurnitureType.DEFAULT, category: 'Office', name: 'Laptop', width: 0.35, depth: 0.25, height: 0.02, color: '#cbd5e1', material: 'METAL' },
  { type: FurnitureType.DEFAULT, category: 'Office', name: 'Computer', width: 0.2, depth: 0.5, height: 0.5, color: '#000000', material: 'MATTE' },

  // 7. Lighting
  { type: FurnitureType.LIGHT, category: 'Lighting', name: 'Ceiling Light', width: 0.3, depth: 0.3, height: 0.1, color: '#fef3c7', material: 'GLASS' },
  { type: FurnitureType.LIGHT, category: 'Lighting', name: 'Pendant Light', width: 0.4, depth: 0.4, height: 0.8, color: '#fef3c7', material: 'METAL' },
  { type: FurnitureType.LIGHT, category: 'Lighting', name: 'Wall Light', width: 0.2, depth: 0.1, height: 0.3, color: '#fef3c7', material: 'GLASS' },
  { type: FurnitureType.LIGHT, category: 'Lighting', name: 'Floor Lamp', width: 0.4, depth: 0.4, height: 1.6, color: '#fef3c7', material: 'METAL' },
  { type: FurnitureType.LIGHT, category: 'Lighting', name: 'Table Lamp', width: 0.2, depth: 0.2, height: 0.4, color: '#fef3c7', material: 'FABRIC' },

  // 8. Stairs
  { type: FurnitureType.STAIRS, category: 'Stairs', name: 'Straight Stairs', width: 1.0, depth: 3.0, height: 2.5, color: '#b45309', material: 'WOOD' },
  { type: FurnitureType.STAIRS, category: 'Stairs', name: 'L-Shape Stairs', width: 2.0, depth: 2.0, height: 2.5, color: '#b45309', material: 'WOOD' },
  { type: FurnitureType.STAIRS, category: 'Stairs', name: 'U-Shape Stairs', width: 2.0, depth: 3.0, height: 2.5, color: '#b45309', material: 'WOOD' },
  { type: FurnitureType.STAIRS, category: 'Stairs', name: 'Spiral Staircase', width: 1.5, depth: 1.5, height: 2.5, color: '#475569', material: 'METAL' },
  { type: FurnitureType.STAIRS, category: 'Stairs', name: 'Ladder', width: 0.5, depth: 0.1, height: 2.5, color: '#94a3b8', material: 'METAL' },
  { type: FurnitureType.RAILING, category: 'Stairs', name: 'Stair Railing', width: 3.0, depth: 0.1, height: 0.9, color: '#334155', material: 'METAL' },

  // 9. Decoration
  { type: FurnitureType.DEFAULT, category: 'Decoration', name: 'Curtains', width: 1.5, depth: 0.1, height: 2.0, color: '#e2e8f0', material: 'FABRIC' },
  { type: FurnitureType.DEFAULT, category: 'Decoration', name: 'Plant Pot', width: 0.5, depth: 0.5, height: 1.0, color: '#16a34a', material: 'MATTE' },
  { type: FurnitureType.DEFAULT, category: 'Decoration', name: 'Vase', width: 0.2, depth: 0.2, height: 0.4, color: '#f472b6', material: 'GLOSSY' },
  { type: FurnitureType.DEFAULT, category: 'Decoration', name: 'Painting', width: 0.8, depth: 0.05, height: 0.6, color: '#f472b6', material: 'MATTE' },
  { type: FurnitureType.DEFAULT, category: 'Decoration', name: 'Clock', width: 0.4, depth: 0.05, height: 0.4, color: '#ffffff', material: 'GLOSSY' },
  { type: FurnitureType.DEFAULT, category: 'Decoration', name: 'Aquarium', width: 1.0, depth: 0.4, height: 0.6, color: '#bae6fd', material: 'GLASS' },
  { type: FurnitureType.DEFAULT, category: 'Decoration', name: 'Room Divider', width: 1.5, depth: 0.1, height: 1.8, color: '#cbd5e1', material: 'WOOD' },

  // 10. Electronics
  { type: FurnitureType.DEFAULT, category: 'Electronics', name: 'Television', width: 1.2, depth: 0.1, height: 0.7, color: '#000000', material: 'GLOSSY' },
  { type: FurnitureType.DEFAULT, category: 'Electronics', name: 'Home Theater', width: 2.0, depth: 0.4, height: 0.6, color: '#1e293b', material: 'MATTE' },
  { type: FurnitureType.DEFAULT, category: 'Electronics', name: 'AC Unit', width: 1.0, depth: 0.25, height: 0.3, color: '#ffffff', material: 'MATTE' },
  { type: FurnitureType.DEFAULT, category: 'Electronics', name: 'Ceiling Fan', width: 1.2, depth: 1.2, height: 0.4, color: '#ffffff', material: 'MATTE' },
  { type: FurnitureType.DEFAULT, category: 'Electronics', name: 'Washing Machine', width: 0.6, depth: 0.6, height: 0.9, color: '#ffffff', material: 'GLOSSY' },
  { type: FurnitureType.DEFAULT, category: 'Electronics', name: 'Heater', width: 0.6, depth: 0.2, height: 0.6, color: '#ffffff', material: 'METAL' },
  { type: FurnitureType.DEFAULT, category: 'Electronics', name: 'Water Cooler', width: 0.4, depth: 0.4, height: 1.2, color: '#ffffff', material: 'GLOSSY' },

  // 11. Outdoor
  { type: FurnitureType.DEFAULT, category: 'Outdoor', name: 'Outdoor Chair', width: 0.6, depth: 0.6, height: 0.9, color: '#78350f', material: 'WOOD' },
  { type: FurnitureType.DEFAULT, category: 'Outdoor', name: 'Outdoor Table', width: 1.0, depth: 1.0, height: 0.75, color: '#78350f', material: 'WOOD' },
  { type: FurnitureType.DEFAULT, category: 'Outdoor', name: 'Garden Bench', width: 1.5, depth: 0.6, height: 0.8, color: '#78350f', material: 'WOOD' },
  { type: FurnitureType.DEFAULT, category: 'Outdoor', name: 'Umbrella', width: 2.0, depth: 2.0, height: 2.2, color: '#ef4444', material: 'FABRIC' },
  { type: FurnitureType.DEFAULT, category: 'Outdoor', name: 'Tree', width: 1.5, depth: 1.5, height: 4.0, color: '#166534', material: 'MATTE' },
  { type: FurnitureType.DEFAULT, category: 'Outdoor', name: 'Swing', width: 2.0, depth: 1.0, height: 2.0, color: '#78350f', material: 'WOOD' },
  { type: FurnitureType.LIGHT, category: 'Outdoor', name: 'Garden Lamp', width: 0.3, depth: 0.3, height: 0.8, color: '#fef3c7', material: 'METAL' },

  // 12. Roofing (New)
  { type: FurnitureType.ROOF, category: 'Roofing', name: 'Flat Roof (Concrete)', width: 10.0, depth: 10.0, height: 0.2, color: '#334155', material: 'MATTE' },
  { type: FurnitureType.ROOF, category: 'Roofing', name: 'Gable Roof (Asphalt)', width: 8.0, depth: 6.0, height: 2.0, color: '#334155', material: 'MATTE', roughness: 0.9, metalness: 0 },
  { type: FurnitureType.ROOF, category: 'Roofing', name: 'Pyramid Roof (Tile)', width: 8.0, depth: 8.0, height: 2.5, color: '#c2410c', material: 'STONE', roughness: 0.6, metalness: 0 },
  { type: FurnitureType.ROOF, category: 'Roofing', name: 'Shed Roof (Metal)', width: 6.0, depth: 4.0, height: 1.5, color: '#7f1d1d', material: 'METAL', roughness: 0.3, metalness: 0.7 },
  { type: FurnitureType.ROOF, category: 'Roofing', name: 'Thatch Roof', width: 6.0, depth: 6.0, height: 2.0, color: '#eab308', material: 'MATTE', roughness: 1.0, metalness: 0 },

  // 13. Structural 
  { type: FurnitureType.DEFAULT, category: 'Structural', name: 'Column (Square)', width: 0.4, depth: 0.4, height: 2.5, color: '#e2e8f0', material: 'MATTE' },
  { type: FurnitureType.DEFAULT, category: 'Structural', name: 'Beam', width: 4.0, depth: 0.3, height: 0.3, color: '#cbd5e1', material: 'MATTE' },
  { type: FurnitureType.DEFAULT, category: 'Structural', name: 'Support Pole', width: 0.15, depth: 0.15, height: 2.5, color: '#94a3b8', material: 'METAL' },
  { type: FurnitureType.DOOR, category: 'Structural', name: 'Arch', width: 1.5, depth: 0.3, height: 2.5, color: '#cbd5e1', material: 'MATTE' },
  { type: FurnitureType.DEFAULT, category: 'Structural', name: 'Partition Wall', width: 2.0, depth: 0.1, height: 2.5, color: '#e2e8f0', material: 'MATTE' },
  { type: FurnitureType.DEFAULT, category: 'Structural', name: 'Half Wall', width: 2.0, depth: 0.2, height: 1.2, color: '#e2e8f0', material: 'MATTE' },
  { type: FurnitureType.RAILING, category: 'Structural', name: 'Fence', width: 3.0, depth: 0.1, height: 1.2, color: '#78350f', material: 'WOOD' },
  { type: FurnitureType.RAILING, category: 'Structural', name: 'Balcony Railing', width: 3.0, depth: 0.1, height: 1.0, color: '#cbd5e1', material: 'METAL' },
  
  // Foundation 
  { type: FurnitureType.FOUNDATION, category: 'Structural', name: 'Concrete Slab', width: 12.0, depth: 12.0, height: 0.5, color: '#94a3b8', material: 'MATTE' },
  { type: FurnitureType.FOUNDATION, category: 'Structural', name: 'Stone Base', width: 10.0, depth: 10.0, height: 0.6, color: '#57534e', material: 'STONE' },
  { type: FurnitureType.FOUNDATION, category: 'Structural', name: 'Grass Lawn', width: 20.0, depth: 20.0, height: 0.1, color: '#4d7c0f', material: 'GRASS' },
  { type: FurnitureType.FOUNDATION, category: 'Structural', name: 'Wooden Deck', width: 5.0, depth: 5.0, height: 0.3, color: '#78350f', material: 'WOOD' },

  // 14. Vehicles
  { type: FurnitureType.VEHICLE, category: 'Vehicles', name: 'Car', width: 2.0, depth: 4.5, height: 1.5, color: '#3b82f6', material: 'GLOSSY' },
  { type: FurnitureType.VEHICLE, category: 'Vehicles', name: 'SUV/Truck', width: 2.2, depth: 5.0, height: 1.8, color: '#1e293b', material: 'GLOSSY' },
  { type: FurnitureType.VEHICLE, category: 'Vehicles', name: 'Motorbike', width: 0.8, depth: 2.0, height: 1.1, color: '#ef4444', material: 'METAL' },
  { type: FurnitureType.VEHICLE, category: 'Vehicles', name: 'Scooter', width: 0.7, depth: 1.8, height: 1.1, color: '#f59e0b', material: 'METAL' },

  // Custom
  { type: FurnitureType.CUSTOM, category: 'Structural', name: 'Custom Object', width: 1.0, depth: 1.0, height: 1.0, color: '#ec4899', material: 'MATTE' },
];
