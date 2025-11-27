
import React from 'react';
import { 
  MousePointer2, PenTool, Ruler, Compass, Layers, 
  Copy, Trash2, Camera, Download, Eye, Grid, Box 
} from 'lucide-react';
import { ToolMode, CameraView } from '../../types';

interface ToolboxProps {
  mode: ToolMode;
  setMode: (mode: ToolMode) => void;
  view3D: boolean;
  setView3D: (v: boolean) => void;
  activeFloor: number;
  setActiveFloor: (floor: number) => void;
  floors: number[];
  addFloor: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onExport: () => void;
  onScreenshot: () => void;
  cameraView?: CameraView;
  setCameraView?: (view: CameraView) => void;
}

export const Toolbox: React.FC<ToolboxProps> = ({
  mode, setMode, view3D, setView3D,
  activeFloor, setActiveFloor, floors, addFloor,
  onDuplicate, onDelete, onExport, onScreenshot,
  cameraView, setCameraView
}) => {
  
  const ToolButton = ({ 
    active, 
    onClick, 
    icon: Icon, 
    label 
  }: { active?: boolean; onClick: () => void; icon: any; label: string }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all w-full mb-2 ${
        active 
          ? 'bg-indigo-600 text-white shadow-md' 
          : 'text-slate-500 hover:bg-slate-200 hover:text-slate-900'
      }`}
      title={label}
    >
      <Icon className="w-5 h-5 mb-1" />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  const ViewButton = ({ view, label }: { view: CameraView, label: string }) => (
    <button
      onClick={() => setCameraView?.(view)}
      className={`text-[9px] font-bold px-1 py-1 rounded w-full border mb-1 ${
        cameraView === view 
          ? 'bg-indigo-100 text-indigo-700 border-indigo-300' 
          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-20 bg-slate-50 border-r border-slate-200 flex flex-col items-center py-4 overflow-y-auto h-full z-10 custom-scrollbar">
      
      {/* Structural Tools - Only in 2D */}
      {!view3D && (
        <div className="w-full px-2 mb-4 border-b border-slate-200 pb-2">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 text-center">Structure</h4>
          <ToolButton 
            active={mode === 'SELECT'} 
            onClick={() => setMode('SELECT')} 
            icon={MousePointer2} 
            label="Select" 
          />
          <ToolButton 
            active={mode === 'DRAW_WALL'} 
            onClick={() => setMode('DRAW_WALL')} 
            icon={PenTool} 
            label="Wall" 
          />
          <ToolButton 
            active={mode === 'MEASURE'} 
            onClick={() => setMode('MEASURE')} 
            icon={Ruler} 
            label="Measure" 
          />
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-100 mb-2 w-full">
            <Layers className="w-4 h-4 text-slate-500 mb-1" />
            <select 
              value={activeFloor}
              onChange={(e) => setActiveFloor(Number(e.target.value))}
              className="w-full text-[10px] bg-transparent text-center focus:outline-none cursor-pointer"
            >
              {floors.map(f => (
                <option key={f} value={f}>Lvl {f + 1}</option>
              ))}
            </select>
            <button onClick={addFloor} className="text-[10px] text-indigo-600 font-bold mt-1 hover:underline">+ Add</button>
          </div>
        </div>
      )}

      {/* Editing Tools */}
      <div className="w-full px-2 mb-4 border-b border-slate-200 pb-2">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 text-center">Edit</h4>
        <ToolButton onClick={onDuplicate} icon={Copy} label="Clone" />
        <ToolButton onClick={onDelete} icon={Trash2} label="Delete" />
      </div>

      {/* View Tools */}
      <div className="w-full px-2 mb-4 border-b border-slate-200 pb-2">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 text-center">View</h4>
        <ToolButton 
          active={!view3D} 
          onClick={() => setView3D(false)} 
          icon={Grid} 
          label="2D Plan" 
        />
        <ToolButton 
          active={view3D} 
          onClick={() => setView3D(true)} 
          icon={Eye} 
          label="3D View" 
        />
        
        {view3D && setCameraView && (
          <div className="mt-2 w-full p-2 bg-slate-100 rounded-lg">
             <div className="flex items-center gap-1 justify-center mb-2 text-slate-500">
               <Box className="w-3 h-3" />
               <span className="text-[9px] font-bold uppercase">Elevation</span>
             </div>
             <ViewButton view="PERSPECTIVE" label="ISO" />
             <ViewButton view="TOP" label="TOP" />
             <ViewButton view="FRONT" label="FRONT" />
             <ViewButton view="RIGHT" label="RIGHT" />
             <ViewButton view="BACK" label="BACK" />
             <ViewButton view="LEFT" label="LEFT" />
          </div>
        )}

        {!view3D && (
           <div className="flex justify-center w-full mt-2">
              <Compass className="w-8 h-8 text-slate-300" />
          </div>
        )}
      </div>

      {/* Output Tools */}
      <div className="w-full px-2">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 text-center">Output</h4>
        <ToolButton onClick={onScreenshot} icon={Camera} label="Render" />
        <ToolButton onClick={onExport} icon={Download} label="Export" />
      </div>

    </div>
  );
};
