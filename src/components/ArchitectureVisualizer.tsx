import React from 'react';
import { 
  Network, 
  Server, 
  Database, 
  Cpu, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Cloud, 
  KeyRound, 
  Boxes,
  Layers,
  FolderTree
} from 'lucide-react';

export const ArchitectureVisualizer: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center space-x-2">
          <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-1 rounded-full border border-indigo-500/40 font-semibold flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-indigo-400" />
            Clean Architecture & GCP Cloud Run Topology
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mt-2">
          Arquitectura de Software y Flujo de Datos RAG
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Diseño desacoplado para alta escalabilidad, baja latencia en WhatsApp y protección de credenciales en Google Cloud Platform.
        </p>
      </div>

      {/* Workflow Steps Horizontal Flow Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-400" />
          Flujo de Procesamiento Asíncrono (Paso a Paso)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Step 1 */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 relative">
            <span className="text-[10px] text-teal-400 font-bold font-mono">01. META API</span>
            <h4 className="font-semibold text-xs text-white mt-1">Paciente en WhatsApp</h4>
            <p className="text-[11px] text-slate-400 mt-1">Envía mensaje por chat.</p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-teal-500/50 relative">
            <span className="text-[10px] text-teal-400 font-bold font-mono">02. FASTAPI</span>
            <h4 className="font-semibold text-xs text-white mt-1">Webhook POST</h4>
            <p className="text-[11px] text-slate-400 mt-1">Recibe JSON y retorna 200 OK inmediatamente.</p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 relative">
            <span className="text-[10px] text-indigo-400 font-bold font-mono">03. BACKGROUND TASK</span>
            <h4 className="font-semibold text-xs text-white mt-1">bot_logic.py</h4>
            <p className="text-[11px] text-slate-400 mt-1">Inicia tarea en segundo plano sin bloquear a Meta.</p>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 relative">
            <span className="text-[10px] text-amber-400 font-bold font-mono">04. CLOUD SQL & RAG</span>
            <h4 className="font-semibold text-xs text-white mt-1">Memoria + Vector DB</h4>
            <p className="text-[11px] text-slate-400 mt-1">Carga historial en Postgres y chunks en Qdrant.</p>
          </div>

          {/* Step 5 */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 relative">
            <span className="text-[10px] text-cyan-400 font-bold font-mono">05. GEMINI LLM</span>
            <h4 className="font-semibold text-xs text-white mt-1">Inferencia RAG</h4>
            <p className="text-[11px] text-slate-400 mt-1">Aplica filtro ético y genera respuesta.</p>
          </div>

          {/* Step 6 */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-500/50 relative">
            <span className="text-[10px] text-emerald-400 font-bold font-mono">06. GRAPH API</span>
            <h4 className="font-semibold text-xs text-white mt-1">Respuesta WhatsApp</h4>
            <p className="text-[11px] text-slate-400 mt-1">Envía mensaje formateado al teléfono del paciente.</p>
          </div>

        </div>
      </div>

      {/* Directory Structure & Clean Architecture Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Clean Architecture Folder Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <FolderTree className="w-4 h-4 text-teal-400" />
            <h3 className="font-bold text-sm text-white">Estructura Estricta de Carpetas (Clean Architecture)</h3>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-teal-300 font-bold">📂 app/core/</span>
              <p className="text-slate-400 font-sans text-[11px] mt-0.5"><code className="text-teal-300">config.py</code>: Variables de entorno, tokens de Meta y llaves de Gemini.</p>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-teal-300 font-bold">📂 app/api/routes/</span>
              <p className="text-slate-400 font-sans text-[11px] mt-0.5"><code className="text-teal-300">webhook.py</code>: Endpoints de Meta WhatsApp (GET/POST) con BackgroundTasks.</p>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-teal-300 font-bold">📂 app/services/</span>
              <p className="text-slate-400 font-sans text-[11px] mt-0.5"><code className="text-teal-300">bot_logic.py</code>, <code className="text-teal-300">rag_service.py</code>, <code className="text-teal-300">whatsapp_service.py</code>: Orquestación, RAG y cliente Graph API.</p>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-teal-300 font-bold">📂 app/db/</span>
              <p className="text-slate-400 font-sans text-[11px] mt-0.5"><code className="text-teal-300">database.py</code>, <code className="text-teal-300">models.py</code>: Conexión a Cloud SQL PostgreSQL y modelos ORM.</p>
            </div>
          </div>
        </div>

        {/* GCP Cloud Run Components */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Cloud className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Infraestructura en Google Cloud Platform (GCP)</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start space-x-3">
              <Server className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-200">Google Cloud Run (Serverless Container)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Escala automáticamente desde 0 instancias hasta N instancias respondiendo a peticiones de Meta.</p>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start space-x-3">
              <Database className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-200">Cloud SQL (PostgreSQL)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Guarda de forma persistente el historial de sesiones y conversaciones de pacientes.</p>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start space-x-3">
              <KeyRound className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-200">Secret Manager</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Almacena tokens sensibles (<code className="text-teal-300">GEMINI_API_KEY</code>, <code className="text-teal-300">META_ACCESS_TOKEN</code>) fuera del código fuente.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
