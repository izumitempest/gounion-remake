import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search, Users as UsersIcon } from "lucide-react";
import { api } from "../services/api";
import { GlassCard } from "../components/ui/GlassCard";
import { Skeleton } from "../components/ui/Skeleton";
import { Group } from "../types";

export const Groups = () => {
  const { data: groups, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: api.groups.getAll,
  });

  return (
    <div className="w-full pb-20 md:pb-0">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            Groups
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
            Join community groups and connect with others
          </p>
        </div>
        <span className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest">
          {groups?.length || 0} active groups
        </span>
      </div>

      <div className="relative mb-12 group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors"
          size={20}
        />
        <input
          type="text"
          placeholder="Search for groups..."
          className="w-full bg-[#141417]/50 backdrop-blur-md border border-white/5 rounded-[2rem] py-5 pl-14 pr-6 text-white placeholder:text-zinc-700 focus:outline-none focus:border-primary/30 focus:bg-[#141417] transition-all font-bold text-sm tracking-tight"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[400px] rounded-[2.5rem]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups?.map((group: Group) => (
            <Link
              key={group.id}
              to={`/groups/${group.id}`}
              className="block h-full group"
            >
              <GlassCard
                hoverEffect
                className="flex flex-col h-full !p-0 !rounded-[2.5rem] overflow-hidden border-white/5 group-hover:border-primary/20 transition-all duration-500"
              >
                <div className="relative h-48 bg-zinc-800 overflow-hidden">
                  <img
                    src={group.imageUrl}
                    alt={group.name}
                    className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141417] via-[#141417]/40 to-transparent" />

                  {/* Neon Activity Indicator */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(196,255,14,0.8)]" />
                    <span className="text-[9px] font-black text-white uppercase tracking-tighter">
                      Active
                    </span>
                  </div>
                </div>

                <div className="flex-1 p-8">
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight group-hover:text-primary transition-colors">
                    {group.name}
                  </h3>
                  <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">
                    <UsersIcon size={14} className="text-primary" />
                    <span>
                      {group.memberCount.toLocaleString()} Members Syncing
                    </span>
                  </div>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-8 line-clamp-3">
                    {group.description}
                  </p>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
                      group.isJoined
                        ? "bg-white/5 text-zinc-500 hover:bg-white/10"
                        : "bg-primary text-black hover:opacity-90 shadow-lg shadow-primary/10 group-hover:shadow-primary/20"
                    }`}
                  >
                    {group.isJoined ? "Node Joined" : "Connect Node"}
                  </button>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
