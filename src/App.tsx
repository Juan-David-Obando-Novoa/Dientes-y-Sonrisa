import React, { useState } from 'react';
import { Header } from './components/Header';
import { CodeExplorer } from './components/CodeExplorer';
import { WhatsAppSimulator } from './components/WhatsAppSimulator';
import { WebhookTester } from './components/WebhookTester';
import { ArchitectureVisualizer } from './components/ArchitectureVisualizer';
import { KnowledgeBaseInspector } from './components/KnowledgeBaseInspector';
import { BACKEND_FILES } from './data/backendFiles';
import { Download, X, FileCode, Check, Copy, Sparkles, FolderArchive } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'code' | 'simulator' | 'webhook' | 'architecture' | 'knowledge'>('code');
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const handleDownloadAllIndividualFiles = () => {
    BACKEND_FILES.forEach(file => {
      const blob = new Blob([file.code], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  const handleCopyConsolidatedCode = () => {
    let combined = `# ==========================================================\n`;
    combined += `# DIENTES Y SONRISA ODONTOLOGÍA LÁSER - BACKEND COMPLETO\n`;
    combined += `# Clean Architecture | FastAPI | RAG | Meta WhatsApp Webhook\n`;
    combined += `# ==========================================================\n\n`;

    BACKEND_FILES.forEach(f => {
      combined += `# ==========================================================\n`;
      combined += `# ARCHIVO: ${f.path}\n`;
      combined += `# DESC: ${f.description}\n`;
      combined += `# ==========================================================\n\n`;
      combined += f.code + `\n\n\n`;
    });

    navigator.clipboard.writeText(combined);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-950 flex flex-col">
      
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadAll={() => setShowDownloadModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'code' && <CodeExplorer onDownloadAll={() => setShowDownloadModal(true)} />}
        {activeTab === 'simulator' && <WhatsAppSimulator />}
        {activeTab === 'webhook' && <WebhookTester />}
        {activeTab === 'architecture' && <ArchitectureVisualizer />}
        {activeTab === 'knowledge' && <KnowledgeBaseInspector />}
      </main>

      {/* Download / Export Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setShowDownloadModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                <FolderArchive className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Exportar Backend Completo (6 Entregables + Clean Architecture)
                </h3>
                <p className="text-xs text-slate-400">
                  Dientes y Sonrisa Odontología Láser — WhatsApp Bot Backend
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
              <span className="font-semibold text-teal-300 block">Archivos incluidos en la descarga:</span>
              <ul className="grid grid-cols-2 gap-1.5 font-mono text-[11px] text-slate-400">
                <li>✓ requirements.txt</li>
                <li>✓ main.py</li>
                <li>✓ app/api/routes/webhook.py</li>
                <li>✓ app/services/bot_logic.py</li>
                <li>✓ app/services/rag_service.py</li>
                <li>✓ Dockerfile</li>
                <li>✓ app/core/config.py</li>
                <li>✓ app/db/database.py & models.py</li>
                <li>✓ README_DEPLOY.md & .env.example</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleDownloadAllIndividualFiles}
                className="py-3 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Descargar {BACKEND_FILES.length} Archivos Individualmente
              </button>

              <button
                onClick={handleCopyConsolidatedCode}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedAll ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                {copiedAll ? "¡Todo Copiado al Portapapeles!" : "Copiar Todo en 1 Solo Script"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
        Dientes y Sonrisa Odontología Láser • Clean Architecture Backend con FastAPI, Gemini RAG & Google Cloud Run
      </footer>

    </div>
  );
}
