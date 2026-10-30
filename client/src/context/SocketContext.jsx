import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Connect to server (using window.location origin or localhost:5000)
    const socketInstance = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketInstance.on('connect', () => {
      console.log('[Socket] Connected to server, id:', socketInstance.id);
      setConnected(true);

      if (user?.id) {
        socketInstance.emit('join_user', user.id);
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('[Socket] Disconnected from server');
      setConnected(false);
    });

    // Global notifications
    socketInstance.on('unread_notification', (data) => {
      setNotifications(prev => [
        { id: Date.now(), text: `New message from ${data.senderName} on "${data.projectTitle}"`, time: new Date() },
        ...prev.slice(0, 8)
      ]);
    });

    socketInstance.on('deliverable_ready', (data) => {
      setNotifications(prev => [
        { id: Date.now(), text: `New deliverable ready: "${data.title}"`, time: new Date() },
        ...prev.slice(0, 8)
      ]);
    });

    socketInstance.on('new_project_request', (data) => {
      setNotifications(prev => [
        { id: Date.now(), text: `New vision request received: "${data.title}" from ${data.customerName}`, time: new Date() },
        ...prev.slice(0, 8)
      ]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user?.id]);

  const joinProject = (projectId) => {
    if (socket && connected) {
      socket.emit('join_project', projectId);
    }
  };

  const leaveProject = (projectId) => {
    if (socket && connected) {
      socket.emit('leave_project', projectId);
    }
  };

  const sendTyping = (projectId, isTyping) => {
    if (socket && connected && user) {
      socket.emit('typing', { projectId, userName: user.name, isTyping });
    }
  };

  return (
    <SocketContext.Provider value={{ socket, connected, notifications, joinProject, leaveProject, sendTyping }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
