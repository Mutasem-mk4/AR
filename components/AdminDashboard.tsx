
import React, { useState } from 'react';
import { Plus, Trash2, QrCode as QrIcon, Image as ImageIcon, Video, X, ChevronLeft, Download } from 'lucide-react';
import { MenuItem } from '../types';
import { QRCodeSVG } from 'qrcode.react';

interface AdminDashboardProps {
  items: MenuItem[];
  onAddItem: (item: MenuItem) => void;
  onDeleteItem: (id: string) => void;
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ items, onAddItem, onDeleteItem, onBack }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedItemForQR, setSelectedItemForQR] = useState<MenuItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetImage: '',
    arVideo: ''
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'targetImage' | 'arVideo') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: MenuItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      description: formData.description,
      targetImageUrl: formData.targetImage,
      arVideoUrl: formData.arVideo,
      createdAt: Date.now()
    };
    onAddItem(newItem);
    setIsAdding(false);
    setFormData({ name: '', description: '', targetImage: '', arVideo: '' });
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-slate-900">Restaurant Menu Portal</h1>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-orange-700 transition-all shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add New Item
          </button>
        </header>

        {/* Item Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all group">
              <div className="h-48 relative overflow-hidden bg-slate-200">
                {item.targetImageUrl ? (
                  <img src={item.targetImageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                   <button 
                    onClick={() => setSelectedItemForQR(item)}
                    className="bg-white p-3 rounded-full text-slate-900 hover:scale-110 transition-transform"
                   >
                    <QrIcon className="w-6 h-6" />
                   </button>
                   <button 
                    onClick={() => onDeleteItem(item.id)}
                    className="bg-red-500 p-3 rounded-full text-white hover:scale-110 transition-transform"
                   >
                    <Trash2 className="w-6 h-6" />
                   </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{item.name}</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center">
                   <span className="text-xs text-slate-400">Created {new Date(item.createdAt).toLocaleDateString()}</span>
                   <a 
                    href={`#/view/${item.id}`} 
                    className="text-orange-600 font-bold text-sm hover:underline"
                    target="_blank"
                   >
                    Preview AR
                   </a>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && !isAdding && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-300 rounded-3xl">
              <div className="bg-slate-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Utensils className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">No items yet</h2>
              <p className="text-slate-500">Add your first menu item to start generating AR experiences.</p>
            </div>
          )}
        </div>

        {/* Add Modal */}
        {isAdding && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">New AR Menu Item</h2>
                  <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-100 rounded-full">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Item Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="e.g. Signature Truffle Burger"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none h-24"
                      placeholder="Describe the dish for your customers..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700">Target Image (Marker)</label>
                      <div className="relative group">
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          id="target-upload" 
                          onChange={(e) => handleFileUpload(e, 'targetImage')}
                        />
                        <label 
                          htmlFor="target-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-orange-400 transition-all"
                        >
                          {formData.targetImage ? (
                            <img src={formData.targetImage} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <>
                              <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                              <span className="text-xs font-medium text-slate-500">Photo of Menu Item</span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700">AR Content (Video)</label>
                      <div className="relative group">
                        <input 
                          type="file" 
                          accept="video/*" 
                          className="hidden" 
                          id="video-upload"
                          onChange={(e) => handleFileUpload(e, 'arVideo')}
                        />
                        <label 
                          htmlFor="video-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-orange-400 transition-all"
                        >
                          {formData.arVideo ? (
                            <div className="relative w-full h-full">
                               <video src={formData.arVideo} className="w-full h-full object-cover rounded-xl" />
                               <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                  <Video className="w-6 h-6 text-white" />
                               </div>
                            </div>
                          ) : (
                            <>
                              <Video className="w-8 h-8 text-slate-400 mb-2" />
                              <span className="text-xs font-medium text-slate-500">Sizzling Video</span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-orange-700 transition-all transform active:scale-95"
                    >
                      Compile & Generate
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4">
                      Our system will automatically generate tracking markers and QR codes.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* QR Modal */}
        {selectedItemForQR && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Menu QR Code</h2>
                <button onClick={() => setSelectedItemForQR(null)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-2xl mb-6 inline-block border border-slate-100">
                <QRCodeSVG 
                  value={`${window.location.origin}${window.location.pathname}#/view/${selectedItemForQR.id}`} 
                  size={200}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: "https://cdn-icons-png.flaticon.com/512/2927/2927347.png",
                    x: undefined,
                    y: undefined,
                    height: 24,
                    width: 24,
                    excavate: true,
                  }}
                />
              </div>

              <h3 className="font-bold text-lg mb-1">{selectedItemForQR.name}</h3>
              <p className="text-sm text-slate-500 mb-6">Display this next to the item on your printed menu.</p>
              
              <div className="flex gap-3">
                 <button 
                  onClick={() => window.print()}
                  className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                 >
                   <Download className="w-4 h-4" />
                   Download
                 </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Internal icon dependency helper
const Utensils = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
);
