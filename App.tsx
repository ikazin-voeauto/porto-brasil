
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
import MobileNav from './components/MobileNav';
import Login from './components/Login';
import SystemAccess from './components/SystemAccess';
import DefectEntryModal from './components/DefectEntryModal';

const App: React.FC = () => {
  const [isSystemUnlocked, setIsSystemUnlocked] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<ViewType>('DASHBOARD');
  const [cells, setCells] = useState<ProductionCell[]>(MOCK_CELLS);
  const [selectedCell, setSelectedCell] = useState<ProductionCell | null>(null);
  const [isDefectModalOpen, setIsDefectModalOpen] = useState(false);
  const [selectedCellForDefect, setSelectedCellForDefect] = useState<ProductionCell | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial load after login
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Simulate real-time updates
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      setCells(prev => prev.map(cell => {
        if (cell.status === 'OPERATIONAL' && Math.random() > 0.8) {
          return {
            ...cell,
            unitsProduced: Math.min(cell.targetUnits, cell.unitsProduced + Math.floor(Math.random() * 3)),
            temperature: cell.temperature + (Math.random() - 0.5) * 2
          };
        }
        return cell;
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleCellClick = (cell: ProductionCell) => {
    setSelectedCell(cell);
    setCurrentView('OPERATOR');
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
            const cell = cells.find(c => c.id === cellId);
            if (cell) {
              setSelectedCellForDefect(cell);
              setIsDefectModalOpen(true);
            }
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
    <div className="flex h-screen bg-pb-black overflow-hidden font-sans text-pb-white">
      {/* Desktop Sidebar - Hidden on Mobile */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar
          currentView={currentView}
          setView={setCurrentView}
          onLogout={handleLogout}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header - Adjusted for Mobile */}
        {currentView !== 'OPERATOR' && <Header currentView={currentView} />}

        <main className={`flex-1 overflow-y-auto relative ${currentView === 'OPERATOR' ? '' : 'pb-24 md:pb-12'}`}>
          {renderContent()}
        </main>

        {/* Footer - Hidden on Mobile to save space/avoid clutter */}
        {currentView !== 'OPERATOR' && (
          <div className="hidden md:block">
            <Footer />
          </div>
        )}

        {/* Mobile Navigation - Visible only on Mobile */}
        {currentView !== 'OPERATOR' && (
          <MobileNav currentView={currentView} setView={setCurrentView} />
        )}
      </div>

      {selectedCell && currentView !== 'OPERATOR' && (
        <CellDetail
          cell={selectedCell}
          onClose={() => setSelectedCell(null)}
        />
      )}

      <DefectEntryModal
        isOpen={isDefectModalOpen}
        onClose={() => setIsDefectModalOpen(false)}
        onConfirm={(type, value) => {
          if (selectedCellForDefect) {
            setCells(prev => prev.map(c => {
              if (c.id !== selectedCellForDefect.id) return c;

              if (type === 'PRODUCT') {
                return { ...c, badPieces: c.badPieces + (value as number) };
              } else {
                return {
                  ...c,
                  status: 'WARNING', // Or STOPPED, depending on business logic
                  lastFault: value as string
                };
              }
            }));
          }
          setIsDefectModalOpen(false);
          setSelectedCellForDefect(null);
        }}
        cellName={selectedCellForDefect?.name || ''}
      />
    </div>
  );
};

export default App;
