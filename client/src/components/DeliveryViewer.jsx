import React, { useState, useRef } from 'react';
import {
  MapPin,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Plus,
  Send,
  X,
  Maximize2,
  FileText
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function DeliveryViewer({ deliverable, projectId, onRefresh }) {
  const { user } = useAuth();
  const [activePin, setActivePin] = useState(null);
  const [newPinCoords, setNewPinCoords] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingPin, setSubmittingPin] = useState(null);
  const [submittingStatus, setSubmittingStatus] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const imageRef = useRef(null);

  if (!deliverable) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h4 className="font-bold text-slate-700">No Deliverable Selected</h4>
        <p className="text-xs text-slate-500 mt-1">Select a schematic or blueprint from the list to inspect.</p>
      </div>
    );
  }

  const handleImageClick = (e) => {
    // Only customer can place pinpoint revision notes
    if (user?.role !== 'customer') return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setNewPinCoords({ x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) });
    setActivePin(null);
  };

  const handleCreateRevision = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim() || !newPinCoords) return;

    setSubmittingPin(true);
    try {
      await api.addRevision(deliverable.id, {
        project_id: projectId,
        feedback_text: feedbackText,
        pin_x: newPinCoords.x,
        pin_y: newPinCoords.y
      });
      setFeedbackText('');
      setNewPinCoords(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to save revision note: ' + err.message);
    } finally {
      setSubmittingPin(false);
    }
  };

  const handleStatusChange = async (status) => {
    setSubmittingStatus(true);
    try {
      await api.updateDeliverableStatus(deliverable.id, status);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to update status: ' + err.message);
    } finally {
      setSubmittingStatus(false);
    }
  };

  const revisions = deliverable.revisions || [];

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden ${
      fullscreen ? 'fixed inset-4 z-50 overflow-y-auto' : ''
    }`}>
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-slate-900">{deliverable.title}</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              v{deliverable.version} • {deliverable.stage.replace(/_/g, ' ')}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              deliverable.status === 'approved'
                ? 'bg-emerald-100 text-emerald-800'
                : deliverable.status === 'revision_requested'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-sky-100 text-sky-800'
            }`}>
              {deliverable.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{deliverable.description}</p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
            title="Toggle Expanded View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {user?.role === 'customer' && deliverable.status !== 'approved' && (
            <div className="flex items-center gap-2">
              <button
                disabled={submittingStatus}
                onClick={() => handleStatusChange('approved')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Approve Schematic
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tip Banner for Customer */}
      {user?.role === 'customer' && (
        <div className="bg-sky-50 px-5 py-2.5 border-b border-sky-100 text-xs text-sky-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              <strong>Interactive Revision Mode:</strong> Click anywhere on the drawing below to drop a pinpoint marker and request adjustments!
            </span>
          </div>
          <span className="text-[10px] font-bold text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full">
            {revisions.length} active pins
          </span>
        </div>
      )}

      {/* Image Inspection Canvas */}
      <div className="relative bg-slate-900 select-none overflow-hidden flex items-center justify-center min-h-[380px] max-h-[620px]">
        <img
          ref={imageRef}
          src={deliverable.file_url}
          alt={deliverable.title}
          onClick={handleImageClick}
          className={`max-w-full max-h-[600px] object-contain transition-all ${
            user?.role === 'customer' ? 'cursor-crosshair' : 'cursor-default'
          }`}
        />

        {/* Existing Revision Pin Markers */}
        {revisions.map((rev, index) => {
          if (rev.pin_x === null || rev.pin_y === null) return null;
          const isSelected = activePin?.id === rev.id;

          return (
            <div
              key={rev.id || index}
              onClick={(e) => {
                e.stopPropagation();
                setActivePin(isSelected ? null : rev);
                setNewPinCoords(null);
              }}
              style={{ left: `${rev.pin_x}%`, top: `${rev.pin_y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 z-20 ${
                isSelected ? 'scale-125' : ''
              }`}
            >
              <div className="relative flex items-center justify-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ${
                  rev.status === 'addressed' ? 'bg-emerald-500' : 'bg-rose-500 ring-4 ring-rose-500/30 animate-bounce'
                }`}>
                  {index + 1}
                </div>
              </div>
            </div>
          );
        })}

        {/* New Pin Coordinate Indicator */}
        {newPinCoords && (
          <div
            style={{ left: `${newPinCoords.x}%`, top: `${newPinCoords.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
          >
            <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-bold shadow-xl ring-4 ring-sky-300 animate-pulse">
              <Plus className="w-5 h-5" />
            </div>
          </div>
        )}

        {/* Active Pin Detail Popup */}
        {activePin && (
          <div
            style={{
              left: `${Math.min(80, Math.max(20, activePin.pin_x))}%`,
              top: `${Math.min(80, Math.max(20, activePin.pin_y))}%`
            }}
            className="absolute z-40 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 w-72 -translate-x-1/2 -translate-y-full mb-3 text-slate-800 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-xs text-rose-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Revision Annotation
              </span>
              <button onClick={() => setActivePin(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-700 mt-2 font-medium leading-relaxed">
              "{activePin.feedback_text}"
            </p>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>By {activePin.customer_name || 'Client'}</span>
              <span className="capitalize font-semibold text-rose-600">{activePin.status}</span>
            </div>
          </div>
        )}

        {/* New Pin Annotation Submission Modal */}
        {newPinCoords && (
          <div className="absolute inset-x-4 bottom-4 z-40 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-sky-300 max-w-lg mx-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-sky-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-600" />
                Add Pinpoint Revision Note at ({newPinCoords.x}%, {newPinCoords.y}%)
              </span>
              <button onClick={() => setNewPinCoords(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateRevision} className="mt-3">
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Explain the desired adjustment (e.g., 'Expand this window to 12ft for more morning sunlight', 'Add acoustic door here')..."
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                rows={3}
                required
                autoFocus
              />
              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setNewPinCoords(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPin}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Drop Pin & Submit Note
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Revision Pins List Below Image */}
      {revisions.length > 0 && (
        <div className="p-5 bg-slate-50/70 border-t border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-500" />
            Revision Feedback Log ({revisions.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {revisions.map((rev, idx) => (
              <div
                key={rev.id || idx}
                onClick={() => setActivePin(rev)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  activePin?.id === rev.id
                    ? 'bg-sky-50 border-sky-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    Annotation #{idx + 1}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {new Date(rev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed pl-6.5">
                  "{rev.feedback_text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
