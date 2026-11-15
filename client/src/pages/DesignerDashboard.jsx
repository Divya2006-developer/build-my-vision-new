import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  Plus,
  Eye,
  MessageSquare,
  Sparkles,
  Star,
  Users,
  HardHat,
  X,
  Image,
  Layers,
  Award
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import PortfolioManagerModal from '../components/PortfolioManagerModal';

export default function DesignerDashboard({ setCurrentView, setSelectedProjectId }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'invitations'
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [targetProjectId, setTargetProjectId] = useState(null);

  // Deliverable upload state
  const [deliverableForm, setDeliverableForm] = useState({
    title: '',
    stage: 'concept_draft',
    description: '',
    file_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    version: 1
  });
  const [uploading, setUploading] = useState(false);

  const fetchDesignerProjects = async () => {
    try {
      const list = await api.getProjects();
      setProjects(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignerProjects();
  }, []);

  const handleAcceptProject = async (projectId) => {
    try {
      await api.acceptProject(projectId);
      await fetchDesignerProjects();
      alert('Invitation accepted! You are now connected with the client in the project workspace.');
      setSelectedProjectId(projectId);
      setCurrentView('project-detail');
    } catch (err) {
      console.error(err);
      alert('Failed to accept project: ' + err.message);
    }
  };

  const handleUploadDeliverable = async (e) => {
    e.preventDefault();
    if (!targetProjectId || !deliverableForm.title.trim()) return;

    setUploading(true);
    try {
      await api.addDeliverable(targetProjectId, deliverableForm);
      setShowUploadModal(false);
      setDeliverableForm({
        title: '',
        stage: 'concept_draft',
        description: '',
        file_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
        version: 1
      });
      await fetchDesignerProjects();
      alert('Deliverable uploaded! The client has been notified to review.');
    } catch (err) {
      console.error(err);
      alert('Failed to upload deliverable: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Filter projects
  const activeProjects = projects.filter(p => p.designer_id === user?.id && p.status !== 'submitted');
  const incomingInvitations = projects.filter(p => !p.designer_id || (p.designer_id === user?.id && p.status === 'submitted'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Studio Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-white/10 px-3 py-1 rounded-full">
            Architect Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome, {user?.name || 'Architect'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
            Manage your architectural showcase, accept customer design requests, and collaborate from concept to final delivery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPortfolioModal(true)}
            className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Image className="w-4 h-4 text-sky-600" />
            Manage My Portfolio (Add / Edit)
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase block">Active Projects</span>
          <span className="text-2xl font-black text-sky-600 mt-1 block">{activeProjects.length}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-amber-500 font-bold uppercase block">Customer Invitations</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{incomingInvitations.length}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase block">Completed Handover</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            {activeProjects.filter(p => p.status === 'final_delivered').length}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase block">Architect Rating</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">★ 4.96</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-2 px-2 text-sm font-extrabold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'active'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Active Collaborations ({activeProjects.length})
        </button>

        <button
          onClick={() => setActiveTab('invitations')}
          className={`pb-2 px-2 text-sm font-extrabold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'invitations'
              ? 'border-amber-500 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          Customer Invitations & Requests ({incomingInvitations.length})
        </button>
      </div>

      {/* Tab 1: Active Collaborations */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeProjects.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800">No active projects yet</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Accept incoming customer invitations to begin collaborating on architectural designs.
              </p>
              <button
                onClick={() => setActiveTab('invitations')}
                className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold"
              >
                View Customer Invitations
              </button>
            </div>
          ) : (
            activeProjects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-900">{proj.title}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {proj.building_type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                      Stage: {proj.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 max-w-xl">
                    Client: <strong>{proj.customer_name || 'Client'}</strong> — "{proj.description}"
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span>Style: <strong className="text-slate-800">{proj.style_preference}</strong></span>
                    <span>Plot: <strong className="text-slate-800">{proj.plot_dimensions || 'N/A'}</strong></span>
                    <span>Floors: <strong className="text-slate-800">{proj.num_floors}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => {
                      setTargetProjectId(proj.id);
                      setShowUploadModal(true);
                    }}
                    className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Deliverable
                  </button>

                  <button
                    onClick={() => {
                      if (setSelectedProjectId) setSelectedProjectId(proj.id);
                      setCurrentView('project-detail');
                    }}
                    className="flex-1 md:flex-none px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Workspace & Chat
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Incoming Customer Invitations */}
      {activeTab === 'invitations' && (
        <div className="space-y-4">
          {incomingInvitations.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800">No pending customer invitations</h3>
              <p className="text-xs text-slate-500 mt-1">
                When customers browse your portfolio and request your design services, their invitations will appear here.
              </p>
            </div>
          ) : (
            incomingInvitations.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border-2 border-amber-200/90 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Customer Invitation
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900">{req.title}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {req.building_type.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 max-w-xl leading-relaxed">
                    Client: <strong>{req.customer_name || 'Client'}</strong> — "{req.description}"
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span>Style Desired: <strong className="text-slate-800">{req.style_preference}</strong></span>
                    <span>Plot: <strong className="text-slate-800">{req.plot_dimensions || 'N/A'}</strong></span>
                    <span>Timeline: <strong className="text-slate-800">{req.timeline_preference}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => {
                      if (setSelectedProjectId) setSelectedProjectId(req.id);
                      setCurrentView('project-detail');
                    }}
                    className="flex-1 md:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Inspect Client Brief
                  </button>

                  <button
                    onClick={() => handleAcceptProject(req.id)}
                    className="flex-1 md:flex-none px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Accept Invitation to Design
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal: Upload Deliverable (Concept Draft, 2D/3D Schematics, or Final Design Handover) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-sky-600" />
                Upload Architectural Deliverable
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDeliverable} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deliverable Stage
                </label>
                <select
                  value={deliverableForm.stage}
                  onChange={(e) => {
                    const stg = e.target.value;
                    let defaultTitle = '2D Floor Plan & Spatial Flow v1';
                    if (stg === 'schematic_drawings') defaultTitle = '3D Photometric Light Study & Elevations';
                    if (stg === 'final_delivery') defaultTitle = 'Complete Final Architectural Blueprints Package (PDF + CAD)';
                    setDeliverableForm({ ...deliverableForm, stage: stg, title: defaultTitle });
                  }}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="concept_draft">Stage 3: Concept Draft (Floorplan & Spatial Layout)</option>
                  <option value="schematic_drawings">Stage 3: 3D Schematics & Daylight Study</option>
                  <option value="final_delivery">Stage 5: Final Delivery (Permit Blueprints & Handover)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deliverable Title
                </label>
                <input
                  type="text"
                  value={deliverableForm.title}
                  onChange={(e) => setDeliverableForm({ ...deliverableForm, title: e.target.value })}
                  placeholder="e.g. 2D Floor Plan with L-Shaped Staircase"
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Blueprint / Render Image URL
                </label>
                <input
                  type="text"
                  value={deliverableForm.file_url}
                  onChange={(e) => setDeliverableForm({ ...deliverableForm, file_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  The client will be able to inspect this in full-screen and click to place pinpoint feedback pins.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Architect's Plain-Language Note to Client
                </label>
                <textarea
                  value={deliverableForm.description}
                  onChange={(e) => setDeliverableForm({ ...deliverableForm, description: e.target.value })}
                  rows={3}
                  placeholder="Explain what has been updated based on their requests..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  {uploading ? 'Publishing...' : 'Publish Deliverable to Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Portfolio Manager Modal (Add / Edit / Delete Portfolio Items) */}
      <PortfolioManagerModal
        isOpen={showPortfolioModal}
        onClose={() => setShowPortfolioModal(false)}
        onRefresh={fetchDesignerProjects}
      />

    </div>
  );
}
