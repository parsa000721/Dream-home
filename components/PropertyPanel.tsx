
import React, { useState, useMemo } from 'react';
import { ProjectState, Wall, Furniture, FurnitureType, CatalogItem, MaterialType, SceneSettings, SavedMaterial } from '../types';
import { FURNITURE_CATALOG, CATEGORIES } from '../constants';
import { Settings, Trash2, Plus, Box, Upload, Filter, Palette, Sun, Lightbulb, Save, Layers, Image as ImageIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface PropertyPanelProps {
  state: ProjectState;
  updateWall: (id: string, data: Partial<Wall>) => void;
  updateFurniture: (id: string, data: Partial<Furniture>) => void;
  updateScene: (data: Partial<SceneSettings>) => void;
  deleteItem: () => void;
  addFurniture: (item: CatalogItem) => void;
  addMaterial: (mat: SavedMaterial) => void;
  importModel: (url: string, name: string) => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({ 
  state, updateWall, updateFurniture, updateScene, deleteItem, addFurniture, addMaterial, importModel
}) => {
  const selectedWall = state.walls.find(w => w.id === state.selectedId);
  const selectedFurniture = state.furniture.find(f => f.id === state.selectedId);
  
  const [activeCategory, setActiveCategory] = useState<string>('Living Room');
  
  // Custom Material Creation State
  const [newMatName, setNewMatName] = useState('');
  const [newMatColor, setNewMatColor] = useState('#ffffff');
  const [newMatType, setNewMatType] = useState<MaterialType>('MATTE');
  const [newMatRoughness, setNewMatRoughness] = useState(0.8);
  const [newMatMetalness, setNewMatMetalness] = useState(0);
  const [isCreatingMaterial, setIsCreatingMaterial] = useState(false);

  // Import Model State
  const [importUrl, setImportUrl] = useState('');
  const [importName, setImportName] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const filteredCatalog = useMemo(() => {
    return FURNITURE_CATALOG.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const handleSaveMaterial = () => {
    if (!newMatName) return;
    const mat: SavedMaterial = {
      id: uuidv4(),
      name: newMatName,
      color: newMatColor,
      type: newMatType,
      roughness: newMatRoughness,
      metalness: newMatMetalness,
      emissivity: 0
    };
    addMaterial(mat);
    setNewMatName('');
    setIsCreatingMaterial(false);
  };

  const handleApplyMaterial = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    
    // Check if it's a custom material
    const customMat = state.materials.find(m => m.id === val);
    
    if (selectedFurniture) {
      if (customMat) {
        updateFurniture(selectedFurniture.id, {
          material: customMat.type,
          color: customMat.color,
          roughness: customMat.roughness,
          metalness: customMat.metalness,
          emissivity: customMat.emissivity,
          textureUrl: customMat.textureUrl
        });
      } else {
        updateFurniture(selectedFurniture.id, { material: val as MaterialType });
      }
    } else if (selectedWall) {
      if (customMat) {
        updateWall(selectedWall.id, {
          material: customMat.type, // Added wall material type
          color: customMat.color,
          roughness: customMat.roughness,
          metalness: customMat.metalness,
          emissivity: customMat.emissivity,
          textureUrl: customMat.textureUrl
        });
      } else if (val) {
        updateWall(selectedWall.id, { material: val as MaterialType });
      }
    }
  };

  return (
    <div className="w-80 bg-white border-l border-slate-200 h-full flex flex-col shadow-xl z-10 overflow-hidden">
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        
        {/* Selection Properties */}
        {selectedWall && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Settings className="w-4 h-4" /> Wall Properties
              </h3>
              <button onClick={deleteItem} className="text-red-500 hover:bg-red-50 p-1 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Height (m)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={selectedWall.height}
                    onChange={(e) => updateWall(selectedWall.id, { height: parseFloat(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                   <label className="text-xs font-medium text-slate-500 uppercase">Elevation (m)</label>
                   <input 
                     type="number" 
                     step="0.1"
                     value={selectedWall.elevation || 0}
                     onChange={(e) => updateWall(selectedWall.id, { elevation: parseFloat(e.target.value) })}
                     className="w-full mt-1 px-3 py-2 bg-slate-50 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase">Thickness (m)</label>
                <input 
                  type="number" 
                  step="0.05"
                  value={selectedWall.thickness}
                  onChange={(e) => updateWall(selectedWall.id, { thickness: parseFloat(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="pt-2 border-t border-slate-100">
                 <label className="text-xs font-medium text-slate-500 uppercase mb-2 block">Material Preset</label>
                 <select 
                   onChange={handleApplyMaterial}
                   value={state.materials.find(m => m.color === selectedWall.color && m.roughness === selectedWall.roughness)?.id || selectedWall.material}
                   className="w-full mb-3 px-2 py-1.5 bg-slate-50 border rounded text-xs"
                 >
                   <option value="">-- Select Material --</option>
                   <optgroup label="Standard Presets">
                      <option value="MATTE">Matte</option>
                      <option value="GLOSSY">Glossy</option>
                      <option value="WOOD">Wood</option>
                      <option value="METAL">Metal</option>
                      <option value="GLASS">Glass</option>
                      <option value="STONE">Stone</option>
                   </optgroup>
                   <optgroup label="Custom Materials">
                      {state.materials.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                   </optgroup>
                 </select>

                <label className="text-xs font-medium text-slate-500 uppercase mb-2 block">Custom Color</label>
                <div className="flex items-center gap-2 mb-3">
                   <input 
                    type="color" 
                    value={selectedWall.color}
                    onChange={(e) => updateWall(selectedWall.id, { color: e.target.value })}
                    className="h-8 w-full rounded-md cursor-pointer"
                  />
                </div>
                
                <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="mb-3">
                    <label className="text-xs font-medium text-slate-500 mb-1 block flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> Texture URL (Image)
                    </label>
                    <input 
                      type="text"
                      placeholder="https://..."
                      value={selectedWall.textureUrl || ''}
                      onChange={(e) => updateWall(selectedWall.id, { textureUrl: e.target.value })}
                      className="w-full px-2 py-1 bg-white border rounded text-xs mb-2"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                      <span>Texture Scale</span>
                      <span>{(selectedWall.textureScale ?? 1).toFixed(1)}x</span>
                    </div>
                    <input 
                      type="range" min="0.1" max="5" step="0.1"
                      value={selectedWall.textureScale ?? 1}
                      onChange={(e) => updateWall(selectedWall.id, { textureScale: parseFloat(e.target.value) })}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="mb-3 border-t border-slate-200 pt-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                      <span>Roughness</span>
                      <span>{(selectedWall.roughness ?? 0.8).toFixed(2)}</span>
                    </div>
                    <input 
                      type="range" min="0" max="1" step="0.05"
                      value={selectedWall.roughness ?? 0.8}
                      onChange={(e) => updateWall(selectedWall.id, { roughness: parseFloat(e.target.value) })}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="mb-3">
                     <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                      <span>Metalness</span>
                      <span>{(selectedWall.metalness ?? 0).toFixed(2)}</span>
                    </div>
                    <input 
                      type="range" min="0" max="1" step="0.05"
                      value={selectedWall.metalness ?? 0}
                      onChange={(e) => updateWall(selectedWall.id, { metalness: parseFloat(e.target.value) })}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                      <span>Emissivity (Glow)</span>
                      <span>{(selectedWall.emissivity ?? 0).toFixed(1)}</span>
                    </div>
                    <input 
                      type="range" min="0" max="2" step="0.1"
                      value={selectedWall.emissivity ?? 0}
                      onChange={(e) => updateWall(selectedWall.id, { emissivity: parseFloat(e.target.value) })}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {selectedFurniture && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Settings className="w-4 h-4" /> {selectedFurniture.name}
              </h3>
              <button onClick={deleteItem} className="text-red-500 hover:bg-red-50 p-1 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {selectedFurniture.type === FurnitureType.CUSTOM && (
                <div className="bg-slate-50 p-2 rounded text-xs text-slate-600 break-all border border-slate-200">
                   <Upload className="w-3 h-3 inline mr-1"/> {selectedFurniture.modelUrl || 'No Model URL'}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                   <label className="text-xs font-medium text-slate-500 uppercase">Width (m)</label>
                   <input type="number" step="0.1" value={selectedFurniture.width} onChange={(e) => updateFurniture(selectedFurniture.id, { width: parseFloat(e.target.value) })} className="w-full mt-1 px-2 py-1.5 bg-slate-50 border rounded text-sm"/>
                </div>
                <div>
                   <label className="text-xs font-medium text-slate-500 uppercase">Depth (m)</label>
                   <input type="number" step="0.1" value={selectedFurniture.depth} onChange={(e) => updateFurniture(selectedFurniture.id, { depth: parseFloat(e.target.value) })} className="w-full mt-1 px-2 py-1.5 bg-slate-50 border rounded text-sm"/>
                </div>
                <div>
                   <label className="text-xs font-medium text-slate-500 uppercase">Height (m)</label>
                   <input type="number" step="0.1" value={selectedFurniture.height} onChange={(e) => updateFurniture(selectedFurniture.id, { height: parseFloat(e.target.value) })} className="w-full mt-1 px-2 py-1.5 bg-slate-50 border rounded text-sm"/>
                </div>
                 <div>
                   <label className="text-xs font-medium text-slate-500 uppercase">Elevation (m)</label>
                   <input 
                     type="number" 
                     step="0.05" 
                     value={selectedFurniture.elevation || 0} 
                     onChange={(e) => updateFurniture(selectedFurniture.id, { elevation: parseFloat(e.target.value) })} 
                     className="w-full mt-1 px-2 py-1.5 bg-slate-50 border rounded text-sm"
                   />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 uppercase">Rotation (deg)</label>
                <input 
                  type="range" 
                  min="0" max="360"
                  value={(selectedFurniture.rotation * 180 / Math.PI).toFixed(0)}
                  onChange={(e) => updateFurniture(selectedFurniture.id, { rotation: parseFloat(e.target.value) * Math.PI / 180 })}
                  className="w-full mt-2 accent-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div>
                   <label className="text-xs font-medium text-slate-500 uppercase">Material Preset</label>
                   <select 
                     value={state.materials.find(m => m.color === selectedFurniture.color && m.roughness === selectedFurniture.roughness)?.id || selectedFurniture.material}
                     onChange={handleApplyMaterial}
                     className="w-full mt-1 px-2 py-1.5 bg-slate-50 border rounded text-xs"
                   >
                     <optgroup label="Standard">
                        <option value="MATTE">Matte Paint</option>
                        <option value="GLOSSY">Glossy</option>
                        <option value="WOOD">Wood</option>
                        <option value="METAL">Metal</option>
                        <option value="GLASS">Glass</option>
                        <option value="FABRIC">Fabric</option>
                        <option value="STONE">Stone</option>
                        <option value="GRASS">Grass</option>
                     </optgroup>
                     <optgroup label="Saved Materials">
                        {state.materials.map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                     </optgroup>
                   </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Base Color</label>
                  <input type="color" value={selectedFurniture.color} onChange={(e) => updateFurniture(selectedFurniture.id, { color: e.target.value })} className="w-full mt-1 h-8 rounded cursor-pointer"/>
                </div>
              </div>

               {/* Advanced Finish for Furniture */}
               <div className="pt-2 border-t border-slate-100">
                <label className="text-xs font-medium text-slate-500 uppercase block mb-2 flex items-center gap-1">
                  <Palette className="w-3 h-3" /> Finish Overrides
                </label>
                
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                   {/* Texture Input */}
                  <div className="mb-3">
                    <label className="text-xs font-medium text-slate-500 mb-1 block flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> Texture URL
                    </label>
                    <input 
                      type="text"
                      placeholder="https://..."
                      value={selectedFurniture.textureUrl || ''}
                      onChange={(e) => updateFurniture(selectedFurniture.id, { textureUrl: e.target.value })}
                      className="w-full px-2 py-1 bg-white border rounded text-xs mb-2"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                      <span>Texture Scale</span>
                      <span>{(selectedFurniture.textureScale ?? 1).toFixed(1)}x</span>
                    </div>
                    <input 
                      type="range" min="0.1" max="5" step="0.1"
                      value={selectedFurniture.textureScale ?? 1}
                      onChange={(e) => updateFurniture(selectedFurniture.id, { textureScale: parseFloat(e.target.value) })}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="mb-3 border-t border-slate-200 pt-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                      <span>Roughness</span>
                      <span>{(selectedFurniture.roughness ?? 0).toFixed(2)}</span>
                    </div>
                    <input 
                      type="range" min="0" max="1" step="0.05"
                      value={selectedFurniture.roughness ?? 0.5} 
                      onChange={(e) => updateFurniture(selectedFurniture.id, { roughness: parseFloat(e.target.value) })}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                      <span>Metalness</span>
                      <span>{(selectedFurniture.metalness ?? 0).toFixed(2)}</span>
                    </div>
                    <input 
                      type="range" min="0" max="1" step="0.05"
                      value={selectedFurniture.metalness ?? 0}
                      onChange={(e) => updateFurniture(selectedFurniture.id, { metalness: parseFloat(e.target.value) })}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  
                  {selectedFurniture.type === FurnitureType.LIGHT && (
                     <div className="pt-2 border-t border-slate-200 mt-2">
                        <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                          <span className="flex items-center gap-1"><Lightbulb className="w-3 h-3 text-amber-500"/> Intensity</span>
                          <span>{(selectedFurniture.lightIntensity ?? 1.5).toFixed(1)}</span>
                        </div>
                        <input 
                          type="range" min="0" max="10" step="0.1"
                          value={selectedFurniture.lightIntensity ?? 1.5}
                          onChange={(e) => updateFurniture(selectedFurniture.id, { lightIntensity: parseFloat(e.target.value) })}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                     </div>
                  )}
                  {selectedFurniture.type !== FurnitureType.LIGHT && (
                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                        <span>Glow</span>
                        <span>{(selectedFurniture.emissivity ?? 0).toFixed(1)}</span>
                      </div>
                      <input 
                        type="range" min="0" max="2" step="0.1"
                        value={selectedFurniture.emissivity ?? 0}
                        onChange={(e) => updateFurniture(selectedFurniture.id, { emissivity: parseFloat(e.target.value) })}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Scene & Catalog */}
        {!selectedWall && !selectedFurniture && (
          <div className="space-y-4">
             {/* Scene Settings */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
               <h3 className="text-xs font-bold text-slate-700 uppercase mb-3 flex items-center gap-2">
                  <Sun className="w-3 h-3 text-orange-500" /> Scene Lighting & View
               </h3>
               
               <div className="space-y-3">
                 <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Environment (Sun)</span>
                      <span>{(state.scene.sunIntensity).toFixed(1)}</span>
                    </div>
                    <input 
                      type="range" min="0" max="5" step="0.1"
                      value={state.scene.sunIntensity}
                      onChange={(e) => updateScene({ sunIntensity: parseFloat(e.target.value) })}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                 </div>
                 <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Ambient Light</span>
                      <span>{(state.scene.ambientIntensity).toFixed(1)}</span>
                    </div>
                    <input 
                      type="range" min="0" max="2" step="0.1"
                      value={state.scene.ambientIntensity}
                      onChange={(e) => updateScene({ ambientIntensity: parseFloat(e.target.value) })}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                 </div>
                 
                 <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="text-xs font-medium text-slate-600 flex items-center gap-2">
                      <Layers className="w-3 h-3" /> Show Ceiling
                    </span>
                    <input 
                      type="checkbox" 
                      checked={state.scene.showCeiling}
                      onChange={(e) => updateScene({ showCeiling: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600 flex items-center gap-2">
                      <Box className="w-3 h-3" /> Show Floor Plane
                    </span>
                    <input 
                      type="checkbox" 
                      checked={state.scene.showFloor}
                      onChange={(e) => updateScene({ showFloor: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                 </div>
               </div>
            </div>

            {/* Custom Material Creator */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button 
                onClick={() => setIsCreatingMaterial(!isCreatingMaterial)}
                className="w-full p-2 bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 uppercase"
              >
                <span>Material Manager</span>
                <Plus className={`w-4 h-4 transition-transform ${isCreatingMaterial ? 'rotate-45' : ''}`}/>
              </button>
              
              {isCreatingMaterial && (
                <div className="p-3 bg-white space-y-3">
                  <input 
                    type="text" placeholder="Material Name (e.g., Red Metal)" 
                    value={newMatName} onChange={e => setNewMatName(e.target.value)}
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  />
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-slate-500">Texture / Type</label>
                     <select 
                       value={newMatType} 
                       onChange={e => setNewMatType(e.target.value as MaterialType)}
                       className="w-full px-2 py-1.5 border rounded text-xs bg-slate-50"
                     >
                       <option value="MATTE">Matte</option>
                       <option value="GLOSSY">Glossy</option>
                       <option value="WOOD">Wood</option>
                       <option value="METAL">Metal</option>
                       <option value="GLASS">Glass</option>
                       <option value="STONE">Stone</option>
                       <option value="FABRIC">Fabric</option>
                     </select>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs font-medium text-slate-500 w-16">Color</span>
                    <input type="color" value={newMatColor} onChange={e => setNewMatColor(e.target.value)} className="h-8 w-full rounded cursor-pointer"/>
                  </div>
                  
                  <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs text-slate-500"><span>Rough</span><span>{newMatRoughness}</span></div>
                      <input type="range" min="0" max="1" step="0.1" value={newMatRoughness} onChange={e => setNewMatRoughness(parseFloat(e.target.value))} className="w-full h-1"/>
                  </div>
                   <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-500"><span>Metal</span><span>{newMatMetalness}</span></div>
                      <input type="range" min="0" max="1" step="0.1" value={newMatMetalness} onChange={e => setNewMatMetalness(parseFloat(e.target.value))} className="w-full h-1"/>
                    </div>
                  <button onClick={handleSaveMaterial} className="w-full py-1.5 bg-slate-800 text-white text-xs rounded hover:bg-slate-700 flex items-center justify-center gap-2">
                    <Save className="w-3 h-3"/> Save Material
                  </button>
                </div>
              )}
            </div>

            {/* 3D Import Section */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
               <button 
                onClick={() => setIsImporting(!isImporting)}
                className="w-full p-2 bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 uppercase"
              >
                <span>Import 3D Model</span>
                <Upload className="w-4 h-4"/>
              </button>
               {isImporting && (
                <div className="p-3 bg-white space-y-3">
                   <input 
                    type="text" placeholder="Model Name" 
                    value={importName} onChange={e => setImportName(e.target.value)}
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  />
                  <input 
                    type="text" placeholder="URL (e.g., https://...model.glb)" 
                    value={importUrl} onChange={e => setImportUrl(e.target.value)}
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  />
                  <button 
                    onClick={() => { importModel(importUrl, importName); setIsImporting(false); setImportUrl(''); setImportName(''); }}
                    className="w-full py-1.5 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                  >
                    Import & Place
                  </button>
                </div>
              )}
            </div>

            <h3 className="font-semibold text-slate-800 border-b pb-2 flex items-center gap-2 pt-2">
              <Box className="w-4 h-4"/> Furniture Catalog
            </h3>
            
            {/* Category Selector */}
            <div className="relative">
              <Filter className="w-3 h-3 absolute left-2 top-3 text-slate-400" />
              <select 
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full pl-8 pr-2 py-2 bg-slate-50 border rounded-md text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 pb-4">
              {filteredCatalog.map((item) => (
                <button 
                  key={item.name}
                  onClick={() => addFurniture(item)}
                  className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full mb-2 flex items-center justify-center bg-slate-100 group-hover:bg-white text-slate-600">
                    {item.type === FurnitureType.CUSTOM ? <Box className="w-4 h-4"/> : <Plus className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-medium text-slate-600 text-center line-clamp-2">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
