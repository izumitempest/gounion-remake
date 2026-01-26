import React, { useState } from 'react';
import { useAuthStore } from '../store';
import { api } from '../services/api';

export const Login = () => {
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await (isSignup ? api.auth.signup({}) : api.auth.login({}));
      login(response.user, response.access_token);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] flex items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-md p-8 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-violet-900/40">G</div>
          <h1 className="text-2xl font-bold text-white mb-2">{isSignup ? 'Join GoUnion' : 'Welcome Back'}</h1>
          <p className="text-zinc-400 text-sm">The premium community for students.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
             <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400 ml-1">Full Name</label>
              <input type="text" className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 focus:outline-none transition-colors" placeholder="John Doe" />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400 ml-1">Email Address</label>
            <input type="email" className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 focus:outline-none transition-colors" placeholder="student@university.edu" value="demo@gounion.com" readOnly />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400 ml-1">Password</label>
            <input type="password" className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 focus:outline-none transition-colors" placeholder="••••••••" value="password" readOnly />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-violet-900/20 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : (isSignup ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-zinc-500 text-sm">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <button 
              onClick={() => setIsSignup(!isSignup)}
              className="ml-2 text-violet-400 hover:text-violet-300 font-medium"
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
