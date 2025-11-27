
import React, { useRef, useState } from 'react';
import { ProjectState, ToolMode, Vector2, Wall, FurnitureType, Furniture, Dimension } from '../types';
import { GRID_SIZE } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import { Compass } from 'lucide-react';

interface Canvas2DProps {
  state: ProjectState;
  mode: ToolMode;
  onWallCreate: (wall: Wall) => void;
  onDimensionCreate: (dim: Dimension) => void;
  onSelect: (id: string | null) => void;
  onFurnitureUpdate: (id: string, data: Partial<Furniture>) => void;
  onWallUpdate: (id: string, data: Partial<Wall>) => void;
}

const PPM = 50; // Pixels Per Meter scale used in rendering

// Helper to rotate a point around (0,0)
const rotatePoint = (point: Vector2, angle: number): Vector2 => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos
  };
};

export const Canvas2D: React.FC<Canvas2DProps> = ({ 
  state, mode, onWallCreate, onDimensionCreate, onSelect, onFurnitureUpdate, onWallUpdate 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Interaction State
  const [drawingStart, setDrawingStart] = useState<Vector2 | null>(null);
  const [mousePos, setMousePos] = useState<Vector2>({ x: 0, y: 0 });
  
  const [interaction, setInteraction] = useState<{
    type: 'MOVE' | 'RESIZE' | 'WALL_ENDPOINT' | 'WALL_MOVE';
    itemId: string;
    handle?: 'TL' | 'TR' | 'BL' | 'BR' | 'N' | 'S' | 'E' | 'W' | 'START' | 'END';
    offset?: Vector2;
    fixedPoint?: Vector2;
    startPoint?: Vector2;
    endPoint?: Vector2;
  } | null>(null);

  const visibleWalls = state.walls.filter(w => w.floor === state.activeFloor);
  const visibleDimensions = state.dimensions.filter(d => d.floor === state.activeFloor);
  
  const visibleFurniture = state.furniture
    .filter(f => f.floor === state.activeFloor)
    .sort((a, b) => {
      const getOrder = (type: FurnitureType) => {
        if (type === FurnitureType.FOUNDATION) return 0;
        if (type === FurnitureType.RUG) return 1;
        return 2;
      };
      return getOrder(a.type) - getOrder(b.type);
    });

  const getCoords = (e: React.MouseEvent | MouseEvent): Vector2 => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const CTM = svgRef.current.getScreenCTM();
    if (!CTM) return { x: 0, y: 0 };
    const x = (e.clientX - CTM.e) / CTM.a;
    const y = (e.clientY - CTM.f) / CTM.d;
    const snap = 10;
    return {
      x: Math.round(x / snap) * snap,
      y: Math.round(y / snap) * snap
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getCoords(e);
    
    // Background click
    if (e.target === svgRef.current) {
      if (mode === 'DRAW_WALL' || mode === 'MEASURE') {
        setDrawingStart(coords);
      } else if (mode === 'SELECT') {
        onSelect(null);
      }
    }
  };

  // --- Furniture Interactions ---
  const startResize = (e: React.MouseEvent, handle: 'TL' | 'TR' | 'BL' | 'BR' | 'N' | 'S' | 'E' | 'W', item: Furniture) => {
    e.stopPropagation();
    e.preventDefault();
    if (mode !== 'SELECT') return;

    const w = item.width * PPM;
    const d = item.depth * PPM;
    
    let localAnchor: Vector2 = { x: 0, y: 0 };
    switch (handle) {
      case 'TL': localAnchor = { x: w/2, y: d/2 }; break;
      case 'TR': localAnchor = { x: -w/2, y: d/2 }; break;
      case 'BL': localAnchor = { x: w/2, y: -d/2 }; break;
      case 'BR': localAnchor = { x: -w/2, y: -d/2 }; break;
      case 'N':  localAnchor = { x: 0, y: d/2 }; break;
      case 'S':  localAnchor = { x: 0, y: -d/2 }; break;
      case 'W':  localAnchor = { x: w/2, y: 0 }; break;
      case 'E':  localAnchor = { x: -w/2, y: 0 }; break;
    }
    
    const rotatedAnchor = rotatePoint(localAnchor, item.rotation);
    const fixedPoint = {
      x: item.position.x + rotatedAnchor.x,
      y: item.position.y + rotatedAnchor.y
    };

    setInteraction({ type: 'RESIZE', itemId: item.id, handle, fixedPoint });
  };

  const startMove = (e: React.MouseEvent, item: Furniture) => {
    e.stopPropagation();
    if (mode !== 'SELECT') return;
    onSelect(item.id);
    const coords = getCoords(e);
    setInteraction({
      type: 'MOVE',
      itemId: item.id,
      offset: { x: item.position.x - coords.x, y: item.position.y - coords.y }
    });
  };

  // --- Wall Interactions ---
  const startWallMove = (e: React.MouseEvent, wall: Wall) => {
    e.stopPropagation();
    if (mode !== 'SELECT') return;
    onSelect(wall.id);
    const coords = getCoords(e);
    setInteraction({
      type: 'WALL_MOVE',
      itemId: wall.id,
      offset: { x: coords.x, y: coords.y },
      startPoint: { ...wall.start },
      endPoint: { ...wall.end }
    });
  };

  const startWallResize = (e: React.MouseEvent, handle: 'START' | 'END', wall: Wall) => {
    e.stopPropagation();
    if (mode !== 'SELECT') return;
    setInteraction({ type: 'WALL_ENDPOINT', itemId: wall.id, handle });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const coords = getCoords(e);
    setMousePos(coords);

    if (!interaction) return;

    if (interaction.type === 'MOVE' && interaction.offset) {
      onFurnitureUpdate(interaction.itemId, {
        position: { x: coords.x + interaction.offset.x, y: coords.y + interaction.offset.y }
      });
    } else if (interaction.type === 'RESIZE' && interaction.fixedPoint && interaction.handle) {
      const item = state.furniture.find(f => f.id === interaction.itemId);
      if (!item) return;

      const vector = { x: coords.x - interaction.fixedPoint.x, y: coords.y - interaction.fixedPoint.y };
      let localVector = rotatePoint(vector, -item.rotation);

      if (interaction.handle === 'N' || interaction.handle === 'S') localVector.x = 0; 
      if (interaction.handle === 'E' || interaction.handle === 'W') localVector.y = 0;

      let newWidthPixels = item.width * PPM;
      let newDepthPixels = item.depth * PPM;

      if (['TL', 'TR', 'BL', 'BR', 'E', 'W'].includes(interaction.handle)) {
        newWidthPixels = Math.abs(localVector.x);
      }
      if (['TL', 'TR', 'BL', 'BR', 'N', 'S'].includes(interaction.handle)) {
        newDepthPixels = Math.abs(localVector.y);
      }
      
      const minSize = 0.2 * PPM;
      if (newWidthPixels < minSize) newWidthPixels = minSize;
      if (newDepthPixels < minSize) newDepthPixels = minSize;

      const constrainedVectorGlobal = rotatePoint(localVector, item.rotation);
      const newCenter = {
        x: interaction.fixedPoint.x + constrainedVectorGlobal.x / 2, 
        y: interaction.fixedPoint.y + constrainedVectorGlobal.y / 2
      };
      
      onFurnitureUpdate(interaction.itemId, {
        position: newCenter,
        width: newWidthPixels / PPM,
        depth: newDepthPixels / PPM
      });
    } else if (interaction.type === 'WALL_ENDPOINT') {
      const wall = state.walls.find(w => w.id === interaction.itemId);
      if (wall && interaction.handle) {
        if (interaction.handle === 'START') onWallUpdate(wall.id, { start: coords });
        else onWallUpdate(wall.id, { end: coords });
      }
    } else if (interaction.type === 'WALL_MOVE' && interaction.offset && interaction.startPoint && interaction.endPoint) {
      const dx = coords.x - interaction.offset.x;
      const dy = coords.y - interaction.offset.y;
      onWallUpdate(interaction.itemId, {
        start: { x: interaction.startPoint.x + dx, y: interaction.startPoint.y + dy },
        end: { x: interaction.endPoint.x + dx, y: interaction.endPoint.y + dy }
      });
    }
  };

  const handleMouseUp = () => {
    if (drawingStart) {
      const dist = Math.hypot(mousePos.x - drawingStart.x, mousePos.y - drawingStart.y);
      if (dist > 10) {
         if (mode === 'DRAW_WALL') {
          onWallCreate({
            id: uuidv4(),
            start: drawingStart,
            end: mousePos,
            thickness: 0.2, 
            height: 2.5, 
            elevation: 0,
            color: '#e2e8f0',
            floor: state.activeFloor,
            material: 'MATTE',
            roughness: 0.8, metalness: 0.0, emissivity: 0.0
          });
        } else if (mode === 'MEASURE') {
           const distMeters = dist / PPM;
           onDimensionCreate({
             id: uuidv4(),
             start: drawingStart,
             end: mousePos,
             value: distMeters,
             floor: state.activeFloor
           });
        }
      }
      setDrawingStart(null);
    }
    setInteraction(null);
  };

  const selectWall = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (mode === 'SELECT') onSelect(id);
  };

  return (
    <div className="flex-1 bg-slate-50 relative overflow-hidden cursor-crosshair h-full">
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ 
             backgroundImage: `linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)`,
             backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
           }} 
      />

      {/* Compass Widget */}
      <div className="absolute top-4 right-4 pointer-events-none opacity-50 flex flex-col items-center">
         <Compass className="w-10 h-10 text-slate-800" />
         <span className="text-[10px] font-bold text-slate-800 mt-1">N</span>
      </div>

      <svg 
        ref={svgRef}
        className="w-full h-full touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Render Foundations First */}
        {visibleFurniture.map(item => {
          const w = item.width * PPM;
          const d = item.depth * PPM;
          const isSelected = state.selectedId === item.id;

          return (
            <g 
              key={item.id} 
              transform={`translate(${item.position.x}, ${item.position.y}) rotate(${item.rotation * 180 / Math.PI})`}
              onMouseDown={(e) => startMove(e, item)}
              className={mode === 'SELECT' ? "cursor-move" : ""}
            >
              {/* Simple Shape Rendering Logic */}
              {item.type === FurnitureType.DOOR ? (
                 <g><rect x={-w/2} y={-5} width={w} height={10} fill="#94a3b8" /><path d={`M ${-w/2} 0 Q ${-w/2} -${w} ${w/2} 0`} fill="none" stroke="#475569" strokeDasharray="4,4" /></g>
              ) : item.type === FurnitureType.FOUNDATION ? (
                <rect x={-w/2} y={-d/2} width={w} height={d} fill={item.color} stroke="#94a3b8" strokeDasharray="2,2" opacity="0.6"/>
              ) : (
                <rect x={-w/2} y={-d/2} width={w} height={d} fill={item.color} stroke={isSelected ? '#4f46e5' : '#334155'} strokeWidth={isSelected ? 2 : 1} rx="4" opacity="0.8"/>
              )}
              
              {/* Resize Handles */}
              {isSelected && mode === 'SELECT' && (
                <g>
                  <rect x={-w/2 - 4} y={-d/2 - 4} width={8} height={8} fill="white" stroke="#4f46e5" onMouseDown={(e) => startResize(e, 'TL', item)} />
                  <rect x={w/2 - 4} y={d/2 - 4} width={8} height={8} fill="white" stroke="#4f46e5" onMouseDown={(e) => startResize(e, 'BR', item)} />
                  <rect x={w/2 - 4} y={-d/2 - 4} width={8} height={8} fill="white" stroke="#4f46e5" onMouseDown={(e) => startResize(e, 'TR', item)} />
                  <rect x={-w/2 - 4} y={d/2 - 4} width={8} height={8} fill="white" stroke="#4f46e5" onMouseDown={(e) => startResize(e, 'BL', item)} />
                  {/* Side Handles */}
                  <rect x={-4} y={-d/2 - 4} width={8} height={8} fill="white" stroke="#4f46e5" onMouseDown={(e) => startResize(e, 'N', item)} />
                  <rect x={-4} y={d/2 - 4} width={8} height={8} fill="white" stroke="#4f46e5" onMouseDown={(e) => startResize(e, 'S', item)} />
                  <rect x={w/2 - 4} y={-4} width={8} height={8} fill="white" stroke="#4f46e5" onMouseDown={(e) => startResize(e, 'W', item)} />
                  <rect x={-w/2 - 4} y={-4} width={8} height={8} fill="white" stroke="#4f46e5" onMouseDown={(e) => startResize(e, 'E', item)} />
                </g>
              )}
            </g>
          );
        })}

        {visibleWalls.map(wall => {
          const isSelected = state.selectedId === wall.id;
          return (
            <g key={wall.id}>
              <g onMouseDown={(e) => isSelected ? startWallMove(e, wall) : selectWall(e, wall.id)} className={mode === 'SELECT' ? "cursor-move" : ""}>
                <line x1={wall.start.x} y1={wall.start.y} x2={wall.end.x} y2={wall.end.y} stroke="transparent" strokeWidth="20" />
                <line x1={wall.start.x} y1={wall.start.y} x2={wall.end.x} y2={wall.end.y} stroke={isSelected ? '#4f46e5' : '#475569'} strokeWidth="6" strokeLinecap="round"/>
                <line x1={wall.start.x} y1={wall.start.y} x2={wall.end.x} y2={wall.end.y} stroke={isSelected ? '#818cf8' : '#cbd5e1'} strokeWidth="2" strokeLinecap="round"/>
              </g>
              {isSelected && mode === 'SELECT' && (
                <g>
                  <circle cx={wall.start.x} cy={wall.start.y} r={6} fill="white" stroke="#4f46e5" className="cursor-move" onMouseDown={(e) => startWallResize(e, 'START', wall)}/>
                  <circle cx={wall.end.x} cy={wall.end.y} r={6} fill="white" stroke="#4f46e5" className="cursor-move" onMouseDown={(e) => startWallResize(e, 'END', wall)}/>
                </g>
              )}
            </g>
          );
        })}

        {visibleDimensions.map(dim => (
          <g key={dim.id} pointerEvents="none">
             <line x1={dim.start.x} y1={dim.start.y} x2={dim.end.x} y2={dim.end.y} stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow)" />
             <text 
               x={(dim.start.x + dim.end.x)/2} 
               y={(dim.start.y + dim.end.y)/2 - 10} 
               textAnchor="middle" 
               fill="#f59e0b" 
               fontSize="12" 
               fontWeight="bold"
               className="bg-white"
             >
               {dim.value.toFixed(2)}m
             </text>
          </g>
        ))}

        {drawingStart && (
          <g>
            <line x1={drawingStart.x} y1={drawingStart.y} x2={mousePos.x} y2={mousePos.y} stroke={mode === 'MEASURE' ? "#f59e0b" : "#6366f1"} strokeWidth="4" strokeDasharray="5,5" opacity="0.7"/>
            {mode === 'MEASURE' && (
              <text x={mousePos.x + 10} y={mousePos.y} fill="#f59e0b" fontSize="12">
                 {(Math.hypot(mousePos.x - drawingStart.x, mousePos.y - drawingStart.y) / PPM).toFixed(2)}m
              </text>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
