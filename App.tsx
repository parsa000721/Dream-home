
import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectState, ToolMode, Wall, Furniture, CatalogItem, SceneSettings, Dimension, SavedMaterial, FurnitureType, CameraView } from './types';
import { Toolbar } from './components/Toolbar';
import { Toolbox } from './components/tools/Toolbox';
import { ExternalTools } from './components/tools/ExternalTools';
import { PropertyPanel } from './components/PropertyPanel';
import { Canvas2D } from './components/Canvas2D';
import { Viewer3D } from './components/Viewer3D';
import { DEFAULT_CUSTOM_MATERIALS } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<ProjectState>({
    walls: [],
    furniture: [],
    dimensions: [],
    materials: [...DEFAULT_CUSTOM_MATERIALS],
    selectedId: null,
    activeFloor: 0,
    scene: {
      ambientIntensity: 0.7, // Default ambient
      sunIntensity: 1.2,    // Default sun
      sunPosition: [15, 25, 10],
      showCeiling: false,
      showFloor: true
    }
  });
  
  const [floors, setFloors] = useState<number[]>([0]);
  const [mode, setMode] = useState<ToolMode>('SELECT');
  const [view3D, setView3D] = useState(false);
  const [showExternalTools, setShowExternalTools] = useState(false);
  const [cameraView, setCameraView] = useState<CameraView>('PERSPECTIVE');

  const handleWallCreate = useCallback((wall: Wall) => {
    setState(prev => ({ ...prev, walls: [...prev.walls, wall] }));
    setMode('SELECT'); 
  }, []);

  const handleDimensionCreate = useCallback((dim: Dimension) => {
    setState(prev => ({ ...prev, dimensions: [...prev.dimensions, dim] }));
    setMode('SELECT');
  }, []);

  const handleSelect = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedId: id }));
  }, []);

  const updateWall = useCallback((id: string, data: Partial<Wall>) => {
    setState(prev => ({
      ...prev,
      walls: prev.walls.map(w => w.id === id ? { ...w, ...data } : w)
    }));
  }, []);

  const updateFurniture = useCallback((id: string, data: Partial<Furniture>) => {
    setState(prev => ({
      ...prev,
      furniture: prev.furniture.map(f => f.id === id ? { ...f, ...data } : f)
    }));
  }, []);

  const updateScene = useCallback((data: Partial<SceneSettings>) => {
    setState(prev => ({ ...prev, scene: { ...prev.scene, ...data } }));
  }, []);

  const deleteItem = useCallback(() => {
    if (!state.selectedId) return;
    setState(prev => ({
      ...prev,
      walls: prev.walls.filter(w => w.id !== prev.selectedId),
      furniture: prev.furniture.filter(f => f.id !== prev.selectedId),
      dimensions: prev.dimensions.filter(d => d.id !== prev.selectedId),
      selectedId: null
    }));
  }, [state.selectedId]);

  const duplicateItem = useCallback(() => {
    if (!state.selectedId) return;
    const selectedWall = state.walls.find(w => w.id === state.selectedId);
    const selectedFurn = state.furniture.find(f => f.id === state.selectedId);

    if (selectedWall) {
      const newWall = { ...selectedWall, id: uuidv4(), start: { x: selectedWall.start.x + 20, y: selectedWall.start.y + 20 }, end: { x: selectedWall.end.x + 20, y: selectedWall.end.y + 20 } };
      setState(prev => ({ ...prev, walls: [...prev.walls, newWall], selectedId: newWall.id }));
    } else if (selectedFurn) {
      const newFurn = { ...selectedFurn, id: uuidv4(), position: { x: selectedFurn.position.x + 20, y: selectedFurn.position.y + 20 } };
      setState(prev => ({ ...prev, furniture: [...prev.furniture, newFurn], selectedId: newFurn.id }));
    }
  }, [state.walls, state.furniture, state.selectedId]);

  const addFurniture = useCallback((item: CatalogItem) => {
    const newItem: Furniture = {
      id: uuidv4(),
      type: item.type,
      category: item.category,
      name: item.name,
      width: item.width,
      depth: item.depth,
      height: item.height,
      elevation: 0,
      color: item.color,
      material: item.material,
      position: { x: 400, y: 300 },
      rotation: 0,
      floor: state.activeFloor,
      roughness: item.roughness,
      metalness: item.metalness,
      emissivity: 0,
      lightIntensity: 1.5 
    };
    setState(prev => ({ ...prev, furniture: [...prev.furniture, newItem], selectedId: newItem.id }));
    setMode('SELECT');
  }, [state.activeFloor]);

  const handleImportModel = useCallback((url: string, name: string) => {
    const newItem: Furniture = {
      id: uuidv4(),
      type: FurnitureType.CUSTOM,
      category: 'Imported',
      name: name || 'Imported Model',
      width: 1, depth: 1, height: 1,
      elevation: 0,
      color: '#ffffff',
      material: 'MATTE',
      position: { x: 400, y: 300 },
      rotation: 0,
      floor: state.activeFloor,
      modelUrl: url
    };
    setState(prev => ({ ...prev, furniture: [...prev.furniture, newItem], selectedId: newItem.id }));
    setMode('SELECT');
  }, [state.activeFloor]);

  const handleAddMaterial = useCallback((material: SavedMaterial) => {
    setState(prev => ({ ...prev, materials: [...prev.materials, material] }));
  }, []);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "project.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleScreenshot = () => {
    alert("Snapshot captured! (Simulated)");
  };

  const handleAddFloor = () => {
    const newFloor = floors.length;
    setFloors([...floors, newFloor]);
    setState(prev => ({ ...prev, activeFloor: newFloor }));
  };

  const setActiveFloor = (floor: number) => {
    setState(prev => ({ ...prev, activeFloor: floor, selectedId: null }));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100 text-slate-900 font-sans">
      <Toolbar onOpenExternalTools={() => setShowExternalTools(true)} />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Toolbox 
          mode={mode} 
          setMode={setMode} 
          view3D={view3D} 
          setView3D={setView3D} 
          activeFloor={state.activeFloor} 
          setActiveFloor={setActiveFloor} 
          floors={floors} 
          addFloor={handleAddFloor}
          onDuplicate={duplicateItem}
          onDelete={deleteItem}
          onExport={handleExport}
          onScreenshot={handleScreenshot}
          cameraView={cameraView}
          setCameraView={setCameraView}
        />

        <div className="flex-1 relative">
          {view3D ? (
            <Viewer3D 
              state={state} 
              onSelect={handleSelect}
              updateFurniture={updateFurniture}
              updateWall={updateWall}
              cameraView={cameraView}
            />
          ) : (
            <Canvas2D 
              state={state} 
              mode={mode} 
              onWallCreate={handleWallCreate} 
              onDimensionCreate={handleDimensionCreate}
              onSelect={handleSelect}
              onFurnitureUpdate={updateFurniture}
              onWallUpdate={updateWall}
            />
          )}
        </div>

        <PropertyPanel 
          state={state} 
          updateWall={updateWall} 
          updateFurniture={updateFurniture} 
          updateScene={updateScene}
          deleteItem={deleteItem}
          addFurniture={addFurniture}
          addMaterial={handleAddMaterial}
          importModel={handleImportModel}
        />
      </div>

      <ExternalTools isOpen={showExternalTools} onClose={() => setShowExternalTools(false)} />
    </div>
  );
};

export default App;
