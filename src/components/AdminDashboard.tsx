
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
    if (password === '30363036') {
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
    downloadAnchorNode.setAttribute("download", `3geeks_database_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const notifyCharles = (req: ClientRequest) => {
    const message = `*New Lead — 3geeks*%0A%0A*Client:* ${req.clientName}%0A*Company:* ${req.clientCompany}%0A*Email:* ${req.clientEmail}%0A%0A*Package:* ${req.serviceName}%0A*Est:* ${req.totalEstimate}%0A*Maint:* ${req.hasMaintenance ? 'YES' : 'NO'}%0A%0A*Pref Date:* ${req.preferredDate ? new Date(req.preferredDate).toLocaleString() : 'Not specified'}%0A*Message:* ${req.message}`;
    window.open(`https://wa.me/33671618119?text=${message}`, '_blank');
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#08090d] flex flex-col items-center justify-center p-4">
         <div className="w-full max-w-md bg-[#0d1117] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-lime-300 to-cyan-400"></div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-mono">
                    <Lock className="w-6 h-6 text-cyan-300" />
                    3geeks Admin
                </h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="close">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
               <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 mb-2 uppercase tracking-wider">password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#161b22] border border-white/10 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none font-mono"
                    autoFocus
                    placeholder="••••••••"
                  />
               </div>
               {error && <p className="text-red-400 text-sm font-mono">// {error}</p>}
               <button type="submit" className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg font-mono font-bold transition-colors shadow-[0_0_24px_rgba(34,211,238,0.4)]">
                 $ access dashboard
               </button>
            </form>
         </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#08090d]/95 backdrop-blur-xl overflow-y-auto">
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3 font-mono">
              ~/requests <span className="bg-cyan-400/15 text-cyan-300 text-sm px-3 py-1 rounded-full font-mono">{requests.length}</span>
            </h1>
            <p className="text-slate-400 font-mono">// manage incoming leads and database</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={downloadDatabase}
              className="px-4 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white hover:bg-[#161b22] hover:border-cyan-400/40 transition-colors flex items-center gap-2 font-mono text-sm"
            >
              <Download className="w-4 h-4" /> export.json
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-white hover:bg-[#161b22] transition-colors font-mono text-sm"
            >
              exit
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          {requests.length === 0 ? (
            <div className="text-center py-20 bg-[#0d1117]/60 rounded-2xl border border-white/5 border-dashed">
               <Mail className="w-12 h-12 text-slate-600 mx-auto mb-4" />
               <p className="text-slate-400 font-mono">// no requests received yet.</p>
               <p className="text-slate-500 text-sm mt-2 font-mono">// new bookings will appear here instantly.</p>
            </div>
          ) : (
            requests.slice().reverse().map((req) => (
              <div
                key={req.id}
                className={`bg-[#0d1117] border rounded-xl p-6 transition-all ${
                    req.status === 'new' ? 'border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.15)] relative overflow-hidden' : 'border-white/10'
                }`}
              >
                {req.status === 'new' && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400"></div>
                )}

                <div className="flex flex-col md:flex-row justify-between gap-6">
                   <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                         <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                            req.status === 'new' ? 'bg-cyan-400/15 text-cyan-300' :
                            req.status === 'contacted' ? 'bg-orange-500/20 text-orange-300' :
                            'bg-lime-400/15 text-lime-300'
                         }`}>
                           {req.status}
                         </span>
                         <span className="text-slate-400 text-sm flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" /> {new Date(req.date).toLocaleString()}
                         </span>
                         <span className="text-slate-500 text-xs font-mono">id: {req.id}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <h3 className="text-xl font-bold text-white font-mono">{req.clientName}</h3>
                           <p className="text-cyan-300 font-mono">{req.clientCompany}</p>
                           <a href={`mailto:${req.clientEmail}`} className="text-slate-400 text-sm hover:text-white underline decoration-slate-600 hover:decoration-white font-mono">{req.clientEmail}</a>
                        </div>
                        <div className="bg-[#161b22] p-3 rounded-lg border border-white/5">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-mono">// selected</p>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-white font-mono">{req.serviceName}</span>
                                <span className="font-mono text-lime-300 font-bold">{req.totalEstimate}</span>
                            </div>
                            {req.hasMaintenance && (
                            <div className="flex items-center gap-2 text-xs text-lime-300 mt-1 font-mono">
                                <ShieldCheck className="w-3 h-3" /> + maintenance
                            </div>
                            )}
                        </div>
                      </div>

                      <div className="bg-[#08090d]/70 p-4 rounded-lg border border-white/5">
                         <p className="text-sm text-slate-300 italic">"{req.message}"</p>
                         {req.preferredDate && (
                            <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-sm text-slate-200 font-mono">
                               <CalendarIcon />
                               <span className="text-slate-400">// preferred:</span>
                               <span className="font-bold text-white">{new Date(req.preferredDate).toLocaleString()}</span>
                            </div>
                         )}
                      </div>
                   </div>

                   <div className="flex md:flex-col justify-between md:justify-start gap-3 md:border-l border-white/5 md:pl-6 md:w-48 flex-shrink-0">

                      <button
                        onClick={() => notifyCharles(req)}
                        className="w-full px-4 py-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 rounded-lg text-sm font-mono font-bold transition-colors flex items-center justify-center gap-2 border border-[#25D366]/20"
                      >
                        <MessageCircle className="w-4 h-4" /> send to Charles
                      </button>

                      <div className="h-px bg-white/5 my-1 hidden md:block"></div>

                      {req.status !== 'contacted' && (
                        <button
                            onClick={() => onUpdateStatus(req.id, 'contacted')}
                            className="w-full px-4 py-2 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 rounded-lg text-sm font-mono transition-colors flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" /> mark contacted
                        </button>
                      )}

                      {req.status !== 'signed' && (
                        <button
                            onClick={() => onUpdateStatus(req.id, 'signed')}
                            className="w-full px-4 py-2 bg-lime-400/10 text-lime-300 hover:bg-lime-400/20 rounded-lg text-sm font-mono transition-colors flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-4 h-4" /> mark signed
                        </button>
                      )}

                      <button
                        onClick={() => onDelete(req.id)}
                        className="w-full px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-mono transition-colors flex items-center justify-center gap-2 mt-auto"
                      >
                        <Trash2 className="w-4 h-4" /> delete
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

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);

export default AdminDashboard;
