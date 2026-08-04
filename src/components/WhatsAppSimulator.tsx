import React, { useState } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  ShieldCheck, 
  Database, 
  AlertTriangle, 
  Clock, 
  CheckCheck,
  RefreshCw,
  PhoneCall,
  MapPin,
  HeartPulse,
  Info
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'patient' | 'bot';
  text: string;
  timestamp: string;
  chunks?: { id: string; title: string; content: string; score: number }[];
}

export const WhatsAppSimulator: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init_1",
      sender: "bot",
      text: "¡Hola! Gracias por comunicarte con *Dientes y Sonrisa Odontología Láser* 🦷✨. \n\nSoy tu asistente virtual de atención al paciente. Puedo brindarte información sobre nuestros tratamientos con tecnología láser, precios orientativos, horarios y cómo agendar tu cita de valoración presencial. \n\n¿En qué te puedo colaborar hoy?",
      timestamp: "09:30 AM"
    }
  ]);
  const [inputText, setInputText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedChunks, setSelectedChunks] = useState<{ id: string; title: string; content: string; score: number }[] | null>(null);

  const PRESET_QUESTIONS = [
    {
      title: " Ortodoncia Autoligada (Precios)",
      text: "¿Cuál es el precio de la ortodoncia de autoligado? ¿Cuánto cuesta la inicial y la mensualidad?"
    },
    {
      title: "✨ Blanqueamiento Láser Diodo",
      text: "¿Cuánto cuesta el blanqueamiento láser y cuántas sesiones requiere?"
    },
    {
      title: " Dolor de Muela (Prueba Guardrail)",
      text: "Tengo un dolor terrible de muela, ¿qué antibiótico o analgésico me puedo tomar ya?"
    },
    {
      title: " Periodoncia / Encías Láser",
      text: "¿Cómo es el tratamiento de encías sangrantes con láser y qué ventajas tiene?"
    },
    {
      title: " Odontopediatría / Niños",
      text: "Mi hijo le tiene pánico al torno dental, ¿pueden curarle las caries con láser sin ruido?"
    },
    {
      title: "📍 Ubicación Bogotá y Horarios",
      text: "¿Dónde está ubicada la clínica en Bogotá y en qué horarios atienden?"
    }
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || loading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "patient",
      text: textToSend,
      timestamp: timeStr
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputText("");
    setLoading(true);

    try {
      // Call backend API endpoint for RAG simulation
      const res = await fetch("/api/rag-simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: textToSend,
          chatHistory: messages.map(m => ({
            role: m.sender === 'patient' ? 'paciente' : 'bot',
            text: m.text
          }))
        })
      });

      const data = await res.json();

      const botReplyMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text: data.response || "Ocurrió una pausa al generar la respuesta.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chunks: data.retrievedChunks || []
      };

      setMessages(prev => [...prev, botReplyMsg]);
      setSelectedChunks(data.retrievedChunks || []);

    } catch (err) {
      console.error("Error invoking RAG simulation:", err);
      const lower = textToSend.toLowerCase().trim();
      let replyText = "";
      let chunkTitle = "RAG Base de Conocimiento Bogotá";
      let chunkContent = "Información oficial de Dientes & Sonrisa en Bogotá.";

      if (lower.includes("blanq") || lower.includes("zoom") || lower.includes("pioon") || lower.includes("aclara")) {
        replyText = `En *Dientes y Sonrisa Bogotá* ofrecemos blanqueamiento dental con tecnología láser y LED 💎✨:\n\n📌 *Opciones y Precios Oficiales:*\n• *Blanqueamiento Láser PIOON:* $1.000.000 COP (Sesión de 45 min en clínica, fototermia sin sensibilidad).\n• *Blanqueamiento ZOOM (Luz LED):* $800.000 COP (Aclara hasta 8 tonos en clínica).\n• *Blanqueamiento Casero con Cubetas:* $800.000 COP.\n\n¿Deseas agendar tu cita para lucir una sonrisa más blanca?`;
        chunkTitle = "Blanqueamiento Dental & Precios";
        chunkContent = "Blanqueamiento PIOON ($1.000.000 COP) y ZOOM LED ($800.000 COP).";
      } else if (lower.includes("diseno") || lower.includes("diseño") || lower.includes("carilla") || lower.includes("lente") || lower.includes("emax") || lower.includes("zirconio") || lower.includes("sonrisa bonita")) {
        replyText = `En *Dientes y Sonrisa Bogotá* realizamos diseños de sonrisa con lentes cerámicos ultradelgados 💎✨:\n\n📌 *Precios Oficiales de Estética Dental:*\n• *Lentes Cerámicos E-MAX (0.3mm):* $1.000.000 COP c/u.\n• *Carillas en Zirconio Monolítico:* $1.400.000 COP c/u.\n• *Diseño de Sonrisa Básico:* $3.800.000 COP (Zoom + Gingivectomía + 6 Resinas).\n\n¿Te gustaría agendar una cita de valoración presencial en Bogotá?`;
        chunkTitle = "Estética Dental & Lentes Cerámicos";
        chunkContent = "Lentes Cerámicos E-MAX ($1.000.000 c/u) y Zirconio ($1.400.000 c/u).";
      } else if (lower.includes("lingual") || lower.includes("detras") || lower.includes("detrás") || lower.includes("forestadent") || lower.includes("por dentro")) {
        replyText = `En *Dientes y Sonrisa Bogotá* somos especialistas certificados en Ortodoncia Lingual 2D Forestadent (brackets detrás de los dientes) 🦷✨:\n\n📌 *Tarifas Oficiales:*\n• *Montaje Superior:* $2.200.000 COP\n• *Montaje Inferior:* $2.200.000 COP\n• *18 Controles Mensuales:* $250.000 COP c/u ($4.500.000 COP)\n• *Retenedores Sup e Inf:* $700.000 COP\n• *TOTAL TRATAMIENTO:* $9.600.000 COP\n\nOrtodoncistas de la Univ. Javeriana, 100% invisibles desde fuera. ¿Te gustaría agendar tu cita de valoración?`;
        chunkTitle = "Ortodoncia Lingual 2D Forestadent";
        chunkContent = "Brackets invisibles por detrás de los dientes. Total $9.600.000 COP.";
      } else if (lower.includes("zafiro") || lower.includes("estetico") || lower.includes("estético") || lower.includes("leone") || lower.includes("neocrystal") || lower.includes("clarity")) {
        replyText = `En *Dientes y Sonrisa Bogotá* contamos con Brackets Estéticos Transparentes (Zafiro Ice, Forestadent, Leone, NeoCrystal) 💎✨:\n\n📌 *Tarifas Oficiales:*\n• *Zafiro Ice Convencional:* $1.100.000 Sup + $1.100.000 Inf + 18 x $180.000 + $700.000 Retenedores = **$6.140.000 COP Total**\n• *3M Clarity Ultra Autoligado:* **$8.400.000 COP Total**\n• *Damon Clear Autoligado Zafiro:* **$9.600.000 COP Total**\n\n100% transparentes, no se manchan con café ni alimentos. ¿Te gustaría agendar una valoración?`;
        chunkTitle = "Brackets Estéticos Transparentes";
        chunkContent = "Zafiro Ice, Forestadent, Leone, NeoCrystal y 3M Clarity ($6.14M - $9.6M).";
      } else if (lower.includes("autoligado") || lower.includes("damon") || lower.includes("carriere") || lower.includes("empower") || lower.includes("pitts") || lower.includes("sin ligas") || lower.includes("sin gomas")) {
        replyText = `En *Dientes y Sonrisa Bogotá* somos especialistas en Ortodoncia Autoligada (sin ligas) 🦾✨:\n\nBrackets de perfil más bajo que disminuyen el descementado (no se caen) y mueven los dientes 40% más rápido con clips de baja fricción.\n\n📌 *Tarifas Oficiales Autoligado:*\n• *Standard (Carriere/Empower/H4/3M Victory):* Total $7.060.000 COP ($1.2M Sup + $1.2M Inf + 18 x $220k + $700k Retenedores)\n• *Damon Q2 & Pitts 21:* Total $7.860.000 COP ($1.6M Sup + $1.6M Inf + 18 x $220k + $700k Retenedores)\n• *Damon Ultima:* Total $9.400.000 COP ($2.1M Sup + $2.1M Inf + 18 x $250k + $700k Retenedores)\n• *3M Clarity Ultra (Transparente):* Total $8.400.000 COP\n• *Damon Clear (Zafiro Autoligado):* Total $9.600.000 COP\n\n📌 *Plan Flexible:* Cuota Inicial $400.000 COP | Mensual $100.000 COP.\n\n¿Te gustaría agendar una cita de valoración?`;
        chunkTitle = "Brackets de Autoligado (Damon, Pitts, 3M, Carriere)";
        chunkContent = "Ortodoncia autoligada de baja fricción ($7.06M - $9.6M COP) sin ligas elásticas.";
      } else if (lower.includes("invisalign") || lower.includes("smartee") || lower.includes("alineador") || lower.includes("invisible") || lower.includes("transparente")) {
        replyText = `En *Dientes y Sonrisa Bogotá* contamos con Ortodoncia Invisible con Alineadores Transparentes (Dra. Carolina Pérez Sáenz, Invisalign Certified) 🦷✨:\n\n📌 *Tarifas Oficiales Invisalign:*\n• *LITE (14 alineadores):* $7.500.000 COP\n• *MODERATE (26 alineadores):* $8.500.000 COP\n• *FULL COMPREHENSIVE:* $11.000.000 COP\n\n📌 *Tarifas Oficiales Smartee:*\n• *MINI:* $5.500.000 COP | *LITE:* $7.500.000 COP | *EXPRESS:* $9.000.000 COP | *INFINITY:* $11.000.000 COP | *ALFA:* $12.000.000 COP\n\n¿Te gustaría agendar tu cita de valoración?`;
        chunkTitle = "Alineadores Invisalign & Smartee";
        chunkContent = "Precios oficiales Invisalign ($7.5M-$11M) y Smartee ($5.5M-$12M).";
      } else if (lower.includes("ortodoncia") || lower.includes("bracket") || lower.includes("freno") || lower.includes("zafiro")) {
        replyText = `En *Dientes y Sonrisa Bogotá* manejamos Ortodoncia Autoligada de baja fricción 🦷✨:\n\n📌 *Tarifas Oficiales:*\n• *Metálicos:* Cuota inicial $400.000 COP | Mensual $100.000 COP.\n• *Cerámicos:* Cuota inicial $800.000 COP | Mensual $150.000 COP.\n• *Zafiro:* Cuota inicial $1.200.000 COP | Mensual $180.000 COP.\n\n¿Deseas agendar tu cita de valoración?`;
        chunkTitle = "Ortodoncia Autoligada Bogotá";
        chunkContent = "Brackets autoligados metálicos, cerámicos y de zafiro.";
      } else if (lower.includes("implante") || lower.includes("mis implant") || lower.includes("tornillo") || lower.includes("abutment") || lower.includes("pilar")) {
        replyText = `En *Dientes y Sonrisa Bogotá* contamos con Implantología Dental de alta tecnología (MIS IMPLANT) 🦷✨:\n\n📌 *Tarifas Oficiales Implante Completo:*\n• *Cirugía Inicial MIS IMPLANT:* $1.600.000 COP\n• *Tornillo de Cicatrización (a los 3 meses):* $200.000 COP\n• *Pilar o Abutment (al mes):* $500.000 COP *(con escáner 3D)*\n• *Corona de Metal o Porcelana (al mes):* $1.100.000 COP\n💰 **TOTAL TRATAMIENTO:** **$3.400.000 COP**\n\n¿Te gustaría agendar una cita de valoración con el Dr. Rafael Obando?`;
        chunkTitle = "Costo de Implante Dental (MIS IMPLANT)";
        chunkContent = "Cirugía $1.6M + Tornillo $200k + Pilar $500k + Corona $1.1M = $3.400.000 COP Total.";
      } else if (lower.includes("limpieza") || lower.includes("profilaxis") || lower.includes("sarro")) {
        replyText = `En *Dientes y Sonrisa Bogotá* realizamos limpieza profiláctica integral 🧼🦷:\n\n📌 *Profilaxis y Detartraje Ultrasónico:*\n• *Precio:* $150.000 - $250.000 COP.\n• *Incluye:* Remoción de sarro con ultrasonido, pulido dental y flúor.\n\n¿Cuándo te gustaría agendar tu cita?`;
        chunkTitle = "Profilaxis Ultrasónica";
        chunkContent = "Limpieza y detartraje ultrasónico ($150.000 - $250.000 COP).";
      } else if (lower.includes("dolor") || lower.includes("duele") || lower.includes("muela") || lower.includes("urgencia")) {
        replyText = `Lamento que presentes molestia o dolor 🩺.\n\nPor políticas médicas no podemos recetar ni diagnosticar por chat. Te recomendamos agendar una *cita de valoración prioritaria* en Bogotá (Carrera 15 #77-90 Cons 408) o llamarnos al +57 300 5516067.`;
        chunkTitle = "Protocolo de Urgencias";
        chunkContent = "Atención médica presencial en Bogotá.";
      } else {
        replyText = `En *Dientes y Sonrisa Odontología Láser* en Bogotá (Carrera 15 #77-90 Consultorio 408) contamos con especialistas en estética dental (diseño de sonrisa), ortodoncia autoligada, blanqueamiento láser e implantología.\n\n¿En qué tratamiento te podemos brindar información o agendar tu cita de valoración?`;
      }

      const errorMsg: ChatMessage = {
        id: `bot_err_${Date.now()}`,
        sender: "bot",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chunks: [
          {
            id: "vec_fallback_net",
            title: chunkTitle,
            content: chunkContent,
            score: 0.95
          }
        ]
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-teal-500/20 text-teal-300 text-xs px-2.5 py-1 rounded-full border border-teal-500/40 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              RAG Engine Live Simulator
            </span>
            <span className="text-xs text-slate-400">Powered by Gemini 2.5 Flash</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Simulador de Paciente WhatsApp — "Dientes y Sonrisa"
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Prueba cómo responde el bot en tiempo real aplicando RAG sobre la base de conocimiento de la clínica, respetando límites de no-diagnóstico médico.
          </p>
        </div>

        <button
          onClick={() => {
            setMessages([{
              id: "init_1",
              sender: "bot",
              text: "¡Hola! Gracias por comunicarte con *Dientes y Sonrisa Odontología Láser* 🦷✨. ¿En qué te puedo colaborar hoy?",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setSelectedChunks(null);
          }}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
          Reiniciar Conversación
        </button>
      </div>

      {/* Main Grid: WhatsApp Phone Mockup + RAG Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: WhatsApp Chat UI */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col h-[650px] shadow-2xl overflow-hidden">
          
          {/* WhatsApp Header */}
          <div className="bg-[#075e54] px-4 py-3 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-teal-300 flex items-center justify-center font-bold text-teal-300 text-sm">
                DS
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">
                  Dientes y Sonrisa Odontología Láser
                </h3>
                <p className="text-[11px] text-teal-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Cuenta de empresa oficial • Bot RAG activo
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-teal-100">
              <ShieldCheck className="w-5 h-5 text-teal-200" />
            </div>
          </div>

          {/* Preset Questions Bar */}
          <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 overflow-x-auto flex space-x-2 scrollbar-none">
            <span className="text-[11px] text-slate-400 self-center font-medium shrink-0 mr-1">
              Preguntas de prueba:
            </span>
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                disabled={loading}
                onClick={() => handleSendMessage(q.text)}
                className="text-[11px] bg-slate-950 hover:bg-teal-950/60 text-slate-300 hover:text-teal-300 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-teal-500/40 transition-all shrink-0 cursor-pointer disabled:opacity-50"
              >
                {q.title}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0b141a] custom-scrollbar">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-md relative text-xs leading-relaxed whitespace-pre-wrap ${
                      isBot
                        ? 'bg-[#202c33] text-slate-100 rounded-tl-none border border-slate-700/50'
                        : 'bg-[#005c4b] text-white rounded-tr-none'
                    }`}
                  >
                    {msg.text}

                    <div className="flex items-center justify-end space-x-1 mt-1 text-[10px] text-slate-400 font-mono">
                      <span>{msg.timestamp}</span>
                      {!isBot && <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                  </div>

                  {/* Button to view retrieved RAG chunks */}
                  {isBot && msg.chunks && msg.chunks.length > 0 && (
                    <button
                      onClick={() => setSelectedChunks(msg.chunks || null)}
                      className="mt-1 text-[10px] text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded border border-teal-500/30 cursor-pointer"
                    >
                      <Database className="w-3 h-3 text-teal-400" />
                      Ver {msg.chunks.length} Chunks de Contexto RAG usados
                    </button>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center space-x-2 bg-[#202c33] text-teal-300 text-xs px-4 py-2.5 rounded-2xl w-fit rounded-tl-none border border-slate-700/50 animate-pulse">
                <Bot className="w-4 h-4 text-teal-400 animate-spin" />
                <span>Consultando Base de Conocimiento RAG de Dientes y Sonrisa...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-[#202c33] border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Escribe la consulta del paciente..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={loading}
              className="flex-1 bg-[#2a3942] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !inputText.trim()}
              className="w-10 h-10 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 shrink-0 shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Column: RAG Inspection & Safety Guard Panel */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* RAG Context Inspector Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center space-x-2 mb-3">
              <Database className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm text-white">Inspección de Chunks Vectoriales RAG</h3>
            </div>

            {selectedChunks && selectedChunks.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Documentos recuperados del almacenamiento vectorial para fundamentar la última respuesta:
                </p>

                {selectedChunks.map((chunk, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-teal-300 font-mono text-[11px]">
                        {chunk.title}
                      </span>
                      <span className="bg-teal-500/20 text-teal-300 text-[10px] px-1.5 py-0.5 rounded font-mono border border-teal-500/30">
                        Score: {chunk.score}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      "{chunk.content}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-6 text-center text-xs text-slate-400">
                <Info className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p>Envía un mensaje en el chat para inspeccionar cómo el motor RAG busca y extrae contexto de la clínica.</p>
              </div>
            )}
          </div>

          {/* Safety & Medical Ethics Guardrail Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center space-x-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">Filtro Ético y Barrera de No-Diagnóstico</h3>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start space-x-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Protección Médica Activa:</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">El bot no recetará fármacos ni ofrecerá diagnósticos clínicos. Redirige automáticamente a consulta presencial.</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <CheckCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Precios Transparentes:</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Todos los valores monetarios informados se identifican como orientativos y sujetos a evaluación clínica.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
