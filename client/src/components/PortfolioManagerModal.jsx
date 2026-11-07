import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Image,
  Upload,
  Layers,
  Check,
  MapPin,
  Sparkles
} from 'lucide-react';
import { api } from '../api/client';

export default function PortfolioManagerModal({ isOpen, onClose, onRefresh }) {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: '',
    category: 'residential',
    style: 'Modern Minimalist',
    area_sqft: 2800,
    location: 'Portland, OR',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    blueprint_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    description: '',
    tags: 'Solar Orientation, Open Concept, High Vaulted Ceilings'
  });
  const [saving, setSaving] = useState(false);

  const fetchMyPortfolios = async () => {
    try {
      const list = await api.getMyPortfolios();
      setPortfolios(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMyPortfolios();
    }
  }, [isOpen]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm({
      title: '',
      category: 'residential',
      style: 'Modern Minimalist',
      area_sqft: 2800,
      location: 'City, State',
      image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      blueprint_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      description: '',
      tags: 'Natural Light, Timber Accents, Safe Stairs'
    });
    setIsAddingNew(true);
  };

  const handleOpenEdit = (item) => {
    setIsAddingNew(false);
    setEditingItem(item);
    setForm({
      title: item.title,
      category: item.category,
      style: item.style || 'Modern Minimalist',
      area_sqft: item.area_sqft || '',
      location: item.location || '',
      image_url: item.image_url,
      blueprint_url: item.blueprint_url || '',
      description: item.description || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this portfolio project?')) return;
    try {
      await api.deletePortfolio(id);
      fetchMyPortfolios();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to delete: ' + err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        area_sqft: Number(form.area_sqft) || null,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (isAddingNew) {
        await api.createPortfolio(payload);
      } else if (editingItem) {
        await api.updatePortfolio(editingItem.id, payload);
      }

      setIsAddingNew(false);
      setEditingItem(null);
      fetchMyPortfolios();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to save portfolio: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">
              Designer Portfolio Showcase Manager
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload, edit, and curate your projects and blueprints to attract clients.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isAddingNew && !editingItem && (
              <button
                onClick={handleOpenAdd}
                className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" /> Add New Project
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Add / Edit Form View */}
          {(isAddingNew || editingItem) ? (
            <form onSubmit={handleSave} className="space-y-4 max-w-2xl mx-auto bg-slate-50/60 p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h4 className="font-extrabold text-sm text-slate-900">
                  {isAddingNew ? 'Add New Portfolio Project' : `Edit "${editingItem?.title}"`}
                </h4>
                <button
                  type="button"
                  onClick={() => { setIsAddingNew(false); setEditingItem(null); }}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. The Solarium Eco-Villa"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="residential">Residential Home</option>
                    <option value="commercial">Commercial Building</option>
                    <option value="educational">School & Educational</option>
                    <option value="renovation">Renovation & Remodel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Architectural Style</label>
                  <input
                    type="text"
                    value={form.style}
                    onChange={(e) => setForm({ ...form, style: e.target.value })}
                    placeholder="e.g. Modern Minimalist"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Approximate Area (Sq.Ft)</label>
                  <input
                    type="number"
                    value={form.area_sqft}
                    onChange={(e) => setForm({ ...form, area_sqft: e.target.value })}
                    placeholder="e.g. 3200"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Bend, Oregon"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cover Image / 3D Render URL</label>
                <input
                  type="text"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Blueprint / Floorplan Drawing URL (Optional)</label>
                <input
                  type="text"
                  value={form.blueprint_url}
                  onChange={(e) => setForm({ ...form, blueprint_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Description & Concept</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Describe the spatial flow, lighting strategy, and architectural features..."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Key Feature Tags (comma separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="e.g. Solar Orientation, Floating Stairs, High Ceilings"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => { setIsAddingNew(false); setEditingItem(null); }}
                  className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  {saving ? 'Saving...' : (isAddingNew ? 'Publish Project' : 'Save Changes')}
                </button>
              </div>
            </form>
          ) : (
            /* Portfolio List View */
            <div className="space-y-4">
              {loading ? (
                <p className="text-xs text-slate-400 text-center py-8">Loading your portfolios...</p>
              ) : portfolios.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl p-8">
                  <Image className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-800 text-sm">No portfolio items published yet</h4>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Add completed designs, sketches, or 3D renders so customers can browse your work and request you!
                  </p>
                  <button
                    onClick={handleOpenAdd}
                    className="px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl shadow-sm"
                  >
                    + Add Your First Project
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolios.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex gap-4 items-center justify-between"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-20 h-20 rounded-xl object-cover shrink-0"
                        />
                        <div className="overflow-hidden">
                          <span className="text-[10px] uppercase font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          <h4 className="font-extrabold text-sm text-slate-900 truncate mt-1">{item.title}</h4>
                          <p className="text-xs text-slate-500 truncate">{item.style} • {item.area_sqft ? `${item.area_sqft} sq.ft` : 'Custom'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
                          title="Edit Portfolio Item"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Delete Portfolio Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Clients can browse these projects on the public Portfolios showcase.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-xl font-bold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
