import React, { useState } from 'react';
import { BACKEND_FILES, CodeFile } from '../data/backendFiles';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Search, 
  FolderTree, 
  Terminal, 
  Sparkles, 
  Info,
  Server,
  Layers,
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface CodeExplorerProps {
  onDownloadAll: () => void;
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({ onDownloadAll }) => {
  const [selectedFileId, setSelectedFileId] = useState<string>("main_py");
  const [copied, setCopied] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const selectedFile = BACKEND_FILES.find(f => f.id === selectedFileId) || BACKEND_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = (file: CodeFile) => {
    const blob = new Blob([file.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredFiles = BACKEND_FILES.filter(file => {
    const matchesSearch = file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          file.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          file.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || file.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const mandatoryFileIds = ["req_txt", "main_py", "webhook_py", "bot_logic_py", "rag_service_py", "dockerfile"];

  return (
    <div className="space-y-6">
      
      {/* Banner Summary of Deliverables */}
      <div className="bg-slate-900 border border-teal-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-teal-500/20 text-teal-300 text-xs px-2.5 py-1 rounded-full border border-teal-500/40 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                Arquitectura Clean Architecture Completa
              </span>
              <span className="bg-cyan-500/10 text-cyan-300 text-xs px-2.5 py-1 rounded-full border border-cyan-500/30 font-medium">
                Python 3.11 + FastAPI + RAG + GCP
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
              Entregables del Backend para WhatsApp Bot (Dientes y Sonrisa)
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Código fuente profesional estructurado con separación limpia en carpetas (<code className="text-teal-300 bg-slate-950 px-1 py-0.5 rounded">core</code>, <code className="text-teal-300 bg-slate-950 px-1 py-0.5 rounded">api</code>, <code className="text-teal-300 bg-slate-950 px-1 py-0.5 rounded">services</code>, <code className="text-teal-300 bg-slate-950 px-1 py-0.5 rounded">db</code>, <code className="text-teal-300 bg-slate-950 px-1 py-0.5 rounded">models</code>) listo para desplegar en Google Cloud Run.
            </p>
          </div>

          <button
            onClick={onDownloadAll}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Descargar Todos los Archivos (.ZIP)
          </button>
        </div>

        {/* Quick Badges of Mandatory Requested Files */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-2 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-teal-400" />
            6 Entregables Solicitados:
          </span>
          {mandatoryFileIds.map(id => {
            const f = BACKEND_FILES.find(file => file.id === id);
            if (!f) return null;
            return (
              <button
                key={id}
                onClick={() => setSelectedFileId(id)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all cursor-pointer ${
                  selectedFileId === id
                    ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold shadow-md shadow-teal-500/20'
                    : 'bg-slate-950/80 text-teal-300 border-teal-900/50 hover:border-teal-500/50'
                }`}
              >
                {f.filename}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Code Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar File Tree */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col h-[680px]">
          
          {/* Search Box */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar archivo o módulo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1 mb-3 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'core', label: 'Core' },
              { id: 'api', label: 'API' },
              { id: 'services', label: 'Services' },
              { id: 'db', label: 'Database' },
              { id: 'deploy', label: 'Deploy' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950/50 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between px-1">
            <span className="flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-teal-400" />
              Estructura de Proyecto
            </span>
            <span className="text-[10px] text-slate-500">{filteredFiles.length} archivos</span>
          </div>

          {/* File List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            {filteredFiles.map((file) => {
              const isSelected = file.id === selectedFileId;
              const isMandatory = mandatoryFileIds.includes(file.id);

              return (
                <button
                  key={file.id}
                  onClick={() => setSelectedFileId(file.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start space-x-3 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-teal-500/60 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <FileCode className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-teal-400' : 'text-slate-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold truncate text-slate-200">
                        {file.filename}
                      </span>
                      {isMandatory && (
                        <span className="text-[9px] bg-teal-500/20 text-teal-300 px-1.5 py-0.2 rounded font-semibold border border-teal-500/30 shrink-0 ml-1">
                          Requerido
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[10px] text-slate-500 truncate mt-0.5">
                      {file.path}
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 leading-tight">
                      {file.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[680px] overflow-hidden shadow-2xl">
          
          {/* File Header Bar */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold text-teal-300">
                  {selectedFile.path}
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                  {selectedFile.language.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedFile.description}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                {copied ? "¡Copiado!" : "Copiar Código"}
              </button>

              <button
                onClick={() => handleDownloadSingle(selectedFile)}
                className="px-3 py-1.5 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 text-xs font-medium rounded-lg border border-teal-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-teal-400" />
                Descargar {selectedFile.filename}
              </button>
            </div>
          </div>

          {/* Code Viewer Container */}
          <div className="flex-1 overflow-auto bg-[#0d1117] p-4 font-mono text-xs text-slate-200 leading-relaxed custom-scrollbar">
            <pre className="whitespace-pre">
              <code>{selectedFile.code}</code>
            </pre>
          </div>

          {/* Code Footer Info */}
          <div className="bg-slate-950 px-4 py-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-teal-400" />
              Clean Architecture / Dientes y Sonrisa Odontología Láser
            </span>
            <span>{selectedFile.code.split('\n').length} líneas de código</span>
          </div>
        </div>

      </div>

      {/* Deployment Quick Reference Section */}
      <div id="deploy-guide" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
            <Server className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Comando Rápido de Despliegue en GCP Cloud Run</h3>
            <p className="text-xs text-slate-400">Ejecuta este comando en tu terminal para compilar el Dockerfile y desplegar en Cloud Run:</p>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-teal-300 overflow-x-auto relative group">
          <pre>
{`gcloud run deploy dientes-whatsapp-bot \\
    --image us-central1-docker.pkg.dev/dientes-sonrisa-bot/dientes-repo/whatsapp-bot:v1 \\
    --platform managed \\
    --region us-central1 \\
    --allow-unauthenticated \\
    --port 8080 \\
    --set-env-vars ENVIRONMENT=production,META_VERIFY_TOKEN=MI_TOKEN_SECRETO_DIENTES_Y_SONRISA \\
    --set-secrets GEMINI_API_KEY=GEMINI_KEY_SECRET:latest,META_ACCESS_TOKEN=META_TOKEN_SECRET:latest`}
          </pre>
        </div>
      </div>

    </div>
  );
};
