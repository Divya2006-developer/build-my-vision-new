import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Plus,
  Send,
  X,
  Layers,
  Check,
  BookOpen
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { HOME_ELEMENTS_GUIDE } from './VisualHomeGuideModal';

export default function DesignChoiceProposals({ projectId, onRefresh, onOpenGuide }) {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submittingChoice, setSubmittingChoice] = useState(null);

  // New proposal form for designers
  const [proposalForm, setProposalForm] = useState({
    title: 'Staircase Style Options for Main Hallway',
    category: 'staircases',
    description: 'Please review these 3 staircase concepts and pick the one that matches your family lifestyle best!',
    templateKey: 'staircases'
  });
  const [creating, setCreating] = useState(false);

  const fetchProposals = async () => {
    try {
      const list = await api.getProposals(projectId);
      setProposals(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProposals();
    }
  }, [projectId]);

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      // Pick template options from HOME_ELEMENTS_GUIDE
      const template = HOME_ELEMENTS_GUIDE[proposalForm.templateKey] || HOME_ELEMENTS_GUIDE.staircases;
      const options = template.items.map(item => ({
        id: item.id,
        name: item.name,
        tagline: item.tagline,
        description: item.description,
        image_url: item.image,
        pros: item.pros
      }));

      await api.createProposal(projectId, {
        title: proposalForm.title,
        category: proposalForm.category,
        description: proposalForm.description,
        options
      });

      setShowCreateModal(false);
      fetchProposals();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to publish proposal: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleChooseOption = async (proposalId, option) => {
    if (user?.role !== 'customer') return;

    setSubmittingChoice(option.id);
    try {
      await api.chooseProposalOption(projectId, proposalId, {
        optionId: option.id,
        optionName: option.name,
        customerNote: `Preferred ${option.name}`
      });
      fetchProposals();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to record option: ' + err.message);
    } finally {
      setSubmittingChoice(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900">
              Design Options & Style Decisions
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 uppercase">
              Interactive Choices
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {user?.role === 'customer'
              ? 'Your designer proposed the visual styles below. Select your favorite with one click!'
              : 'Send visual options (staircases, roofs, layouts) for your client to choose without technical confusion.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>Visual Home Guide</span>
            </button>
          )}

          {user?.role === 'designer' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Propose Design Options
            </button>
          )}
        </div>
      </div>

      {/* Proposals List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-xs text-slate-400">Loading design proposals...</p>
        </div>
      ) : proposals.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-800 text-sm">No design choices requested yet</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {user?.role === 'customer'
              ? 'Your designer will share visual options (like staircase or roof styles) here during drafting so you can easily choose your favorite.'
              : 'Click "Propose Design Options" above to send visual choices (e.g. staircases, roof styles) to the client.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {proposals.map((prop) => {
            const isDecided = prop.status === 'decided';
            const options = Array.isArray(prop.options) ? prop.options : [];

            return (
              <div
                key={prop.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
              >
                {/* Proposal Title Header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-base text-slate-900">{prop.title}</h4>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isDecided ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isDecided ? '✓ Decision Selected' : '⏳ Awaiting Client Selection'}
                      </span>
                    </div>
                    {prop.description && (
                      <p className="text-xs text-slate-500 mt-1">{prop.description}</p>
                    )}
                  </div>

                  {prop.selected_option_id && (
                    <div className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Client selected: <strong>{options.find(o => o.id === prop.selected_option_id)?.name}</strong>
                    </div>
                  )}
                </div>

                {/* Options Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                  {options.map((opt) => {
                    const isSelected = prop.selected_option_id === opt.id;

                    return (
                      <div
                        key={opt.id}
                        className={`rounded-2xl border-2 overflow-hidden flex flex-col justify-between transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/20 shadow-md ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="h-44 overflow-hidden bg-slate-900 relative">
                            <img
                              src={opt.image_url}
                              alt={opt.name}
                              className="w-full h-full object-cover"
                            />
                            {opt.tagline && (
                              <span className="absolute bottom-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/80 text-white">
                                {opt.tagline}
                              </span>
                            )}
                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md">
                                <Check className="w-3 h-3 stroke-[3]" /> Selected
                              </div>
                            )}
                          </div>

                          <div className="p-4 space-y-2">
                            <h5 className="font-extrabold text-sm text-slate-900">{opt.name}</h5>
                            <p className="text-xs text-slate-600 leading-relaxed">{opt.description}</p>

                            {opt.pros && Array.isArray(opt.pros) && (
                              <div className="space-y-1 pt-1">
                                {opt.pros.map((p, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                                    <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                                    <span>{p}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Customer Choice CTA */}
                        <div className="p-4 pt-0">
                          {user?.role === 'customer' ? (
                            isSelected ? (
                              <div className="w-full py-2 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                Your Chosen Style
                              </div>
                            ) : (
                              <button
                                disabled={submittingChoice === opt.id}
                                onClick={() => handleChooseOption(prop.id, opt)}
                                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                              >
                                {submittingChoice === opt.id ? 'Saving...' : 'Choose This Style'}
                              </button>
                            )
                          ) : (
                            <div className="text-[11px] text-slate-400 text-center py-1">
                              {isSelected ? '✓ Client confirmed this choice' : 'Available option'}
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create Design Choice Proposal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                Propose Visual Choices to Client
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Choose Category Template
                </label>
                <select
                  value={proposalForm.templateKey}
                  onChange={(e) => {
                    const key = e.target.value;
                    let defaultTitle = 'Staircase Options for Main Hallway';
                    if (key === 'roofs') defaultTitle = 'Roof & Ceiling Height Options';
                    if (key === 'layouts') defaultTitle = 'Kitchen & Living Flow Options';
                    setProposalForm({
                      ...proposalForm,
                      templateKey: key,
                      category: key,
                      title: defaultTitle
                    });
                  }}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="staircases">Staircase Styles (L-Shaped, Floating, Spiral, Storage)</option>
                  <option value="roofs">Roof & Ceilings (Vaulted Cathedral, Terrace, Clerestory)</option>
                  <option value="layouts">Kitchen & Living Layouts (Open Island, Broken-Plan)</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Automatically pulls plain-English photos and explanations for the client.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Proposal Title
                </label>
                <input
                  type="text"
                  value={proposalForm.title}
                  onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Note to Customer
                </label>
                <textarea
                  value={proposalForm.description}
                  onChange={(e) => setProposalForm({ ...proposalForm, description: e.target.value })}
                  rows={3}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  {creating ? 'Publishing...' : 'Send Choices to Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
