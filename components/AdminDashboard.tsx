
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { ClientRequest } from '../types';
import { Trash2, CheckCircle, Mail, Clock, Lock, ShieldCheck, X, Download, MessageCircle, Send } from 'lucide-react';

interface AdminDashboardProps {
  requests: ClientRequest[];
  onUpdateStatus: (id: string, status: ClientRequest['status']) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  requests, 
  onUpdateStatus, 
  onDelete,
  onClose 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '30363036') { // Simple mock auth
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const downloadDatabase = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(requests, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `webgen_database_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const notifyCharles = (req: ClientRequest) => {
    const message = `🚀 *New Lead WebGen* 🚀%0A%0A👤 *Client:* ${req.clientName}%0A🏢 *Company:* ${req.clientCompany}%0A📧 *Email:* ${req.clientEmail}%0A%0A📦 *Package:* ${req.serviceName}%0A💰 *Est:* ${req.totalEstimate}%0A🛡 *Maint:* ${req.hasMaintenance ? 'YES' : 'NO'}%0A%0A📅 *Pref Date:* ${req.preferredDate ? new Date(req.preferredDate).toLocaleString() : 'Not specified'}%0A📝 *Message:* ${req.message}`;
    
    // Charles's number from the prompt
    window.open(`https://wa.me/33671618119?text=${message}`, '_blank');
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-4">
         <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500"></div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Lock className="w-6 h-6 text-indigo-500" />
                    WebGen Admin
                </h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white focus:border-indigo-500 outline-none"
                    autoFocus
                    placeholder="••••••••"
                  />
               </div>
               {error && <p className="text-red-400 text-sm">{error}</p>}
               <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
                 Access Dashboard
               </button>
            </form>
         </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl overflow-y-auto">
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              Request Database <span className="bg-indigo-500/20 text-indigo-300 text-sm px-3 py-1 rounded-full">{requests.length}</span>
            </h1>
            <p className="text-slate-400">Manage incoming leads and local database.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={downloadDatabase}
              className="px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export JSON
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white hover:bg-slate-700 transition-colors"
            >
              Exit
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          {requests.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-white/5 border-dashed">
               <Mail className="w-12 h-12 text-slate-600 mx-auto mb-4" />
               <p className="text-slate-400">No requests received yet.</p>
               <p className="text-slate-500 text-sm mt-2">New bookings will appear here instantly.</p>
            </div>
          ) : (
            requests.slice().reverse().map((req) => (
              <div 
                key={req.id} 
                className={`bg-slate-900 border rounded-xl p-6 transition-all ${
                    req.status === 'new' ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.1)] relative overflow-hidden' : 'border-white/10'
                }`}
              >
                {req.status === 'new' && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                )}

                <div className="flex flex-col md:flex-row justify-between gap-6">
                   {/* Left: Info */}
                   <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            req.status === 'new' ? 'bg-indigo-500/20 text-indigo-300' : 
                            req.status === 'contacted' ? 'bg-orange-500/20 text-orange-300' :
                            'bg-green-500/20 text-green-300'
                         }`}>
                           {req.status}
                         </span>
                         <span className="text-slate-400 text-sm flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {new Date(req.date).toLocaleString()}
                         </span>
                         <span className="text-slate-500 text-xs font-mono">ID: {req.id}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <h3 className="text-xl font-bold text-white">{req.clientName}</h3>
                           <p className="text-indigo-400 font-medium">{req.clientCompany}</p>
                           <a href={`mailto:${req.clientEmail}`} className="text-slate-400 text-sm hover:text-white underline decoration-slate-600 hover:decoration-white">{req.clientEmail}</a>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-white/5">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Selected Package</p>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-white">{req.serviceName}</span>
                                <span className="font-mono text-indigo-300 font-bold">{req.totalEstimate}</span>
                            </div>
                            {req.hasMaintenance && (
                            <div className="flex items-center gap-2 text-xs text-green-400 mt-1">
                                <ShieldCheck className="w-3 h-3" /> + Maintenance
                            </div>
                            )}
                        </div>
                      </div>

                      <div className="bg-slate-950/50 p-4 rounded-lg border border-white/5">
                         <p className="text-sm text-slate-300 italic">"{req.message}"</p>
                         {req.preferredDate && (
                            <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-sm text-slate-200">
                               <CalendarIcon />
                               <span className="text-slate-400">Preferred Availability:</span>
                               <span className="font-bold text-white">{new Date(req.preferredDate).toLocaleString()}</span>
                            </div>
                         )}
                      </div>
                   </div>

                   {/* Right: Actions */}
                   <div className="flex md:flex-col justify-between md:justify-start gap-3 md:border-l border-white/5 md:pl-6 md:w-48 flex-shrink-0">
                      
                      <button 
                        onClick={() => notifyCharles(req)}
                        className="w-full px-4 py-2 bg-[#00d757]/10 text-[#00d757] hover:bg-[#00d757]/20 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 border border-[#00d757]/20"
                      >
                        <MessageCircle className="w-4 h-4" /> Send to Charles
                      </button>

                      <div className="h-px bg-white/5 my-1 hidden md:block"></div>

                      {req.status !== 'contacted' && (
                        <button 
                            onClick={() => onUpdateStatus(req.id, 'contacted')}
                            className="w-full px-4 py-2 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" /> Mark Contacted
                        </button>
                      )}

                      {req.status !== 'signed' && (
                        <button 
                            onClick={() => onUpdateStatus(req.id, 'signed')}
                            className="w-full px-4 py-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-4 h-4" /> Mark Signed
                        </button>
                      )}
                      
                      <button 
                        onClick={() => onDelete(req.id)}
                        className="w-full px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 mt-auto"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Helper for calendar icon since lucide might not be imported in this scope if copy-pasted partially
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);

export default AdminDashboard;
