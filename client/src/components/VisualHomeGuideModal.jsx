import React, { useState } from 'react';
import {
  X,
  BookOpen,
  ArrowRight,
  Sun,
  Layout,
  CheckCircle2,
  Info,
  Maximize2
} from 'lucide-react';

export const HOME_ELEMENTS_GUIDE = {
  staircases: {
    category: 'Staircase Styles',
    subtitle: 'Choose how you move between floors based on safety, light, and storage.',
    items: [
      {
        id: 'l_shaped',
        name: 'L-Shaped with Flat Landing',
        tagline: 'Best for Families, Kids & Seniors',
        description: 'Turns 90 degrees with a flat rest platform halfway up. If someone trips, the landing stops the fall. Also creates a cozy corner transition.',
        pros: ['Safest for toddlers and elderly', 'Reduces noise transfer between floors', 'Fits neatly into corners'],
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'floating',
        name: 'Floating / Open-Riser Staircase',
        tagline: 'Maximum Sunlight & Modern Vibe',
        description: 'Steps are anchored directly into the wall with no vertical backs. Sunlight from front and back windows shines right through the staircase.',
        pros: ['Makes hallways feel twice as large', 'Natural light flows freely', 'Striking contemporary aesthetic'],
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'under_stair_storage',
        name: 'Staircase with Built-in Storage / Powder Room',
        tagline: 'Zero Wasted Space',
        description: 'Utilizes the triangle space underneath the stairs for custom pull-out coat closets, bookshelves, pet nook, or a guest powder room.',
        pros: ['Huge space saver for small plots', 'Keeps entryway clutter-free', 'Multi-functional design'],
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'spiral',
        name: 'Spiral / Curved Centerpiece',
        tagline: 'Compact Footprint & Sculptural Elegance',
        description: 'Steps curve gracefully around a central pole. Perfect for reaching a cozy mezzanine, loft office, or rooftop terrace in a tiny footprint.',
        pros: ['Takes up minimal square footage', 'Architectural visual focal point', 'Fun access to private lofts'],
        image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  roofs: {
    category: 'Roof & Ceiling Types',
    subtitle: 'How high ceilings and roof shapes affect indoor openness and climate.',
    items: [
      {
        id: 'vaulted_cathedral',
        name: 'High Vaulted / Cathedral Ceiling',
        tagline: 'Soaring 14-18ft Heights',
        description: 'Follows the slope of the roof upward, creating voluminous heights that make living rooms and master suites feel twice as grand.',
        pros: ['Huge feeling of openness', 'Allows dramatic hanging pendant lights', 'Hot air rises away in summer'],
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'flat_terrace',
        name: 'Flat Rooftop Terrace & Green Garden',
        tagline: 'Extra Outdoor Living Floor',
        description: 'A flat reinforced roof engineered to walk on. You can host sunset dinners, grow potted herb gardens, or set up solar panels.',
        pros: ['Adds outdoor space without needing bigger land', 'Spectacular 360-degree views', 'Modern minimalist silhouette'],
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'clerestory_skylight',
        name: 'Elevated Roof with Skylights & High Glazing',
        tagline: 'Sun Pouring from Above',
        description: 'A raised roof section with skylights and high horizontal windows that bathe the middle of the house in sunlight all day long.',
        pros: ['Zero glare on TV screens', 'Light reaches deep internal corridors', 'Complete privacy from street view'],
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  layouts: {
    category: 'Living & Kitchen Layouts',
    subtitle: 'How your daily rooms connect with family life and cooking.',
    items: [
      {
        id: 'open_island',
        name: 'Open Great Room with Chef Island',
        tagline: 'Cook While Talking to Family',
        description: 'The kitchen island faces into the living room and patio. Parents can prep dinner while watching children play or chatting with guests.',
        pros: ['Most popular modern layout', 'Great for entertaining', 'Zero barrier to outdoor garden'],
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'broken_plan',
        name: 'Broken-Plan (Semi-Private Zoning)',
        tagline: 'Best of Both Worlds: Open Yet Quiet',
        description: 'Uses glass sliding pocket doors, wooden slat screens, or a double-sided fireplace to separate the messy kitchen or noisy TV room when desired.',
        pros: ['Blocks cooking smells & dishwasher noise', 'Keeps daylight flowing through glass', 'Cozy private evening spots'],
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
      }
    ]
  }
};

export default function VisualHomeGuideModal({ isOpen, onClose, onSelectOption }) {
  const [activeTab, setActiveTab] = useState('staircases');

  if (!isOpen) return null;

  const currentCategory = HOME_ELEMENTS_GUIDE[activeTab];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">
                Visual Home Guide (No Architectural Jargon)
              </h3>
              <p className="text-xs text-slate-500">
                Simple visual explanations to help you choose what fits your lifestyle
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('staircases')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'staircases'
                ? 'border-sky-600 text-sky-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🪜 Staircase Styles (4)
          </button>

          <button
            onClick={() => setActiveTab('roofs')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'roofs'
                ? 'border-sky-600 text-sky-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🏠 Roof & Ceilings (3)
          </button>

          <button
            onClick={() => setActiveTab('layouts')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'layouts'
                ? 'border-sky-600 text-sky-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🍳 Kitchen & Living Layouts (2)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="bg-sky-50/70 p-3.5 rounded-2xl border border-sky-100 text-xs text-sky-900 flex items-center justify-between">
            <span className="font-semibold">{currentCategory.subtitle}</span>
            <span className="text-[10px] text-sky-600 uppercase font-bold tracking-wider">
              Plain-English Reference
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {currentCategory.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-40 overflow-hidden bg-slate-900 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-2 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/80 text-white">
                      {item.tagline}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="font-extrabold text-sm text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                    <div className="space-y-1 pt-1">
                      {item.pros.map((pro, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{pro}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {onSelectOption && (
                  <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                    <button
                      onClick={() => {
                        onSelectOption(activeTab, item);
                        onClose();
                      }}
                      className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                    >
                      I Prefer This Style →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            You can reference these terms anytime during chat with your designer.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
}
