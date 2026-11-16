import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import VisionBuilderPage from './pages/VisionBuilderPage';
import DesignersPage from './pages/DesignersPage';
import DesignerDetailPage from './pages/DesignerDetailPage';
import PortfoliosPage from './pages/PortfoliosPage';
import CustomerDashboard from './pages/CustomerDashboard';
import DesignerDashboard from './pages/DesignerDashboard';
import ProjectDetailPage from './pages/ProjectDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function AppContent() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [selectedProjectId, setSelectedProjectId] = useState(1);
  const [selectedDesignerId, setSelectedDesignerId] = useState(1);
  const [preselectedDesignerId, setPreselectedDesignerId] = useState(null);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomePage
            setCurrentView={setCurrentView}
            setSelectedDesignerId={setSelectedDesignerId}
          />
        );

      case 'vision-builder':
        return (
          <VisionBuilderPage
            setCurrentView={setCurrentView}
            setSelectedProjectId={setSelectedProjectId}
            preselectedDesignerId={preselectedDesignerId}
          />
        );

      case 'designers':
        return (
          <DesignersPage
            setCurrentView={setCurrentView}
            setSelectedDesignerId={setSelectedDesignerId}
            setPreselectedDesignerId={setPreselectedDesignerId}
          />
        );

      case 'designer-detail':
        return (
          <DesignerDetailPage
            designerId={selectedDesignerId}
            setCurrentView={setCurrentView}
            setPreselectedDesignerId={setPreselectedDesignerId}
          />
        );

      case 'portfolios':
        return (
          <PortfoliosPage
            setCurrentView={setCurrentView}
            setSelectedDesignerId={setSelectedDesignerId}
            setPreselectedDesignerId={setPreselectedDesignerId}
          />
        );

      case 'customer-dashboard':
        return (
          <CustomerDashboard
            setCurrentView={setCurrentView}
            setSelectedProjectId={setSelectedProjectId}
          />
        );

      case 'designer-dashboard':
        return (
          <DesignerDashboard
            setCurrentView={setCurrentView}
            setSelectedProjectId={setSelectedProjectId}
          />
        );

      case 'project-detail':
        return (
          <ProjectDetailPage
            projectId={selectedProjectId}
            setCurrentView={setCurrentView}
          />
        );

      case 'login':
        return <LoginPage setCurrentView={setCurrentView} />;

      case 'register':
        return <RegisterPage setCurrentView={setCurrentView} />;

      default:
        return (
          <HomePage
            setCurrentView={setCurrentView}
            setSelectedDesignerId={setSelectedDesignerId}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-sky-500 selection:text-white">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      <Footer setCurrentView={setCurrentView} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </AuthProvider>
  );
}
