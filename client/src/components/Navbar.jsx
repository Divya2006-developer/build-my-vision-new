import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  Compass,
  LayoutDashboard,
  Sparkles,
  Users,
  Image,
  Bell,
  LogOut,
  ChevronDown,
  User
} from 'lucide-react';

export default function Navbar({ currentView, setCurrentView }) {
  const { user, logout } = useAuth();
  const { connected, notifications } = useSocket();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
              Build My Vision
            </span>
            <p className="text-[11px] text-slate-500 -mt-0.5 hidden sm:block">
              Architectural Design & Planning Platform
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          <button
            onClick={() => setCurrentView('home')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'home'
                ? 'bg-sky-50 text-sky-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Overview
          </button>

          {/* If user is not designer, show Build Your Vision */}
          {user?.role !== 'designer' && (
            <button
              onClick={() => setCurrentView('vision-builder')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                currentView === 'vision-builder'
                  ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-sm font-semibold'
                  : 'text-sky-700 bg-sky-50/80 hover:bg-sky-100 font-semibold'
              }`}
            >
              <Sparkles className="w-4 h-4 text-sky-500 group-hover:rotate-12 transition-transform" />
              Build Your Vision
            </button>
          )}

          <button
            onClick={() => setCurrentView('designers')}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
              currentView === 'designers'
                ? 'bg-sky-50 text-sky-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Users className="w-4 h-4" />
            Architects & Designers
          </button>

          <button
            onClick={() => setCurrentView('portfolios')}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
              currentView === 'portfolios'
                ? 'bg-sky-50 text-sky-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Image className="w-4 h-4" />
            Portfolios
          </button>

          {/* Role-Specific Dashboard Link */}
          {user && (
            <button
              onClick={() => setCurrentView(user.role === 'designer' ? 'designer-dashboard' : 'customer-dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                currentView.includes('dashboard')
                  ? 'bg-slate-900 text-white font-semibold shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              {user.role === 'designer' ? 'Designer Studio' : 'My Visions'}
            </button>
          )}
        </nav>

        {/* Right Section: Notifications & Account Profile */}
        <div className="flex items-center gap-3">
          
          {/* Real-time Socket Notifications (Only for logged in users) */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-sky-500 rounded-full ring-2 ring-white" />
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-semibold text-xs uppercase tracking-wider text-slate-500">
                      Live Project Alerts ({notifications.length})
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Connected
                    </span>
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-50 mt-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No new notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="py-2 text-xs text-slate-700">
                          {n.text}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile / Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-500/20"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">{user.name}</div>
                  <div className="text-[10px] text-slate-500 capitalize">{user.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="p-2 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                      {user.role === 'designer' ? 'Architect / Designer' : 'Customer Client'}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setCurrentView(user.role === 'designer' ? 'designer-dashboard' : 'customer-dashboard');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-500" />
                      {user.role === 'designer' ? 'Designer Studio' : 'My Visions'}
                    </button>
                    
                    {user.role !== 'designer' && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setCurrentView('vision-builder');
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-50 rounded-lg flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 text-sky-500" />
                        Submit New Vision
                      </button>
                    )}
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        setCurrentView('home');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('login')}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900"
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentView('register')}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all hover:scale-105"
              >
                Get Started
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
