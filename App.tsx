
import React, { useState, useEffect } from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { ARViewer } from './components/ARViewer';
import { LandingPage } from './components/LandingPage';
import { MenuItem } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<{ mode: 'LANDING' | 'ADMIN' | 'VIEWER'; itemId?: string }>({ mode: 'LANDING' });
  const [items, setItems] = useState<MenuItem[]>([]);

  // Load items from "database" (localStorage)
  useEffect(() => {
    const saved = localStorage.getItem('savory_ar_items');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savory_ar_items', JSON.stringify(items));
  }, [items]);

  // Handle Hash Routing (simulated for the environment)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/view/')) {
        const id = hash.replace('#/view/', '');
        setView({ mode: 'VIEWER', itemId: id });
      } else if (hash === '#/admin') {
        setView({ mode: 'ADMIN' });
      } else {
        setView({ mode: 'LANDING' });
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash(); // Initial check

    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (mode: 'LANDING' | 'ADMIN' | 'VIEWER', itemId?: string) => {
    if (mode === 'VIEWER' && itemId) {
      window.location.hash = `#/view/${itemId}`;
    } else if (mode === 'ADMIN') {
      window.location.hash = '#/admin';
    } else {
      window.location.hash = '';
    }
  };

  const addItem = (item: MenuItem) => {
    setItems(prev => [item, ...prev]);
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="min-h-screen">
      {view.mode === 'LANDING' && (
        <LandingPage onNavigateAdmin={() => navigateTo('ADMIN')} />
      )}
      
      {view.mode === 'ADMIN' && (
        <AdminDashboard 
          items={items} 
          onAddItem={addItem} 
          onDeleteItem={deleteItem}
          onBack={() => navigateTo('LANDING')}
        />
      )}

      {view.mode === 'VIEWER' && view.itemId && (
        <ARViewer 
          itemId={view.itemId} 
          items={items}
          onExit={() => navigateTo('LANDING')}
        />
      )}
    </div>
  );
};

export default App;
