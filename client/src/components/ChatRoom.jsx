import React, { useState, useEffect, useRef } from 'react';
import { Send, Image, Sparkles, User, Paperclip, BookOpen, Layers } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export default function ChatRoom({
  projectId,
  otherPartyName = 'Collaborator',
  otherPartyRole = 'Designer',
  onSwitchTab,
  onOpenGuide
}) {
  const { user } = useAuth();
  const { socket, connected, joinProject, leaveProject, sendTyping } = useSocket();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [typingUser, setTypingUser] = useState(null);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Load message history & join project room
  useEffect(() => {
    async function loadMessages() {
      try {
        const data = await api.getMessages(projectId);
        setMessages(data);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    }

    if (projectId) {
      loadMessages();
      joinProject(projectId);
    }

    return () => {
      if (projectId) {
        leaveProject(projectId);
      }
    };
  }, [projectId]);

  // Socket event listeners for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (msg.project_id === Number(projectId)) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleUserTyping = ({ userName, isTyping }) => {
      if (isTyping) {
        setTypingUser(userName);
      } else {
        setTypingUser(null);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
    };
  }, [socket, projectId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    sendTyping(projectId, true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(projectId, false);
    }, 1500);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    setSending(true);
    sendTyping(projectId, false);
    try {
      await api.sendMessage(projectId, { message_text: inputText.trim() });
      setInputText('');
    } catch (err) {
      console.error('Send message failed:', err);
      alert('Could not send message: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  const quickPrompts = user?.role === 'customer'
    ? [
        'Could you share options for the staircase style?',
        'I have selected my preferred design in the Design Choices tab!',
        'Can we review the natural daylight in the morning?',
        'Does this schematic meet standard municipal setback codes?',
        'Could you explain this floor plan in simpler terms?'
      ]
    : [
        'I have shared staircase & style options in the Design Choices tab.',
        'I reviewed your brief and updated the concept floor plan.',
        'We can easily expand this door frame with a steel header.',
        'Uploading the latest high-resolution 3D light study now.',
        'Ready for your review on the concept schematics!'
      ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col h-[560px] overflow-hidden">
      
      {/* Chat Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
            {otherPartyName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-800">{otherPartyName}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                {otherPartyRole}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
              {connected ? 'Real-time WebSocket Active' : 'Connecting...'}
            </p>
          </div>
        </div>

        {/* Quick Jump Action Pills */}
        <div className="flex items-center gap-2">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 text-xs font-bold transition-colors shadow-sm"
              title="Open Visual Guide for Staircases, Roofs & Layouts"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">Visual Guide</span>
            </button>
          )}

          {onSwitchTab && (
            <button
              onClick={() => onSwitchTab('proposals')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-xs font-bold transition-colors shadow-sm"
              title="View & Select Design Choices"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Design Choices</span>
            </button>
          )}
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <Sparkles className="w-8 h-8 text-sky-400 mb-2" />
            <p className="text-xs font-bold text-slate-600">Start the conversation</p>
            <p className="text-[11px] max-w-xs mt-1">
              Ask questions, discuss architectural nuances, or request immediate schematic adjustments.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender_id === user?.id;

            return (
              <div
                key={msg.id || index}
                className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <img
                    src={msg.sender_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'}
                    alt={msg.sender_name}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                )}

                <div className={`max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-sm text-xs ${
                  isMe
                    ? 'bg-sky-600 text-white rounded-br-none'
                    : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-none'
                }`}>
                  {!isMe && (
                    <div className="text-[10px] font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                      <span>{msg.sender_name}</span>
                      <span className="capitalize text-sky-600">({msg.sender_role})</span>
                    </div>
                  )}

                  <p className="leading-relaxed whitespace-pre-wrap">{msg.message_text}</p>

                  {msg.attachment_url && (
                    <div className="mt-2 pt-2 border-t border-white/20">
                      <a
                        href={msg.attachment_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] underline font-medium flex items-center gap-1"
                      >
                        <Paperclip className="w-3.5 h-3.5" /> View Attached File
                      </a>
                    </div>
                  )}

                  <div className={`text-[9px] mt-1 text-right ${isMe ? 'text-sky-200' : 'text-slate-400'}`}>
                    {new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {isMe && (
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                    alt="Me"
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                )}
              </div>
            );
          })
        )}

        {/* Live typing indicator */}
        {typingUser && (
          <div className="flex items-center gap-2 text-xs text-slate-500 italic">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
            <span>{typingUser} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="px-4 py-2 bg-slate-100/60 border-t border-slate-200/60 overflow-x-auto whitespace-nowrap flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Prompts:</span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => setInputText(prompt)}
            className="text-[11px] bg-white hover:bg-sky-50 hover:text-sky-700 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 shrink-0 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder={`Message ${otherPartyName}...`}
          className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || sending}
          className="p-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white rounded-xl shadow-sm transition-all flex items-center justify-center shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
