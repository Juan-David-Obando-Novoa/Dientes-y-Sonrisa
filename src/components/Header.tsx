import React from 'react';
import { 
  Code2, 
  Bot, 
  Webhook, 
  Network, 
  Database, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  Download
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'code' | 'simulator' | 'webhook' | 'architecture' | 'knowledge';
  setActiveTab: (tab: 'code' | 'simulator' | 'webhook' | 'architecture' | 'knowledge') => void;
  onDownloadAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onDownloadAll }) => {
  return (
    <header className="border-b border-teal-900/30 bg-slate-950 text-slate-100 sticky top-0 z-50 shadow-lg backdrop-blur-md bg-slate-950/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Clinic Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shadow-md shadow-teal-500/20">
              <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-base sm:text-lg text-white tracking-tight">
                  Dientes y Sonrisa
                </h1>
                <span className="bg-teal-500/10 text-teal-300 text-xs px-2 py-0.5 rounded-full border border-teal-500/30 font-medium hidden sm:inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-teal-400" />
                  RAG & FastAPI Backend
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Backend WhatsApp Business Bot con Odontología Láser
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={onDownloadAll}
              className="px-3.5 py-1.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white text-xs font-semibold rounded-lg shadow-md hover:shadow-teal-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar Entregables (.ZIP / Código)
            </button>
            <a
              href="#deploy-guide"
              onClick={() => setActiveTab('code')}
              className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
              GCP Cloud Run
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 sm:space-x-2 border-t border-slate-800/80 overflow-x-auto py-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'code'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4 text-teal-400" />
            Código & Entregables (6 Archivos)
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            Simulador de Bot WhatsApp (RAG Live)
          </button>

          <button
            onClick={() => setActiveTab('webhook')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'webhook'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Webhook className="w-4 h-4 text-emerald-400" />
            Meta Webhook Tester (GET/POST)
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Network className="w-4 h-4 text-indigo-400" />
            Diagrama de Arquitectura
          </button>

          <button
            onClick={() => setActiveTab('knowledge')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'knowledge'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Database className="w-4 h-4 text-amber-400" />
            Base de Conocimiento RAG
          </button>
        </div>

      </div>
    </header>
  );
};
