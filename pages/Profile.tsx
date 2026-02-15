import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GlassCard } from "../components/ui/GlassCard";
import { Skeleton } from "../components/ui/Skeleton";
import {
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { useAuthStore } from "../store";
import { motion, AnimatePresence } from "framer-motion";
import { EditProfileModal } from "../components/profile/EditProfileModal";
import { PostCard } from "../components/feed/PostCard";
import { api } from "../services/api";

export const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();
  const isOwnProfile = currentUser?.username === username;
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => api.profiles.get(username || ""),
    enabled: !!username,
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["profile-posts", username],
    queryFn: () => api.profiles.getPosts(username || ""),
    enabled: !!username,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => api.profiles.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", username] });
    },
  });

  const followMutation = useMutation({
    mutationFn: () => {
      if (!user) return Promise.reject();
      return user.isFollowing
        ? api.profiles.unfollow(user.id)
        : api.profiles.follow(user.id);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["profile", username] });
      const previousProfile = queryClient.getQueryData(["profile", username]);

      queryClient.setQueryData(["profile", username], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          isFollowing: !old.isFollowing,
          followers: old.isFollowing ? old.followers - 1 : old.followers + 1,
        };
      });

      return { previousProfile };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["profile", username], context?.previousProfile);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", username] });
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto w-full pb-20 space-y-8">
        <div className="h-64 rounded-[2.5rem] bg-white/5 animate-pulse" />
        <div className="flex gap-6 px-12">
          <div className="w-40 h-40 rounded-3xl bg-white/10 -mt-20 border-4 border-[#09090b] animate-pulse" />
          <div className="space-y-3 mt-6">
            <div className="h-8 w-64 bg-white/10 rounded-full animate-pulse" />
            <div className="h-4 w-40 bg-white/5 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="max-w-4xl mx-auto w-full py-20 text-center">
        <div className="w-20 h-20 bg-zinc-900 border border-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Users size={32} className="text-zinc-700" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Member not found</h2>
        <p className="text-zinc-500 max-w-xs mx-auto">
          The profile you're looking for doesn't exist or is not available.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full pb-20">
      {/* Premium Header Section */}
      <div className="relative mb-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="h-80 rounded-[3rem] overflow-hidden bg-[#0a0a0c] relative group shadow-2xl"
        >
          {user.coverUrl ? (
            <img
              src={user.coverUrl}
              alt="Cover"
              className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/20 to-emerald-600/20 animate-gradient" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-90" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none" />
        </motion.div>

        <div className="absolute -bottom-16 left-12 flex items-end gap-8">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-2 rounded-[2.5rem] bg-[#0a0a0c] shadow-2xl relative group/avatar"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-accent rounded-[2.5rem] blur opacity-0 group-hover/avatar:opacity-50 transition duration-500" />
            <img
              src={
                user.avatarUrl ||
                `https://ui-avatars.com/api/?name=${user.fullName}&background=random`
              }
              alt="Profile"
              className="relative w-44 h-44 rounded-[2rem] object-cover border-4 border-white/10 transition duration-500 group-hover/avatar:border-primary/50"
            />
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-4xl font-black text-white tracking-tighter">
                {user.fullName}
              </h1>
              <ShieldCheck
                size={24}
                className="text-primary fill-primary/20 mt-1"
              />
            </div>
            <p className="text-zinc-500 text-lg font-black uppercase tracking-tighter">
              @{user.username}
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-4 right-12 flex gap-4">
          <AnimatePresence mode="wait">
            {isOwnProfile ? (
              <motion.button
                key="edit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditModalOpen(true)}
                className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 py-3 rounded-2xl hover:bg-white/10 transition-all font-black text-xs uppercase tracking-widest shadow-xl"
              >
                Edit Profile
              </motion.button>
            ) : (
              <div key="actions" className="flex gap-4">
                <button className="p-3 bg-white/5 backdrop-blur-md border border-white/10 text-zinc-300 rounded-2xl hover:bg-white/10 hover:text-white transition-all shadow-xl">
                  <MessageSquare size={20} />
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => followMutation.mutate()}
                  className={`${user.isFollowing ? "bg-[#141417] border-white/10" : "bg-primary text-black"} border-2 border-transparent px-10 py-3 rounded-2xl transition-all shadow-2xl font-black text-xs uppercase tracking-widest shadow-primary/10`}
                >
                  {user.isFollowing ? "Following" : "Connect"}
                </motion.button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        <div className="lg:col-span-4 space-y-8">
          <GlassCard className="!rounded-[2.5rem] border-white/10 p-8">
            <h3 className="text-zinc-100 font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(196,255,14,0.5)]" />
              About Me
            </h3>
            <p className="text-white text-[15px] leading-relaxed mb-8 font-medium italic opacity-80">
              "{user.bio || "No bio yet..."}"
            </p>
            <div className="space-y-4 text-sm font-bold">
              <div className="flex items-center gap-4 text-zinc-200 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <MapPin size={18} className="text-primary" />
                </div>
                <span>{user.university}</span>
              </div>
              <div className="flex items-center gap-4 text-zinc-500 p-4">
                <Calendar size={18} className="text-zinc-600" />
                <span className="uppercase tracking-tight text-[11px]">
                  Joined {new Date().getFullYear()}
                </span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="!rounded-[2.5rem] border-white/5 bg-gradient-to-br from-primary/5 to-transparent p-1">
            <div className="flex items-center gap-12 mb-8">
              <div className="text-center group cursor-pointer">
                <p className="text-3xl font-black text-white tracking-tighter group-hover:text-primary transition-colors">
                  {user?.followers || 0}
                </p>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1 group-hover:text-zinc-500 transition-colors">
                  Followers
                </p>
              </div>
              <div className="text-center group cursor-pointer">
                <p className="text-3xl font-black text-white tracking-tighter group-hover:text-primary transition-colors">
                  {user?.following || 0}
                </p>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1 group-hover:text-zinc-500 transition-colors">
                  Following
                </p>
              </div>
              <div className="text-center group cursor-pointer">
                <p className="text-3xl font-black text-white tracking-tighter group-hover:text-primary transition-colors">
                  {posts?.length || 0}
                </p>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1 group-hover:text-zinc-500 transition-colors">
                  Posts
                </p>
              </div>
            </div>

            {isOwnProfile && (
              <div className="flex gap-4">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-10 py-4 bg-primary text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20"
                >
                  Edit Profile
                </button>
                <button className="px-6 py-4 bg-white/5 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">
                  Share Profile
                </button>
              </div>
            )}
          </GlassCard>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="flex gap-4 p-1.5 bg-[#141417]/40 backdrop-blur-xl rounded-[1.8rem] border border-white/5 overflow-x-auto scrollbar-hide">
            <button className="flex-1 min-w-[100px] py-4 text-black bg-primary rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary/10">
              Posts
            </button>
            <button className="flex-1 min-w-[100px] py-4 text-zinc-500 hover:text-white transition-all font-black text-xs uppercase tracking-widest">
              Media
            </button>
            <button className="flex-1 min-w-[100px] py-4 text-zinc-500 hover:text-white transition-all font-black text-xs uppercase tracking-widest">
              Following
            </button>
          </div>

          <div className="space-y-6">
            {postsLoading ? (
              <Skeleton className="h-64 w-full rounded-[3rem]" />
            ) : posts && posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post: any) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="bg-[#141417]/20 rounded-[3rem] p-16 text-center border border-white/5 border-dashed group transition-colors hover:border-primary/20">
                <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-3xl shadow-xl transition-transform group-hover:scale-110">
                  ⚡
                </div>
                <p className="text-zinc-500 font-black text-xs uppercase tracking-widest">
                  No posts yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={user}
        onSave={(data) => updateProfileMutation.mutate(data)}
      />
    </div>
  );
};
