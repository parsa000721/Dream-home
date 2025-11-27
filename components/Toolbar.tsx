
import React from 'react';
import { Cuboid, Briefcase } from 'lucide-react';

interface ToolbarProps {
  onOpenExternalTools: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onOpenExternalTools }) => {
  return (
    <div className="h-14 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-4 shadow-lg z-20 relative text-slate-100 shrink-0">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 p-1.5 rounded-lg">
          <Cuboid className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-lg font-bold tracking-tight">Architect<span className="text-indigo-400">3D</span> <span className="text-xs font-normal text-slate-400 ml-2">Professional Edition</span></h1>
      </div>

      <div className="flex items-center gap-3">
         <button
          onClick={onOpenExternalTools}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-sm"
        >
          <Briefcase className="w-4 h-4" />
          <span className="hidden sm:inline">External Tools Library</span>
        </button>
      </div>
    </div>
  );
};
