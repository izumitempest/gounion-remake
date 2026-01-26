import React from 'react';
import { Plus } from 'lucide-react';

export const RightSidebar = () => {
  return (
    <div className="hidden lg:flex flex-col w-80 h-screen sticky top-0 border-l border-white/5 bg-[#09090b]/50 backdrop-blur-md pt-24 pb-8 px-6 overflow-y-auto">
      <div className="mb-8">
        <h3 className="text-zinc-100 font-semibold mb-4 text-sm uppercase tracking-wider">Suggested Groups</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://picsum.photos/seed/grp${i}/100`} alt="grp" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200 group-hover:text-violet-400 transition-colors">Tech Innovators</p>
                  <p className="text-xs text-zinc-500">2.4k members</p>
                </div>
              </div>
              <button className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                <Plus size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-zinc-100 font-semibold mb-4 text-sm uppercase tracking-wider">Online Friends</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <img src={`https://picsum.photos/seed/frnd${i}/100`} alt="user" className="w-9 h-9 rounded-full object-cover border border-white/10" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#09090b]"></span>
              </div>
              <p className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">Student Name</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
