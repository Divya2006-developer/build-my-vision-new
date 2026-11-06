import React from 'react';
import { Layers, MapPin, Calendar, Maximize, ArrowUpRight } from 'lucide-react';

export default function PortfolioCard({ item, onSelectDesigner, onViewDetails }) {
  const tags = Array.isArray(item.tags) ? item.tags : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
      
      {/* Image Preview with Hover Overlay */}
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow-sm">
            {item.category}
          </span>
        </div>

        {/* Style Badge */}
        {item.style && (
          <div className="absolute bottom-3 left-3">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
              {item.style}
            </span>
          </div>
        )}

        {/* Action Icon */}
        <button
          onClick={() => onViewDetails && onViewDetails(item)}
          className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md"
          title="Inspect Blueprints"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {item.location || 'Global Concept'}
            </span>
            {item.area_sqft && (
              <span className="flex items-center gap-1 font-medium">
                <Maximize className="w-3.5 h-3.5" />
                {item.area_sqft.toLocaleString()} sq.ft
              </span>
            )}
          </div>

          <h3 className="font-extrabold text-base text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
            {item.title}
          </h3>

          <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
            {item.description}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Designer Attribution & CTA */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={item.designer_avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'}
              alt={item.designer_name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div>
              <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.designer_name}</p>
              <p className="text-[10px] text-slate-400">{item.designer_title || 'Architect'}</p>
            </div>
          </div>

          {onSelectDesigner && (
            <button
              onClick={() => onSelectDesigner(item.designer_id)}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:bg-sky-50 px-2.5 py-1 rounded-lg transition-colors"
            >
              Collaborate →
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
