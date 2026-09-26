import React, { useState } from 'react';
import { X, Shield, User, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginAs, loginWithEmail, currentUser, logout } = useApp();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'signin' | 'register'>('signin');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    loginWithEmail(email, name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-[#FBFBF9] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-amber-800 font-semibold font-mono">
              Account Authentication
            </span>
            <h3 className="text-xl font-serif font-bold text-stone-900">
              {currentUser ? 'Current Session' : mode === 'signin' ? 'Sign In to Atelier' : 'Create Atelier Account'}
            </h3>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {currentUser ? (
            /* Current User Card */
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-200">
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">{currentUser.name}</h4>
                  <p className="text-xs text-stone-500">{currentUser.email}</p>
                  <span className={`inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                    currentUser.role === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-800'
                  }`}>
                    {currentUser.role} Role
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsAuthModalOpen(false);
                  }}
                  className="w-full py-2.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            /* Login / Signup Flow */
            <>
              {/* Quick Persona Demo Switcher */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Quick Demo Access:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => loginAs('admin')}
                    className="p-3 text-left rounded-xl border border-amber-300 bg-amber-50/50 hover:bg-amber-100/50 transition-all group"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-950">
                      <Shield className="w-3.5 h-3.5 text-amber-700" />
                      <span>Admin Persona</span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1 line-clamp-1">
                      Eleanor (Editor & CMS)
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => loginAs('customer')}
                    className="p-3 text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-all group"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900">
                      <User className="w-3.5 h-3.5 text-stone-600" />
                      <span>Customer</span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1 line-clamp-1">
                      Clara (Shopper)
                    </p>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-stone-400 text-xs">
                <div className="flex-1 h-px bg-stone-200" />
                <span>Or continue with custom email</span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Thomas Cole"
                      required
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com (include 'admin' for CMS access)"
                    required
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <span>{mode === 'signin' ? 'Sign In to Workspace' : 'Create Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'signin' ? 'register' : 'signin')}
                  className="text-xs text-stone-500 hover:text-stone-900 underline"
                >
                  {mode === 'signin'
                    ? "Don't have an account yet? Register here"
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
