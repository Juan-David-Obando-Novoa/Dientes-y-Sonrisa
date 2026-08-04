import React from 'react';
import { 
  Database, 
  FileText, 
  ShieldAlert, 
  Sparkles, 
  DollarSign, 
  Clock, 
  MapPin, 
  Layers,
  Search,
  BookOpen
} from 'lucide-react';

export const KnowledgeBaseInspector: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-1 rounded-full border border-amber-500/40 font-semibold flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            Base de Conocimiento RAG Oficial
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mt-2">
          Documentos de la Clínica "Dientes y Sonrisa Odontología Láser"
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Esta es la base de conocimiento que el servicio RAG indiza en vectores para fundamentar las respuestas del bot de WhatsApp.
        </p>
      </div>

      {/* RAG Knowledge Base Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section 1: General Info & Hours */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <MapPin className="w-4 h-4 text-teal-400" />
            <h3 className="font-bold text-sm text-white">Datos Generales & Ubicación</h3>
          </div>

          <div className="space-y-2 text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <p><strong className="text-teal-300">Clínica:</strong> Dientes & Sonrisa Odontología Láser</p>
            <p><strong className="text-teal-300">Sitio Web Oficial:</strong> <a href="https://www.dientesysonrisa.com/" target="_blank" rel="noreferrer" className="text-cyan-400 underline hover:text-cyan-300 font-mono">www.dientesysonrisa.com</a></p>
            <p><strong className="text-teal-300">Dirección Sede Bogotá:</strong> Carrera 15 #77-90 Consultorio 408 (Frente a Unilago) - Bogotá D.C.</p>
            <p><strong className="text-teal-300">Contacto & WhatsApp:</strong> +57 300 5516067 / PBX +57 318 362 5555 | info@dientesysonrisa.com</p>
            <p><strong className="text-teal-300">Idiomas:</strong> Español / English ("We Speak English") | <strong>Opiniones:</strong> 4.9 ★★★★★ (330+ en Google)</p>
            <p><strong className="text-teal-300">Horarios:</strong> Lunes a Viernes 8:00 AM - 6:00 PM | Sábados 8:00 AM - 1:00 PM (Previa cita)</p>
          </div>
        </div>

        {/* Section 2: Medical Ethics & Non-Diagnostic Guard */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h3 className="font-bold text-sm text-white">Reglas Éticas y Guardrails Médicos</h3>
          </div>

          <div className="space-y-2 text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <p className="text-rose-300 font-semibold">1. Prohibido diagnosticar o recetar por chat:</p>
            <p className="text-[11px] text-slate-400">Si un paciente reporta dolor severo, inflamación o sangrado, el bot NO dará nombres de analgésicos ni antibióticos. Indicará que requiere cita de urgencia presencial.</p>
            
            <p className="text-amber-300 font-semibold mt-2">2. Precios Orientativos:</p>
            <p className="text-[11px] text-slate-400">Todos los precios informados por el bot deben ir acompañados de la aclaración de que están sujetos a valoración presencial.</p>
          </div>
        </div>

        {/* Section 3: Laser Dental Treatments & Pricing Table */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Tratamientos con Tecnología Láser & Precios Estimados</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-slate-950 p-4 rounded-xl border border-teal-500/50 space-y-2 text-xs md:col-span-3">
              <span className="text-teal-300 font-bold block flex items-center justify-between">
                <span> Ortodoncia & Frenillos (Tarifas Vigentes 2026 Bogotá)</span>
                <span className="bg-teal-500/20 text-teal-300 text-[10px] px-2 py-0.5 rounded font-mono">ortodoncia.json</span>
              </span>
              <p className="text-slate-300 text-[11px]">Planes de pago en cuotas (12, 18 y 24 meses sin contrato ni intereses de mora) o con Financiación BBVA:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Brackets Metálicos MBT</span>
                  <span className="text-emerald-400 font-bold">Total: $3.620.000</span>
                  <span className="text-slate-400 text-[10px] block">Montaje Sup/Inf $650k | 18x $90k</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Zafiro Ice Transparente</span>
                  <span className="text-emerald-400 font-bold">Total: $6.140.000</span>
                  <span className="text-slate-400 text-[10px] block">Montaje Sup/Inf $1.1M | 18x $180k</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Autoligado Damon Q2 / Pitts</span>
                  <span className="text-emerald-400 font-bold">Total: $7.860.000</span>
                  <span className="text-slate-400 text-[10px] block">Montaje Sup/Inf $1.6M | 18x $220k</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Autoligado Damon Clear</span>
                  <span className="text-emerald-400 font-bold">Total: $9.600.000</span>
                  <span className="text-slate-400 text-[10px] block">Montaje Sup/Inf $2.2M | 18x $250k</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-xs">
              <span className="text-teal-300 font-bold block">✨ Blanqueamiento Láser Diodo</span>
              <p className="text-slate-300 text-[11px]">Dientes más blancos en 1 sola sesión de 45 minutos. Mínima o nula sensibilidad pos-tratamiento.</p>
              <div className="pt-2 text-emerald-400 font-semibold font-mono text-xs">
                Estimado: $450.000 - $680.000 COP
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-xs">
              <span className="text-teal-300 font-bold block">💎 Diseño de Sonrisa & Gingivectomía</span>
              <p className="text-slate-300 text-[11px]">Carillas en porcelana/resina y recorte estético de encía con láser sin bisturí, sin sangrado ni suturas.</p>
              <div className="pt-2 text-emerald-400 font-semibold font-mono text-xs">
                Estimado: Desde $380.000 COP
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-xs">
              <span className="text-teal-300 font-bold block"> Periodoncia / Encías Láser</span>
              <p className="text-slate-300 text-[11px]">Desinfección profunda de bolsas periodontales para eliminar gingivitis/periodontitis. Cicatrización acelerada.</p>
              <div className="pt-2 text-emerald-400 font-semibold font-mono text-xs">
                Estimado: Desde $290.000 COP / zona
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-xs">
              <span className="text-teal-300 font-bold block">⚡ Endodoncia Asistida por Láser</span>
              <p className="text-slate-300 text-[11px]">Desinfección fotoacústica de conductos radiculares. Elimina 99.8% de bacterias en canales estrechos.</p>
              <div className="pt-2 text-emerald-400 font-semibold font-mono text-xs">
                Estimado: Desde $550.000 COP
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-xs">
              <span className="text-teal-300 font-bold block">🦷 Implantes & Coronas en Circonio</span>
              <p className="text-slate-300 text-[11px]">Reemplazo de dientes perdidos con implantes biocompatibles en 3D. Prótesis y coronas estéticas.</p>
              <div className="pt-2 text-emerald-400 font-semibold font-mono text-xs">
                Estimado: Sujeto a valoración
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-xs">
              <span className="text-teal-300 font-bold block">👶 Odontopediatría & Ortodoncia</span>
              <p className="text-slate-300 text-[11px]">Caries en niños sin el molesto ruido del torno. Alineadores invisibles y brackets estéticos en Bogotá.</p>
              <div className="pt-2 text-emerald-400 font-semibold font-mono text-xs">
                Estimado: Sujeto a valoración
              </div>
            </div>

          </div>
        </div>

        {/* Section 4: Folder Tree Visualization data/ */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">Estructura Modular de Archivos RAG (35 Archivos JSON)</h3>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2.5 py-1 rounded-full font-mono border border-emerald-500/40">
              data/*
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
            
            {/* Folder 1: estetica_dental */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="text-teal-300 font-bold flex items-center gap-1.5">
                <span>📁 data/estetica_dental/</span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1 pl-3 border-l border-teal-800">
                <li>📄 diseno_sonrisa.json</li>
                <li>📄 tipos_diseno_sonrisa.json</li>
                <li>📄 blanqueamiento_dental.json</li>
                <li>📄 blanqueamiento_zoom.json</li>
                <li>📄 salud_oral.json</li>
                <li>📄 carillas_lentes_ceramicos.json</li>
                <li>📄 estetica_dental.json</li>
              </ul>
            </div>

            {/* Folder 2: implantologia */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                <span>📁 data/implantologia/</span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1 pl-3 border-l border-cyan-800">
                <li>📄 implantologia_dental.json</li>
                <li>📄 implantes_dentales_precios.json</li>
                <li>📄 ventajas_implantes.json</li>
              </ul>
            </div>

            {/* Folder 3: ortodoncia */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                <span>📁 data/ortodoncia/</span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1 pl-3 border-l border-emerald-800">
                <li>📄 tratamientos_ortodoncia.json</li>
                <li>📄 brakets_metalicos.json</li>
                <li>📄 brakets_autoligado.json</li>
                <li>📄 brakets_esteticos.json</li>
                <li>📄 invisalign.json</li>
                <li>📄 ortodoncia_lingual.json</li>
                <li>📄 planes_y_precios_ortodoncia.json</li>
              </ul>
            </div>

            {/* Folder 4: cirugia */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="text-purple-300 font-bold flex items-center gap-1.5">
                <span>📁 data/cirugia/</span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1 pl-3 border-l border-purple-800">
                <li>📄 cirugia_oral.json</li>
                <li>📄 bichectomia.json</li>
                <li>📄 rehabilitacion_oral.json</li>
                <li>📄 endodoncia.json</li>
                <li>📄 periodoncia.json</li>
                <li>📄 protesis_fijas_y_moviles.json</li>
              </ul>
            </div>

            {/* Folder 5: odontologia */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="text-amber-300 font-bold flex items-center gap-1.5">
                <span>📁 data/odontologia/</span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1 pl-3 border-l border-amber-800">
                <li>📄 servicio_odontologico.json</li>
                <li>📄 odontologia_laser.json</li>
                <li>📄 odontopediatria.json</li>
                <li>📄 para_bebes.json</li>
                <li>📄 para_adolescentes.json</li>
                <li>📄 personas_con_discapacidades.json</li>
              </ul>
            </div>

            {/* Folder 6: nosotros */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="text-blue-300 font-bold flex items-center gap-1.5">
                <span>📁 data/nosotros/</span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1 pl-3 border-l border-blue-800">
                <li>📄 la_empresa.json</li>
                <li>📄 dr_rafael_obando.json</li>
                <li>📄 dra_diana_carolina_perez.json</li>
                <li>📄 nuestras_instalaciones.json</li>
                <li>📄 testimonios.json</li>
                <li>📄 convenios.json</li>
                <li>📄 formas_de_pago.json</li>
                <li>📄 consulta_gratis_en_linea.json</li>
              </ul>
            </div>

            {/* Folder 7: contacto */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 sm:col-span-2 lg:col-span-1">
              <div className="text-rose-300 font-bold flex items-center gap-1.5">
                <span>📁 data/contacto/</span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1 pl-3 border-l border-rose-800">
                <li>📄 enviar_mensaje.json</li>
                <li>📄 whatsapp.json</li>
                <li>📄 nuestra_ubicacion.json</li>
                <li>📄 telefonos.json</li>
                <li>📄 english_version.json</li>
              </ul>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
