import React, { useMemo, useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Grid, Gltf, TransformControls, useTexture, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { ProjectState, Wall, Furniture, FurnitureType, MaterialType, CameraView } from '../types';
import { WALL_HEIGHT_DEFAULT, FLOOR_THICKNESS } from '../constants';

interface Viewer3DProps {
  state: ProjectState;
  onSelect?: (id: string | null) => void;
  updateFurniture?: (id: string, data: Partial<Furniture>) => void;
  updateWall?: (id: string, data: Partial<Wall>) => void;
  cameraView?: CameraView;
}

const SCALE_FACTOR = 0.02;

// Camera Controller Component for Elevation Views
const CameraController = ({ view, bounds }: { view: CameraView, bounds: any }) => {
  const { camera, gl } = useThree();
  const controls = useRef<any>(null);

  useEffect(() => {
    if (!controls.current) return;
    
    // Calculate center and reasonable distance
    const center = new THREE.Vector3(bounds.cx, bounds.cy, bounds.cz);
    const maxDim = Math.max(bounds.width, bounds.depth, 10);
    const dist = maxDim * 1.2;

    let pos = new THREE.Vector3();

    switch (view) {
      case 'TOP':
        pos.set(bounds.cx, dist, bounds.cz);
        break;
      case 'FRONT':
        pos.set(bounds.cx, bounds.cy, bounds.cz + dist);
        break;
      case 'RIGHT':
        pos.set(bounds.cx + dist, bounds.cy, bounds.cz);
        break;
      case 'BACK':
        pos.set(bounds.cx, bounds.cy, bounds.cz - dist);
        break;
      case 'LEFT':
        pos.set(bounds.cx - dist, bounds.cy, bounds.cz);
        break;
      case 'PERSPECTIVE':
      default:
        // Standard ISO View
        pos.set(bounds.cx + dist * 0.6, dist * 0.6, bounds.cz + dist * 0.6);
        break;
    }

    // Update Camera
    camera.position.copy(pos);
    camera.lookAt(center);
    
    // Update Controls Target
    controls.current.target.copy(center);
    controls.current.update();

  }, [view, bounds, camera]);

  return <OrbitControls ref={controls} makeDefault minPolarAngle={0} maxPolarAngle={Math.PI} />;
};

// Get base props, then allow overrides
const getMaterialProps = (type: MaterialType, color: string, overrides: Partial<Furniture> | Partial<Wall>) => {
  const base = { color, side: THREE.FrontSide, envMapIntensity: 1.0 };
  
  // Base physical properties based on preset
  let props: any = { ...base, metalness: 0, roughness: 0.8 };

  switch (type) {
    case 'GLASS': props = { ...base, opacity: 0.3, transparent: true, metalness: 0.1, roughness: 0.05, transmission: 0.95, thickness: 0.5, ior: 1.5, clearcoat: 1.0, side: THREE.DoubleSide }; break;
    case 'METAL': props = { ...base, metalness: 0.8, roughness: 0.2 }; break;
    case 'WOOD': props = { ...base, metalness: 0.0, roughness: 0.8 }; break;
    case 'GLOSSY': props = { ...base, metalness: 0.1, roughness: 0.1, clearcoat: 0.5 }; break;
    case 'FABRIC': props = { ...base, metalness: 0, roughness: 0.9, sheen: 0.5 }; break;
    case 'STONE': props = { ...base, metalness: 0.1, roughness: 0.9 }; break;
    case 'GRASS': props = { ...base, metalness: 0, roughness: 1.0 }; break;
    case 'MATTE':
    default: props = { ...base, metalness: 0, roughness: 0.9 }; break;
  }

  // Apply manual overrides if they exist
  if (overrides.roughness !== undefined) props.roughness = overrides.roughness;
  if (overrides.metalness !== undefined) props.metalness = overrides.metalness;
  if (overrides.emissivity !== undefined && overrides.emissivity > 0) {
    props.emissive = color;
    props.emissiveIntensity = overrides.emissivity;
  }

  return props;
};

// Component to handle texture loading conditionally
const SmartMaterial = ({ 
  textureUrl, 
  textureScale = 1, 
  dimensions, 
  materialProps 
}: { 
  textureUrl?: string, 
  textureScale?: number, 
  dimensions: { u: number, v: number }, 
  materialProps: any 
}) => {
  if (!textureUrl) {
    return <meshPhysicalMaterial {...materialProps} />;
  }
  
  return (
    <TexturedMaterial 
      url={textureUrl} 
      scale={textureScale} 
      dimensions={dimensions} 
      materialProps={materialProps} 
    />
  );
};

const TexturedMaterial = ({ url, scale, dimensions, materialProps }: { url: string, scale: number, dimensions: {u: number, v: number}, materialProps: any }) => {
  const texture = useTexture(url);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(dimensions.u * scale, dimensions.v * scale);
  
  return <meshPhysicalMaterial map={texture} {...materialProps} />;
};

const Wall3D: React.FC<{ 
  wall: Wall; 
  isSelected: boolean; 
  onSelect?: (id: string | null) => void; 
  updateWall?: (id: string, data: Partial<Wall>) => void;
}> = ({ wall, isSelected, onSelect, updateWall }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const { length, angle, centerX, centerY, bottomY } = useMemo(() => {
    const dx = wall.end.x - wall.start.x;
    const dy = wall.end.y - wall.start.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ang = Math.atan2(dy, dx);
    // Base floor height + elevation
    const baseY = wall.floor * (WALL_HEIGHT_DEFAULT + FLOOR_THICKNESS) + (wall.elevation || 0);
    return {
      length: len * SCALE_FACTOR,
      angle: -ang,
      centerX: (wall.start.x + wall.end.x) / 2 * SCALE_FACTOR,
      centerY: (wall.start.y + wall.end.y) / 2 * SCALE_FACTOR,
      bottomY: baseY
    };
  }, [wall]);

  const handleTransformEnd = () => {
    if (groupRef.current && updateWall) {
      const scale = groupRef.current.scale;
      
      const newLength = length * Math.abs(scale.x);
      const newHeight = wall.height * Math.abs(scale.y);
      const newThickness = wall.thickness * Math.abs(scale.z);

      const halfLen = newLength / 2 / SCALE_FACTOR;
      const cos = Math.cos(-angle);
      const sin = Math.sin(-angle);
      const cx = (wall.start.x + wall.end.x) / 2;
      const cy = (wall.start.y + wall.end.y) / 2;

      const newStart = {
        x: cx - halfLen * cos,
        y: cy - halfLen * sin
      };
      const newEnd = {
        x: cx + halfLen * cos,
        y: cy + halfLen * sin
      };

      updateWall(wall.id, {
        height: newHeight,
        thickness: newThickness,
        start: newStart,
        end: newEnd
      });
      groupRef.current.scale.set(1, 1, 1);
    }
  };

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.scale.set(1, 1, 1);
    }
  }, [wall.start, wall.end, wall.height, wall.thickness]);

  const matProps = getMaterialProps(wall.material || 'MATTE', wall.color, wall);

  return (
    <>
      <group 
        ref={groupRef}
        position={[centerX, bottomY + wall.height / 2, centerY]} 
        rotation={[0, angle, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(wall.id);
        }}
      >
        <mesh receiveShadow castShadow>
          <boxGeometry args={[length, wall.height, wall.thickness]} />
          <Suspense fallback={<meshPhysicalMaterial {...matProps} />}>
            <SmartMaterial 
              textureUrl={wall.textureUrl} 
              textureScale={wall.textureScale}
              dimensions={{ u: length, v: wall.height }}
              materialProps={matProps}
            />
          </Suspense>
        </mesh>
        
        {isSelected && (
           <mesh position={[0, -wall.height/2 - 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[length + 0.2, wall.thickness + 0.2]} />
            <meshBasicMaterial color="#4f46e5" opacity={0.4} transparent side={THREE.DoubleSide}/>
          </mesh>
        )}
      </group>
      
      {isSelected && updateWall && (
        <TransformControls 
          object={groupRef}
          mode="scale"
          onMouseUp={handleTransformEnd}
          size={0.6}
          space="local"
        />
      )}
    </>
  );
};

const FurnitureItem: React.FC<{ 
  item: Furniture; 
  isSelected: boolean; 
  onSelect?: (id: string | null) => void;
  updateFurniture?: (id: string, data: Partial<Furniture>) => void; 
}> = ({ item, isSelected, onSelect, updateFurniture }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Calculate base Y position
  let floorY = item.floor * (WALL_HEIGHT_DEFAULT + FLOOR_THICKNESS);
  // Add item elevation
  if (item.elevation) {
    floorY += item.elevation;
  }
  // Foundations sit under the level objects
  if (item.type === FurnitureType.FOUNDATION) {
      floorY -= item.height; 
  }

  // Generate material props with overrides
  const matProps = getMaterialProps(item.material, item.color, item);
  
  const position: [number, number, number] = [
    item.position.x * SCALE_FACTOR, 
    floorY, 
    item.position.y * SCALE_FACTOR
  ];

  const handleTransformEnd = () => {
    if (groupRef.current && updateFurniture) {
      const scale = groupRef.current.scale;
      // Calculate new dimensions
      const newWidth = item.width * Math.abs(scale.x);
      const newHeight = item.height * Math.abs(scale.y);
      const newDepth = item.depth * Math.abs(scale.z);

      updateFurniture(item.id, {
        width: newWidth,
        height: newHeight,
        depth: newDepth
      });
      groupRef.current.scale.set(1, 1, 1);
    }
  };

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.scale.set(1, 1, 1);
    }
  }, [item.width, item.height, item.depth]);

  // Geometry rendering logic
  const renderGeometry = () => {
    if (item.modelUrl) {
      return (
        <Gltf 
          src={item.modelUrl} 
          scale={[item.width, item.height, item.depth]} // Rough scaling for external models
          castShadow 
          receiveShadow
        />
      );
    }

    if (item.type === FurnitureType.ROOF) {
        if (item.name.includes('Gable')) {
            const shape = new THREE.Shape();
            shape.moveTo(0, 0);
            shape.lineTo(item.width, 0);
            shape.lineTo(item.width / 2, item.height);
            shape.lineTo(0, 0);
            return (
                <group position={[-item.width/2, 0, -item.depth/2]}>
                     <mesh rotation={[0, 0, 0]} castShadow receiveShadow>
                        <extrudeGeometry args={[shape, { depth: item.depth, bevelEnabled: false }]} />
                        <Suspense fallback={<meshPhysicalMaterial {...matProps} />}>
                          <SmartMaterial 
                            textureUrl={item.textureUrl} 
                            textureScale={item.textureScale}
                            dimensions={{ u: item.width, v: item.depth }} // Approx mapping
                            materialProps={matProps}
                          />
                        </Suspense>
                    </mesh>
                </group>
            );
        }
        if (item.name.includes('Pyramid')) {
             // Rotate cylinder 45 deg to make square base
             const radius = item.width / Math.sqrt(2); 
             return (
                 <mesh position={[0, item.height/2, 0]} rotation={[0, Math.PI/4, 0]} castShadow receiveShadow>
                     <cylinderGeometry args={[0, radius, item.height, 4, 1]} />
                     <Suspense fallback={<meshPhysicalMaterial {...matProps} />}>
                        <SmartMaterial 
                          textureUrl={item.textureUrl} 
                          textureScale={item.textureScale}
                          dimensions={{ u: item.width, v: item.height }}
                          materialProps={matProps}
                        />
                     </Suspense>
                 </mesh>
             )
        }
        if (item.name.includes('Shed')) {
             const shape = new THREE.Shape();
             shape.moveTo(0, 0);
             shape.lineTo(item.width, 0);
             shape.lineTo(item.width, item.height * 0.3); // Low side
             shape.lineTo(0, item.height); // High side
             shape.lineTo(0, 0);
             return (
                 <group position={[-item.width/2, 0, -item.depth/2]}>
                    <mesh castShadow receiveShadow>
                        <extrudeGeometry args={[shape, { depth: item.depth, bevelEnabled: false }]} />
                        <Suspense fallback={<meshPhysicalMaterial {...matProps} />}>
                          <SmartMaterial 
                            textureUrl={item.textureUrl} 
                            textureScale={item.textureScale}
                            dimensions={{ u: item.width, v: item.depth }}
                            materialProps={matProps}
                          />
                        </Suspense>
                    </mesh>
                </group>
             )
        }
        if (item.name.includes('Gambrel')) {
            const shape = new THREE.Shape();
            const w = item.width;
            const h = item.height;
            shape.moveTo(0, 0);
            shape.lineTo(w, 0);
            shape.lineTo(w, h * 0.5);
            shape.lineTo(w * 0.8, h);
            shape.lineTo(w * 0.2, h);
            shape.lineTo(0, h * 0.5);
            shape.lineTo(0, 0);
            return (
                <group position={[-w/2, 0, -item.depth/2]}>
                    <mesh castShadow receiveShadow>
                        <extrudeGeometry args={[shape, { depth: item.depth, bevelEnabled: false }]} />
                        <Suspense fallback={<meshPhysicalMaterial {...matProps} />}>
                          <SmartMaterial 
                            textureUrl={item.textureUrl} 
                            textureScale={item.textureScale}
                            dimensions={{ u: item.width, v: item.depth }}
                            materialProps={matProps}
                          />
                        </Suspense>
                    </mesh>
                </group>
            )
        }
        // Flat Roof default
        return (
             <mesh position={[0, item.height/2, 0]} castShadow receiveShadow>
                <boxGeometry args={[item.width, item.height, item.depth]} />
                <Suspense fallback={<meshPhysicalMaterial {...matProps} />}>
                  <SmartMaterial 
                    textureUrl={item.textureUrl} 
                    textureScale={item.textureScale}
                    dimensions={{ u: item.width, v: item.depth }}
                    materialProps={matProps}
                  />
                </Suspense>
             </mesh>
        )
    }

    if (item.type === FurnitureType.STAIRS) {
        const steps = 12;
        const stepHeight = item.height / steps;
        const stepDepth = item.depth / steps;
        
        return (
            <group position={[0, stepHeight/2, 0]}>
                {Array.from({length: steps}).map((_, i) => (
                    <mesh 
                        key={i} 
                        position={[0, i * stepHeight, (i * stepDepth) - (item.depth/2) + (stepDepth/2)]} 
                        receiveShadow castShadow
                    >
                        <boxGeometry args={[item.width, stepHeight, stepDepth]} />
                        <meshPhysicalMaterial {...matProps} />
                    </mesh>
                ))}
            </group>
        );
    }

    if (item.type === FurnitureType.RAILING) {
      const posts = Math.max(2, Math.floor(item.width / 0.5)); // 1 post every 0.5m
      const postWidth = 0.05;
      const barHeight = 0.05;
      
      return (
        <group position={[0, item.height/2, 0]}>
           {/* Top Bar */}
           <mesh position={[0, item.height/2 - barHeight/2, 0]} castShadow>
              <boxGeometry args={[item.width, barHeight, 0.1]} />
              <meshPhysicalMaterial {...matProps} />
           </mesh>
           {/* Posts */}
           {Array.from({length: posts + 1}).map((_, i) => {
             const x = (i * (item.width / posts)) - item.width/2;
             return (
               <mesh key={i} position={[x, 0, 0]} castShadow>
                 <boxGeometry args={[postWidth, item.height, postWidth]} />
                 <meshPhysicalMaterial {...matProps} />
               </mesh>
             )
           })}
        </group>
      )
    }

    if (item.type === FurnitureType.VEHICLE) {
      const bodyHeight = item.height * 0.6;
      const roofHeight = item.height * 0.4;
      const wheelRadius = item.height * 0.25;
      const wheelWidth = item.width * 0.2;

      return (
        <group position={[0, wheelRadius, 0]}>
           {/* Body */}
           <mesh position={[0, bodyHeight/2, 0]} castShadow>
              <boxGeometry args={[item.width * 0.9, bodyHeight, item.depth]} />
              <meshPhysicalMaterial {...matProps} />
           </mesh>
           {/* Roof/Cabin */}
           <mesh position={[0, bodyHeight + roofHeight/2, -item.depth * 0.1]} castShadow>
              <boxGeometry args={[item.width * 0.7, roofHeight, item.depth * 0.6]} />
              <meshPhysicalMaterial color="#bfdbfe" opacity={0.5} transparent />
           </mesh>
           {/* Wheels */}
           <mesh position={[item.width/2, 0, item.depth/3]} rotation={[0, 0, Math.PI/2]} castShadow>
              <cylinderGeometry args={[wheelRadius, wheelRadius, wheelWidth]} />
              <meshStandardMaterial color="#1e293b" />
           </mesh>
           <mesh position={[-item.width/2, 0, item.depth/3]} rotation={[0, 0, Math.PI/2]} castShadow>
              <cylinderGeometry args={[wheelRadius, wheelRadius, wheelWidth]} />
              <meshStandardMaterial color="#1e293b" />
           </mesh>
           <mesh position={[item.width/2, 0, -item.depth/3]} rotation={[0, 0, Math.PI/2]} castShadow>
              <cylinderGeometry args={[wheelRadius, wheelRadius, wheelWidth]} />
              <meshStandardMaterial color="#1e293b" />
           </mesh>
           <mesh position={[-item.width/2, 0, -item.depth/3]} rotation={[0, 0, Math.PI/2]} castShadow>
              <cylinderGeometry args={[wheelRadius, wheelRadius, wheelWidth]} />
              <meshStandardMaterial color="#1e293b" />
           </mesh>
        </group>
      )
    }

    if (item.type === FurnitureType.LIGHT) {
        return (
            <group position={[0, item.height/2, 0]}>
                <mesh castShadow>
                    <cylinderGeometry args={[item.width/2, item.width/2, item.height, 16]} />
                    <meshPhysicalMaterial {...matProps} emissive={item.color} emissiveIntensity={1} />
                </mesh>
                <pointLight 
                    position={[0, 0, 0]} 
                    intensity={item.lightIntensity ?? 1.5} 
                    distance={10} 
                    color={item.color} 
                    castShadow 
                />
            </group>
        );
    }

    // Default Furniture Box
    return (
        <mesh position={[0, item.height / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[item.width, item.height, item.depth]} />
            <Suspense fallback={<meshPhysicalMaterial {...matProps} />}>
              <SmartMaterial 
                textureUrl={item.textureUrl} 
                textureScale={item.textureScale}
                dimensions={{ u: item.width, v: item.depth }} // Box mapping approximation
                materialProps={matProps}
              />
            </Suspense>
        </mesh>
    );
  };

  return (
    <>
      <group 
        ref={groupRef}
        position={position} 
        rotation={[0, -item.rotation, 0]} 
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(item.id);
        }}
      >
        {renderGeometry()}
        
        {isSelected && (
           <mesh position={[0, 0.05, 0]}>
             <boxGeometry args={[item.width + 0.1, item.height + 0.1, item.depth + 0.1]} />
             <meshBasicMaterial color="#4f46e5" wireframe />
           </mesh>
        )}
      </group>

      {isSelected && updateFurniture && (
        <TransformControls 
          object={groupRef} 
          mode="scale" 
          onMouseUp={handleTransformEnd}
          size={0.6}
          space="local"
        />
      )}
    </>
  );
};

export const Viewer3D: React.FC<Viewer3DProps> = ({ state, onSelect, updateFurniture, updateWall, cameraView = 'PERSPECTIVE' as CameraView }) => {
  const floorHeight = state.activeFloor * (WALL_HEIGHT_DEFAULT + FLOOR_THICKNESS);
  const ceilingHeight = floorHeight + WALL_HEIGHT_DEFAULT;

  // Calculate Bounds for Floor/Ceiling and Camera
  const bounds = useMemo(() => {
    if (state.walls.length === 0 && state.furniture.length === 0) {
        return { cx: 0, cy: 0, cz: 0, width: 20, depth: 20 };
    }
    
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    
    // Check Walls
    state.walls.forEach(w => {
      const sX = w.start.x * SCALE_FACTOR;
      const sY = w.start.y * SCALE_FACTOR;
      const eX = w.end.x * SCALE_FACTOR;
      const eY = w.end.y * SCALE_FACTOR;
      minX = Math.min(minX, sX, eX);
      maxX = Math.max(maxX, sX, eX);
      minZ = Math.min(minZ, sY, eY);
      maxZ = Math.max(maxZ, sY, eY);
    });

    // Check Furniture
    state.furniture.forEach(f => {
        const fx = f.position.x * SCALE_FACTOR;
        const fy = f.position.y * SCALE_FACTOR;
        minX = Math.min(minX, fx - f.width);
        maxX = Math.max(maxX, fx + f.width);
        minZ = Math.min(minZ, fy - f.depth);
        maxZ = Math.max(maxZ, fy + f.depth);
    });

    // If still infinity (empty state), default
    if (minX === Infinity) return { cx: 0, cy: 0, cz: 0, width: 20, depth: 20 };

    // Add padding
    const padding = 2;
    const width = Math.max(10, (maxX - minX) + padding * 2);
    const depth = Math.max(10, (maxZ - minZ) + padding * 2);

    return {
        cx: (minX + maxX) / 2,
        cy: 2, // Approximate vertical center
        cz: (minZ + maxZ) / 2,
        width,
        depth
    };
  }, [state.walls, state.furniture]);

  return (
    <div className="w-full h-full bg-slate-100">
      <Canvas shadows camera={{ position: [10, 10, 10], fov: 50 }}>
        {/* View Controller */}
        <CameraController view={cameraView} bounds={bounds} />

        {/* Realistic Sky & Atmosphere */}
        <Sky 
          sunPosition={new THREE.Vector3(...state.scene.sunPosition)} 
          turbidity={10} 
          rayleigh={0.5} 
          mieCoefficient={0.005} 
          mieDirectionalG={0.8} 
        />
        
        <Environment preset="apartment" background={false}/>
        
        {/* Dynamic Scene Lighting */}
        <ambientLight intensity={state.scene.ambientIntensity} />
        <directionalLight 
          position={new THREE.Vector3(...state.scene.sunPosition)}
          intensity={state.scene.sunIntensity} 
          castShadow 
          shadow-mapSize={[2048, 2048]} 
          shadow-bias={-0.0001}
        />

        <group>
          {/* Ceiling Plane */}
          {state.scene.showCeiling && (
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[bounds.cx, ceilingHeight, bounds.cz]} receiveShadow>
                <planeGeometry args={[bounds.width, bounds.depth]} />
                <meshStandardMaterial color="#f1f5f9" side={THREE.DoubleSide} roughness={0.9} />
            </mesh>
          )}

          {/* Floor Plane (Ground) */}
          {state.scene.showFloor && (
             <mesh rotation={[-Math.PI / 2, 0, 0]} position={[bounds.cx, -0.01, bounds.cz]} receiveShadow>
                <planeGeometry args={[bounds.width * 2, bounds.depth * 2]} />
                <meshStandardMaterial color="#e2e8f0" roughness={1} metalness={0} />
             </mesh>
          )}

          {state.walls.map(wall => (
            <Wall3D 
              key={wall.id} 
              wall={wall} 
              isSelected={state.selectedId === wall.id}
              onSelect={onSelect}
              updateWall={updateWall}
            />
          ))}

          {state.furniture.map(item => (
            <FurnitureItem 
              key={item.id} 
              item={item} 
              isSelected={state.selectedId === item.id}
              onSelect={onSelect}
              updateFurniture={updateFurniture}
            />
          ))}
        </group>

        <Grid 
          infiniteGrid 
          fadeDistance={50} 
          sectionColor="#94a3b8" 
          cellColor="#cbd5e1" 
          position={[0, -0.005, 0]} // Slightly above floor plane to show grid lines
        />
        
        {/* Enhanced Contact Shadows for realism */}
        <ContactShadows 
          resolution={2048} 
          scale={100} 
          blur={2} 
          opacity={0.4} 
          far={20} 
          color="#0f172a" 
        />
      </Canvas>
    </div>
  );
};