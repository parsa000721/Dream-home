
import React from 'react';
import { X, Wrench, Monitor, Ruler, HardHat, Hotel } from 'lucide-react';

interface ExternalToolsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExternalTools: React.FC<ExternalToolsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const ToolCategory = ({ icon: Icon, title, tools }: { icon: any, title: string, tools: string[] }) => (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
      <h3 className="flex items-center gap-2 font-bold text-slate-700 mb-3 border-b border-slate-200 pb-2">
        <Icon className="w-5 h-5 text-indigo-600" />
        {title}
      </h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {tools.map((tool, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
            {tool}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">External Tools Library</h2>
            <p className="text-sm text-slate-500">Essential resources for planning, construction, and setup</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          <ToolCategory 
            icon={Ruler} 
            title="Planning Tools" 
            tools={[
              "Tape measure (5m / 30m)",
              "Laser distance meter",
              "Graph paper / Sketch notebook",
              "Site survey markers",
              "Mobile camera (Site documentation)",
              "Spirit level"
            ]}
          />

          <ToolCategory 
            icon={Monitor} 
            title="Supporting Software" 
            tools={[
              "SketchUp (Custom 3D modeling)",
              "Blender (High-end rendering)",
              "AutoCAD LT / Draftsight (CAD Plans)",
              "GIMP / Photoshop (Texture editing)",
              "Trello / Notion (Project Management)",
              "Google Sheets (Budgeting)"
            ]}
          />

          <ToolCategory 
            icon={HardHat} 
            title="Construction & Execution" 
            tools={[
              "Hammer & Screwdriver Set",
              "Drill machine & Bits",
              "Saw / Cutter / Angle Grinder",
              "Welding machine (Metal work)",
              "Brick masonry tools",
              "Paint rollers & brushes",
              "Electrical & Plumbing toolkits",
              "Safety Gear (Helmet, Gloves)"
            ]}
          />

          <ToolCategory 
            icon={Hotel} 
            title="Hospitality Setup (Hotel/Homestay)" 
            tools={[
              "Fire Extinguishers",
              "CCTV Camera System",
              "Smoke Detectors",
              "Access Control / Key Cards",
              "Wiring & LED installation tools",
              "Furniture Assembly Tools (Allen keys)",
              "Curtain fixing tools"
            ]}
          />

          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 text-center">
             <h4 className="font-bold text-indigo-800 mb-2">Need 3D Assets?</h4>
             <div className="flex flex-wrap justify-center gap-4 text-sm text-indigo-600">
               <a href="#" className="hover:underline">3D Warehouse</a> •
               <a href="#" className="hover:underline">Free3D</a> •
               <a href="#" className="hover:underline">CGTrader</a> •
               <a href="#" className="hover:underline">Poly Haven</a>
             </div>
          </div>

        </div>
        
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-right">
          <button onClick={onClose} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Close Library
          </button>
        </div>

      </div>
    </div>
  );
};
