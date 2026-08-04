import React, { useState } from 'react';
import { 
  Webhook, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Terminal, 
  RefreshCw, 
  Code, 
  Sparkles,
  Zap,
  Server
} from 'lucide-react';

export const WebhookTester: React.FC = () => {
  const [verifyMode, setVerifyMode] = useState<string>("subscribe");
  const [verifyToken, setVerifyToken] = useState<string>("MI_TOKEN_SECRETO_DIENTES_Y_SONRISA");
  const [challengeCode, setChallengeCode] = useState<string>("1158209384");
  const [verifyResult, setVerifyResult] = useState<{ status: number; text: string; success: boolean } | null>(null);

  // POST Event Tester State
  const [selectedPayloadType, setSelectedPayloadType] = useState<'message' | 'status'>('message');
  const [postResponse, setPostResponse] = useState<any>(null);
  const [postLoading, setPostLoading] = useState<boolean>(false);

  const sampleTextMessagePayload = {
    object: "whatsapp_business_account",
    entry: [
      {
        id: "WHATSAPP_BUSINESS_ACCOUNT_ID",
        changes: [
          {
            value: {
              messaging_product: "whatsapp",
              metadata: {
                display_phone_number: "+573001234567",
                phone_number_id: "109876543210"
              },
              contacts: [
                {
                  profile: { name: "Maria Fernanda Perez" },
                  wa_id: "573109876543"
                }
              ],
              messages: [
                {
                  from: "573109876543",
                  id: "wamid.HBgMNTczMTA5ODc2NTQzFQIAERgSQ0E1RjlCNDRCNzBBN0Y2RDg3AA==",
                  timestamp: "1722598000",
                  text: { body: "Hola, quisiera información sobre el blanqueamiento láser y precios." },
                  type: "text"
                }
              ]
            },
            field: "messages"
          }
        ]
      }
    ]
  };

  const sampleStatusPayload = {
    object: "whatsapp_business_account",
    entry: [
      {
        id: "WHATSAPP_BUSINESS_ACCOUNT_ID",
        changes: [
          {
            value: {
              messaging_product: "whatsapp",
              metadata: { phone_number_id: "109876543210" },
              statuses: [
                {
                  id: "wamid.HBgMNTczMTA...",
                  status: "delivered",
                  timestamp: "1722598005",
                  recipient_id: "573109876543"
                }
              ]
            },
            field: "messages"
          }
        ]
      }
    ]
  };

  const handleTestVerifyGET = async () => {
    try {
      const url = `/api/webhook-test/verify?hub.mode=${verifyMode}&hub.verify_token=${encodeURIComponent(verifyToken)}&hub.challenge=${challengeCode}`;
      const res = await fetch(url);
      const text = await res.text();

      if (res.status === 200 && text === challengeCode) {
        setVerifyResult({ status: 200, text: text, success: true });
      } else {
        setVerifyResult({ status: res.status, text: text, success: false });
      }
    } catch (err: any) {
      setVerifyResult({ status: 500, text: err.message || "Error", success: false });
    }
  };

  const handleTestPostEvent = async () => {
    setPostLoading(true);
    setPostResponse(null);

    const payload = selectedPayloadType === 'message' ? sampleTextMessagePayload : sampleStatusPayload;

    try {
      const res = await fetch("/api/webhook-test/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setPostResponse(data);
    } catch (err: any) {
      setPostResponse({ error: err.message });
    } finally {
      setPostLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center space-x-2">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full border border-emerald-500/40 font-semibold flex items-center gap-1.5">
            <Webhook className="w-3.5 h-3.5 text-emerald-400" />
            Meta WhatsApp Webhook Testing Environment
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mt-2">
          Probador de Endpoints Webhook (GET & POST)
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Valida los requerimientos de Meta Developer Console para verificación de suscripción y recepción de mensajes en tareas en segundo plano (<code className="text-teal-300 bg-slate-950 px-1 py-0.5 rounded">BackgroundTasks</code>).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. GET Webhook Verification Challenge */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <span className="bg-emerald-500/20 text-emerald-300 font-mono text-xs px-2 py-0.5 rounded font-bold">
              GET
            </span>
            <h3 className="font-bold text-sm text-white">
              1. Verificación de Token de Meta (\`/api/v1/webhook\`)
            </h3>
          </div>

          <p className="text-xs text-slate-300">
            Meta envía una petición GET cuando configuras el Webhook en Facebook Developers Console. Tu endpoint debe retornar exactamente el <code className="text-teal-300">hub.challenge</code> si el token coincide.
          </p>

          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="text-[11px] text-slate-400 font-medium">hub.mode:</label>
              <input
                type="text"
                value={verifyMode}
                onChange={(e) => setVerifyMode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 mt-1 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">hub.verify_token:</label>
              <input
                type="text"
                value={verifyToken}
                onChange={(e) => setVerifyToken(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 mt-1 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">hub.challenge:</label>
              <input
                type="text"
                value={challengeCode}
                onChange={(e) => setChallengeCode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 mt-1 font-mono"
              />
            </div>

            <button
              onClick={handleTestVerifyGET}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Probar Verificación GET de Meta
            </button>
          </div>

          {verifyResult && (
            <div className={`p-4 rounded-xl border text-xs font-mono ${
              verifyResult.success
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
            }`}>
              <div className="flex items-center space-x-2 font-bold mb-1">
                {verifyResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                <span>Status HTTP: {verifyResult.status}</span>
              </div>
              <p className="text-[11px]">Respuesta devuelta por el backend: <span className="underline font-bold">{verifyResult.text}</span></p>
            </div>
          )}
        </div>

        {/* 2. POST Incoming Event Payload Tester */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <span className="bg-cyan-500/20 text-cyan-300 font-mono text-xs px-2 py-0.5 rounded font-bold">
              POST
            </span>
            <h3 className="font-bold text-sm text-white">
              2. Recepción de Eventos WhatsApp (\`/api/v1/webhook\`)
            </h3>
          </div>

          <p className="text-xs text-slate-300">
            Simula la recepción de un JSON de Meta con un mensaje entrante de un paciente y observa el procesamiento asíncrono con BackgroundTask.
          </p>

          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedPayloadType('message')}
              className={`flex-1 py-1.5 text-xs rounded-lg border font-medium transition-all cursor-pointer ${
                selectedPayloadType === 'message'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              Mensaje Texto de Paciente
            </button>
            <button
              onClick={() => setSelectedPayloadType('status')}
              className={`flex-1 py-1.5 text-xs rounded-lg border font-medium transition-all cursor-pointer ${
                selectedPayloadType === 'status'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              Notificación de Estado (Entregado/Leído)
            </button>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-300 h-40 overflow-auto custom-scrollbar">
            <pre>
              {JSON.stringify(selectedPayloadType === 'message' ? sampleTextMessagePayload : sampleStatusPayload, null, 2)}
            </pre>
          </div>

          <button
            onClick={handleTestPostEvent}
            disabled={postLoading}
            className="w-full py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {postLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
            Simular Envío POST desde Meta
          </button>

          {postResponse && (
            <div className="bg-slate-950 border border-teal-500/40 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {postResponse.status}
                </span>
                <span className="text-[10px] bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">
                  Respuesta inmediata &lt; 50ms
                </span>
              </div>

              {postResponse.extractedInfo?.pipeline && (
                <div className="mt-2 space-y-1 text-[11px] font-mono text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Pipeline de Tarea en Segundo Plano:</p>
                  {postResponse.extractedInfo.pipeline.map((step: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-300">
                      <span className="text-teal-400">✓</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
