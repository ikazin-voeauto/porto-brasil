
import React, { useState, useEffect } from 'react';
import { ViewType, ProductionCell } from './types';
import { MOCK_CELLS } from './data';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CellsGrid from './components/CellsGrid';
import CellDetail from './components/CellDetail';
import MobileCounter from './components/MobileCounter';
import ProductionHistory from './components/ProductionHistory';
import AlertsHistory from './components/AlertsHistory';
import Footer from './components/Footer';
import Login from './components/Login';
import SystemAccess from './components/SystemAccess';

const App: React.FC = () => {
  const [isSystemUnlocked, setIsSystemUnlocked] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<ViewType>('DASHBOARD');
  const [cells, setCells] = useState<ProductionCell[]>(MOCK_CELLS);
  const [selectedCell, setSelectedCell] = useState<ProductionCell | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial load after login
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Real-time updates from Backend
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/cells');
        if (response.ok) {
          const data = await response.json();
          setCells(data);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Initial fetch
    fetchData();

    // Poll every 2 seconds
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleCellClick = (cell: ProductionCell) => {
    setSelectedCell(cell);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('DASHBOARD');
  };

  const renderContent = () => {
    if (isLoading && isAuthenticated) {
      return (
        <div className="flex-1 flex items-center justify-center bg-pb-offWhite">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-ind-ok border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-pb-black font-bold tracking-widest uppercase text-sm">Sincronizando Dados Industriais...</p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard cells={cells} onCellClick={handleCellClick} />;
      case 'CELLS':
        return <CellsGrid cells={cells} onCellClick={handleCellClick} />;
      case 'OPERATOR':
        return <MobileCounter
          cells={cells}
          selectedCellId={selectedCell?.id}
          onCellChange={(cellId) => {
            const cell = cells.find(c => c.id === cellId);
            if (cell) setSelectedCell(cell);
          }}
          onIncrement={(cellId, amount = 1) => {
            setCells(prev => prev.map(c =>
              c.id === cellId
                ? { ...c, unitsProduced: Math.min(c.targetUnits, c.unitsProduced + amount) }
                : c
            ));
          }}
          onReportDefect={(cellId) => {
            console.log('Reportar defeito:', cellId);
            // Aqui pode abrir modal de reportar defeito
          }}
          onToggleStatus={(cellId) => {
            setCells(prev => prev.map(c =>
              c.id === cellId
                ? { ...c, status: c.status === 'OPERATIONAL' ? 'STOPPED' : 'OPERATIONAL' }
                : c
            ));
          }}
          onBack={() => setCurrentView('DASHBOARD')}
        />;
      case 'ANALYTICS':
        return <ProductionHistory />;
      case 'ALERTS':
        return <AlertsHistory alerts={[]} />;
      default:
        return <Dashboard cells={cells} onCellClick={handleCellClick} />;
    }
  };

  if (!isSystemUnlocked) {
    return <SystemAccess onUnlock={() => setIsSystemUnlocked(true)} />;
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-pb-offWhite overflow-hidden font-sans text-pb-black">
      <Sidebar
        currentView={currentView}
        setView={setCurrentView}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {currentView !== 'OPERATOR' && <Header currentView={currentView} />}

        <main className={`flex-1 overflow-y-auto relative ${currentView === 'OPERATOR' ? '' : 'pb-12'}`}>
          {renderContent()}
        </main>

        {currentView !== 'OPERATOR' && <Footer />}
      </div>

      {selectedCell && (
        <CellDetail
          cell={selectedCell}
          onClose={() => setSelectedCell(null)}
        />
      )}
    </div>
  );
};

export default App;
