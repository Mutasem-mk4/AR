
import React from 'react';
import { Utensils, Zap, QrCode, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onNavigateAdmin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateAdmin }) => {
  return (
    <div className="bg-white min-h-screen text-slate-900">
      {/* Header */}
      <nav className="flex justify-between items-center px-8 py-6 border-b">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-orange-600">
          <Utensils className="w-8 h-8" />
          <span>SavoryAR</span>
        </div>
        <button 
          onClick={onNavigateAdmin}
          className="bg-orange-600 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-700 transition-colors"
        >
          Partner Portal
        </button>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 py-20 text-center">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
          Bring your menu to <span className="text-orange-600">life.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          Transform static menu photos into interactive WebAR experiences. 
          Let your customers see their food sizzling before they even order.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button 
            onClick={onNavigateAdmin}
            className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-800 transition-all transform hover:scale-105"
          >
            Create Your First AR Menu
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">No App Required</h3>
            <p className="text-slate-600 leading-relaxed">
              Customers simply scan a QR code and the AR magic happens right in their mobile browser.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <QrCode className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Dynamic QR Codes</h3>
            <p className="text-slate-600 leading-relaxed">
              Instantly generate unique QR codes for every dish. Link physical menus to immersive digital content.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Utensils className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Rich Overlays</h3>
            <p className="text-slate-600 leading-relaxed">
              Overlay 4K sizzling videos or high-fidelity 3D models directly on top of your menu images.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center border-t text-slate-400">
        <p>&copy; 2024 SavoryAR Platform. A New Era of Dining.</p>
      </footer>
    </div>
  );
};
