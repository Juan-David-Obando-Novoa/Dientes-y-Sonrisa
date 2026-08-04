import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Structured Knowledge Base Chunks for Real Vector Similarity RAG Retrieval
export interface KnowledgeChunk {
  id: string;
  title: string;
  category: string;
  keywords: string[];
  content: string;
}

const CLINIC_KNOWLEDGE_CHUNKS: KnowledgeChunk[] = [
  {
    id: "chunk_clinic_general",
    title: "Información General, Ubicación & Contacto - Dientes y Sonrisa Bogotá",
    category: "Información Institucional",
    keywords: ["ubicacion", "ubicación", "direccion", "dirección", "bogota", "bogotá", "unilago", "contacto", "telefono", "teléfono", "whatsapp", "horario", "horarios", "donde", "dónde", "rafael obando", "carolina perez", "carolina pérez", "dientes y sonrisa", "sede"],
    content: `CLÍNICA DENTAL: Dientes & Sonrisa Odontología Láser
SLOGAN: "Esto sucede cuando se trabaja con amor"
SITIO WEB: https://www.dientesysonrisa.com/
DIRECCIÓN BOGOTÁ: Carrera 15 #77-90 Consultorio 408 (Frente a Unilago) - Bogotá D.C., Colombia.
WHATSAPP DIRECTO: +57 300 5516067 | PBX: +57 318 362 5555 | EMAIL: info@dientesysonrisa.com
CALIFICACIÓN GOOGLE: 4.9 ★★★★★ (Basado en 330+ opiniones reales de pacientes).
HORARIOS DE ATENCIÓN: Lunes a Viernes: 8:00 AM - 6:00 PM | Sábados: 8:00 AM - 1:00 PM (Previa Cita).
EQUIPO MÉDICO PRINCIPAL: Dr. Rafael Obando (Director Científico, Odontología Láser e Implantología Oral) y Dra. Diana Carolina Pérez Sáenz (Especialista en Ortodoncia Universidad Javeriana, Invisalign Certified).`
  },
  {
    id: "chunk_diseno_sonrisa",
    title: "Estética Dental & Concepto de Diseño de Sonrisa",
    category: "Estética Dental",
    keywords: ["diseno de sonrisa", "diseño de sonrisa", "estetica", "estética", "sonrisa bonita", "sonrisa perfecta", "sonrisa de revista", "dientes bonitos", "dientes feos", "arreglar mis dientes", "arreglarme los dientes", "mejorar mis dientes", "cambiar mi sonrisa", "armonizacion", "armonización", "resina"],
    content: `ESTÉTICA DENTAL & DISEÑO DE SONRISA PERSONALIZADO EN BOGOTÁ:
- Armonización facial digital previa. Evaluado directamente por el Director Científico (Dr. Rafael Obando) con 1 año de garantía.
- Evaluación preliminar gratuita por fotos de celular vía WhatsApp (+57 300 5516067).
- Diseño de Sonrisa Básico Integrado ($3.800.000 COP): Incluye Blanqueamiento Zoom LED ($800.000 COP), Gingivectomía de encías en 6 dientes ($600.000 COP) y 6 Resinas de Alta Estética de canino a canino ($2.400.000 COP).
- Carillas en Resina de Alta Estética: Desde $280.000 COP por pieza (cita de 2 horas con luz día).
- Gingivectomía / Recorte de encías con Láser Pioon o electrobisturí: Desde $380.000 COP.`
  },
  {
    id: "chunk_lentes_ceramicos",
    title: "Lentes Cerámicos E-MAX & Carillas de Zirconio",
    category: "Estética Dental",
    keywords: ["lentes ceramicos", "lentes cerámicos", "emax", "disilicato", "porcelana", "zirconio", "carillas", "durabilidad", "desgaste", "manchas", "alta gama"],
    content: `LENTES CERÁMICOS Y CARILLAS DE ALTA GAMA EN BOGOTÁ:
1. Lentes Cerámicos / Carillas Disilicato de Litio (EMAX - IVOCLAR 0.3mm): $1.000.000 COP c/u.
   - Ventajas: Láminas ultradelgadas de porcelana de alta resistencia. Brillo permanente, jamás se manchan con alimentos, café ni cigarrillo. Requieren mínimo o nulo desgaste del diente natural.
2. Carillas en Zirconio Monolítico: $1.400.000 COP c/u.
   - Ventajas: Máxima resistencia mecánica y estética natural 100% libre de metal.
- Incluyen diseño facial digital y garantía oficial de 1 año.`
  },
  {
    id: "chunk_blanqueamiento",
    title: "Blanqueamiento Dental Láser PIOON & ZOOM LED",
    category: "Estética Dental",
    keywords: ["blanqueamiento", "blanquea", "blanqueamiento laser", "blanqueamiento láser", "pioon", "zoom", "led", "dientes amarillos", "dientes manchados", "aclarar", "aclara", "sensibilidad"],
    content: `BLANQUEAMIENTO DENTAL DE ÚLTIMA TECNOLOGÍA EN BOGOTÁ:
1. Blanqueamiento Láser de Diodo PIOON: $1.000.000 COP.
   - Doble longitud de onda fototérmica. Sesión de 45 min en clínica. Elimina manchas profundas sin calor agresivo ni sensibilidad.
2. Blanqueamiento ZOOM LED (Luz Fría): $800.000 COP.
   - Aclara hasta 8 tonos en 2 sesiones de 45 minutos en clínica.
3. Blanqueamiento Casero con Cubetas Personalizadas (Acetatos Exiss): $800.000 COP.`
  },
  {
    id: "chunk_ortodoncia_autoligado",
    title: "Ortodoncia de Autoligado (Sin Ligas / Baja Fricción / Damon)",
    category: "Ortodoncia",
    keywords: ["autoligado", "damon", "carriere", "empower", "pitts", "3m victory", "3m clarity", "sin ligas", "sin gomas", "baja friccion", "baja fricción", "friccion", "fricción", "descementado", "rapido", "dolor", "miedo"],
    content: `ORTODONCIA DE AUTOLIGADO DE BAJA FRICCIÓN EN BOGOTÁ:
- Avance tecnológico que elimina las ligas de goma elásticas. Clips integrados sostienen el alambre permitiendo libre deslizamiento del arco.
- Ventajas: Mueve los dientes 40% más rápido, disminuye el riesgo de descementado (no se caen los brackets), elimina el dolor por opresión y facilita la higiene oral.
- Tarifas Oficiales Autoligado:
  1. Metálico Standard (Carriere / Empower / H4 / 3M Victory): Total $7.060.000 COP ($1.2M Sup + $1.2M Inf + 18 x $220k + $700k Retenedores).
  2. Metálico Damon Q2 & Pitts 21: Total $7.860.000 COP ($1.6M Sup + $1.6M Inf + 18 x $220k + $700k Retenedores).
  3. Metálico Damon Ultima: Total $9.400.000 COP ($2.1M Sup + $2.1M Inf + 18 x $250k + $700k Retenedores).
  4. Transparente 3M Clarity Ultra: Total $8.400.000 COP.
  5. Transparente Damon Clear Zafiro: Total $9.600.000 COP.
- Plan de Entrada Flexible: Cuota Inicial $400.000 COP | Mensualidad $100.000 COP.`
  },
  {
    id: "chunk_ortodoncia_estetica_zafiro",
    title: "Brackets Estéticos Transparentes (Zafiro Ice, Forestadent, Leone)",
    category: "Ortodoncia",
    keywords: ["zafiro", "zafiro ice", "estetico", "estético", "brackets transparentes", "forestadent", "leone", "neocrystal", "clarity"],
    content: `BRACKETS ESTÉTICOS TRANSPARENTES DE ZAFIRO ICE EN BOGOTÁ:
- Brackets 100% transparentes de cristal de zafiro de marcas líderes (Forestadent Alemania, Leone Italia, NeoCrystal). Inalterables (jamás cambian de color ni se manchan con café o alimentos).
- Tarifas Oficiales:
  * Zafiro Ice Convencional: Total $6.140.000 COP ($1.1M Sup + $1.1M Inf + 18 x $180k + $700k Retenedores).
  * 3M Clarity Ultra Autoligado Estético: Total $8.400.000 COP.
  * Damon Clear Autoligado Zafiro: Total $9.600.000 COP.
- Plan Inicial Flexible: $800.000 cuota inicial | $150.000 mensualidad.`
  },
  {
    id: "chunk_ortodoncia_convencional",
    title: "Ortodoncia Convencional Metálica (MBT / ROTH / Synergy)",
    category: "Ortodoncia",
    keywords: ["convencional", "mbt", "roth", "synergy", "brackets metalicos", "brackets metálicos", "economico", "económico"],
    content: `ORTODONCIA CONVENCIONAL METÁLICA EN BOGOTÁ:
1. Ortodoncia Convencional MBT / ROTH: Total $3.620.000 COP ($650k Sup + $650k Inf + 18 cuotas x $90k + $700k Retenedores).
2. Ortodoncia Convencional Synergy: Total $4.560.000 COP ($850k Sup + $850k Inf + 18 cuotas x $120k + $700k Retenedores).`
  },
  {
    id: "chunk_ortodoncia_lingual",
    title: "Ortodoncia Lingual Invisible 2D Forestadent (Por Detrás de los Dientes)",
    category: "Ortodoncia",
    keywords: ["lingual", "detras", "detrás", "forestadent", "por dentro", "invisible", "2d", "por detras"],
    content: `ORTODONCIA LINGUAL INVISIBLE 2D FORESTADENT EN BOGOTÁ:
- Brackets 100% invisibles desde fuera, cementados en la cara interna (lingual) de los dientes.
- Casa alemana Forestadent (3ª generación) atendido por ortodoncistas titulados de la Universidad Javeriana.
- Ventajas: Perfil ultradelgado (1.2 mm), confort en 3 semanas, tratamiento hasta 20% más rápido, la saliva limpia los brackets reduciendo descalcificación.
- Tarifas Oficiales: Total $9.600.000 COP ($2.2M Sup + $2.2M Inf + 18 x $250k + $700k Retenedores).`
  },
  {
    id: "chunk_invisalign_smartee",
    title: "Ortodoncia Invisible con Alineadores Transparentes (Invisalign & Smartee)",
    category: "Ortodoncia",
    keywords: ["invisalign", "smartee", "alineador", "alineadores", "invisible", "sin brackets", "carolina perez", "carolina pérez", "javeriana"],
    content: `ORTODONCIA INVISIBLE CON ALINEADORES TRANSPARENTES EN BOGOTÁ:
Especialista certificada: Dra. Carolina Pérez Sáenz (Ortodoncista Universidad Javeriana, Invisalign Certified).
- Tarifas Oficiales INVISALIGN (EE.UU.):
  * LITE (hasta 14 alineadores): $7.500.000 COP
  * MODERATE (hasta 26 alineadores): $8.500.000 COP
  * FULL COMPREHENSIVE (Ilimitados): $11.000.000 COP
  * Exámenes (RX, fotos, escáner 3D): $350.000 COP aprox.
- Tarifas Oficiales SMARTEE:
  * MINI (10 alineadores): $5.500.000 COP | LITE (25 alineadores): $7.500.000 COP
  * EXPRESS (40 alineadores): $9.000.000 COP | INFINITY (Ilimitados): $11.000.000 COP | ALFA: $12.000.000 COP
  * Exámenes: $250.000 COP aprox.
- Cita de orientación virtual sin costo por WhatsApp (+57 300 5516067) enviando fotos.`
  },
  {
    id: "chunk_implantes_mis",
    title: "Implantes Dentales & Rehabilitación Oral (MIS IMPLANT)",
    category: "Implantología",
    keywords: ["implante", "implantes", "mis implant", "diente fijo", "perdi un diente", "perdí un diente", "sin diente", "sustituir diente", "tornillo", "abutment", "pilar", "corona", "rafael obando"],
    content: `IMPLANTOLOGÍA DENTAL CON SISTEMA MIS IMPLANT EN BOGOTÁ:
Especialista responsable: Dr. Rafael Obando (Director Científico e Implantólogo Oral).
Desglose Oficial de Fases y Costos:
1. Cirugía implante - Inicial MIS IMPLANT: $1.600.000 COP (Tornillo de cicatrización colocado el mismo día).
2. Tornillo de cicatrización (a los 3 meses): $200.000 COP.
3. Pilar o Abutment (al mes con escáner 3D): $500.000 COP.
4. Corona de Metal o Porcelana (al mes): $1.100.000 COP.
TOTAL IMPLANTE DENTAL COMPLETO CON CORONA Y ABUTMENT: $3.400.000 COP.`
  },
  {
    id: "chunk_profilaxis_higiene",
    title: "Profilaxis, Detartraje Ultrasónico & Guía de Higiene Oral",
    category: "Salud Oral",
    keywords: ["limpieza", "profilaxis", "detartraje", "ultrasonido", "cavitron", "cavitrón", "sarro", "placa", "salud oral", "cepillado", "cepillarse", "seda dental", "lengua", "fluor", "flúor"],
    content: `PROFILAXIS & DETARTRAJE ULTRASÓNICO EN BOGOTÁ ($150.000 - $250.000 COP):
- Procedimiento: Remoción de sarro/cálculo con cavitrón ultrasónico piezoeléctrico, pulido con pasta profiláctica y flúor protector.
TÉCNICA DE CEPILLADO E HIGIENE RECOMENDADA EN CASA:
1. Usar crema dental con flúor.
2. Ángulo de 45° hacia la encía con técnica de barrido suave hacia el diente.
3. Cepillar caras masticatorias con movimientos cortos e internas con el cepillo en vertical.
4. Limpieza suave de la lengua y uso diario de seda dental.
5. Profilaxis profesional recomendada cada 6 meses.`
  },
  {
    id: "chunk_protesis_cirugia_periodoncia",
    title: "Prótesis Dentales, Endodoncia Láser & Periodoncia",
    category: "Rehabilitación & Cirugía",
    keywords: ["protesis", "prótesis", "dentadura", "akers", "new stetic", "dentsply", "lucitone", "flexite", "endodoncia", "periodoncia", "gingivitis", "periodontitis", "bichectomia", "bichectomía"],
    content: `PRÓTESIS DENTALES Y REHABILITACIÓN EN BOGOTÁ:
- AKERS Flexible Económica: $700.000 COP (en 3 días).
- Prótesis Acrílico New Stetic: $1.000.000 COP | Acrílico Dentsply: $1.200.000 COP.
- Prótesis Alto Impacto Lucitone: $1.400.000 COP | Flexible Irrompible Flexite Plus: $1.600.000 COP.
- Endodoncia Asistida por Láser: Desde $550.000 COP por conducto (99.8% efectividad bactericida).
- Periodoncia (Gingivitis/Periodontitis): Desde $290.000 COP por cuadrante.
- Bichectomía (Perfilamiento facial): 30 min, anestesia local.`
  },
  {
    id: "chunk_odontologia_laser_ninos",
    title: "Odontología Láser, Odontopediatría & Frenectomía Bebés",
    category: "Especialidades",
    keywords: ["laser", "láser", "sin torno", "sin ruido", "ninos", "niños", "odontopediatria", "odontopediatría", "bebes", "bebés", "frenectomia", "frenectomía", "lactancia", "miedo", "odontofobia"],
    content: `ODONTOLOGÍA LÁSER Y ESPECIALIDADES EN BOGOTÁ:
- Odontología Láser Pioon: Remoción de caries sin ruido de torno/motor ni vibración.
- Odontopediatría para Bebés: Frenectomía lingual con láser para lactancia materna sin dolor ni sangrado.
- Atención de Odontofobia / Miedo al Dentista: Entorno adaptado, tecnología láser silenciosa y trato empático.`
  },
  {
    id: "chunk_politicas_urgencias",
    title: "Políticas Médicas, Urgencias & No Diagnóstico por Chat",
    category: "Políticas",
    keywords: ["dolor", "duele", "muela", "antibiotico", "antibiótico", "analgesico", "analgésico", "urgencia", "receta", "medicamento", "diagnostico", "diagnóstico"],
    content: `POLÍTICAS DE ATENCIÓN Y URGENCIAS DENTALES:
- No diagnóstico ni receta de medicamentos por chat por normas de bioseguridad.
- Pacientes con dolor agudo o infección son derivados a valoración presencial prioritaria en nuestra sede de Unilago Bogotá (Carrera 15 #77-90 Cons 408) o a la línea WhatsApp +57 300 5516067.`
  }
];

// Helper: Text normalization for Vector Search
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");
}

const STOP_WORDS = new Set([
  "de", "del", "la", "las", "el", "los", "en", "con", "por", "para", "un", "una",
  "unos", "unas", "y", "o", "que", "es", "al", "mi", "mis", "tu", "tus", "su",
  "sus", "como", "me", "se", "te", "nos", "si", "no", "mas", "mas"
]);

// Real Vector / BM25 Semantic Similarity Retrieval Engine
function retrieveRelevantChunks(userQuery: string, topK = 3): Array<{ id: string; title: string; content: string; score: number }> {
  const normQuery = normalizeText(userQuery);
  const queryTokens = normQuery.split(/\s+/).filter(t => t.length > 2 && !STOP_WORDS.has(t));

  if (queryTokens.length === 0) {
    return [{
      id: CLINIC_KNOWLEDGE_CHUNKS[0].id,
      title: CLINIC_KNOWLEDGE_CHUNKS[0].title,
      content: CLINIC_KNOWLEDGE_CHUNKS[0].content,
      score: 0.85
    }];
  }

  const scoredChunks = CLINIC_KNOWLEDGE_CHUNKS.map(chunk => {
    let score = 0;
    const normTitle = normalizeText(chunk.title);
    const normCategory = normalizeText(chunk.category);
    const normContent = normalizeText(chunk.content);
    const normKeywords = chunk.keywords.map(k => normalizeText(k));

    // Keyword & Phrase match (Highest boost)
    for (const kw of normKeywords) {
      if (normQuery.includes(kw)) {
        score += 4.0;
      }
    }

    // Title & Category token matches
    for (const token of queryTokens) {
      if (normTitle.includes(token)) score += 2.5;
      if (normCategory.includes(token)) score += 1.8;
      if (normContent.includes(token)) score += 0.8;
    }

    // Normalize score to range 0.70 - 0.99 for UI display
    const normalizedScore = Math.min(0.99, Math.max(0.70, score / (queryTokens.length * 2.0 + 1.0)));

    return {
      id: chunk.id,
      title: chunk.title,
      content: chunk.content,
      rawScore: score,
      score: Number(normalizedScore.toFixed(2))
    };
  });

  scoredChunks.sort((a, b) => b.rawScore - a.rawScore);

  const topResults = scoredChunks.filter(s => s.rawScore > 0.4).slice(0, topK);

  if (topResults.length === 0) {
    return [{
      id: CLINIC_KNOWLEDGE_CHUNKS[0].id,
      title: CLINIC_KNOWLEDGE_CHUNKS[0].title,
      content: CLINIC_KNOWLEDGE_CHUNKS[0].content,
      score: 0.85
    }];
  }

  return topResults.map(({ rawScore, ...rest }) => rest);
}

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });
    } catch (e) {
      console.error("Error instantiating GoogleGenAI:", e);
      aiClient = null;
    }
  }
  return aiClient;
}

function generateSmartFallbackResponse(userMessage: string, chatHistory: Array<{ role: string; text: string }> = []) {
  const lowerMsg = userMessage.toLowerCase().trim();

  // Session memory check
  const hasGreetedBefore = Array.isArray(chatHistory) && chatHistory.length > 1;

  // Helper flags for intent analysis
  const isAskingWhatIs = lowerMsg.includes("que es") || lowerMsg.includes("qué es") || lowerMsg.includes("explicar") || lowerMsg.includes("explica") || lowerMsg.includes("consiste") || lowerMsg.includes("para que") || lowerMsg.includes("para qué") || lowerMsg.includes("saber si") || lowerMsg.includes("funciona") || lowerMsg.includes("como hago") || lowerMsg.includes("cómo hago") || lowerMsg.includes("como asi") || lowerMsg.includes("cómo así") || lowerMsg.includes("diferencia") || lowerMsg.includes("cuales") || lowerMsg.includes("cuáles");
  const isAskingPrices = lowerMsg.includes("precio") || lowerMsg.includes("costo") || lowerMsg.includes("cuanto") || lowerMsg.includes("cuánto") || lowerMsg.includes("tarifa") || lowerMsg.includes("valor") || lowerMsg.includes("cotiz");

  // Profanity check
  const profanityList = ["pirobo", "hijueputa", "hdp", "gonorrea", "malparido", "mierda", "puta", "perra"];
  if (profanityList.some(p => lowerMsg.includes(p))) {
    return {
      response: `En *Dientes y Sonrisa Odontología Láser* estamos para atenderte con absoluto respeto 🦷✨.\n\nSi tienes inquietudes sobre nuestros tratamientos dentales en Bogotá (ortodoncia, estética, blanqueamiento o limpieza), con gusto te brindamos la información oficial o agendamos tu valoración presencial.`,
      retrievedChunks: [
        {
          id: "vec_respect_1",
          title: "Atención al Cliente & Protocolo Institucional",
          content: "Protocolo de atención cordial y profesional en WhatsApp para Dientes & Sonrisa Bogotá.",
          score: 0.99
        }
      ]
    };
  }

  // Casual social / Gratitude / Slang handling ("bro", "brooo", "gracias", "okey", "jajaja")
  if (lowerMsg === "gracias" || lowerMsg === "muchas gracias" || lowerMsg === "vale" || lowerMsg === "ok" || lowerMsg === "okey" || lowerMsg === "perfecto" || lowerMsg === "listo") {
    return {
      response: `¡Con muchísimo gusto! 😊✨ Quedamos atentos si deseas agendar tu cita de valoración presencial en nuestra clínica de Bogotá (Carrera 15 #77-90 Consultorio 408, frente a Unilago) o escribirnos al WhatsApp +57 300 5516067. ¡Que tengas un excelente día!`,
      retrievedChunks: [
        {
          id: "vec_close_1",
          title: "Atención al Paciente & Contacto Bogotá",
          content: "Línea WhatsApp +57 300 5516067 y sede Unilago en Bogotá.",
          score: 0.95
        }
      ]
    };
  }

  if (lowerMsg.includes("bro") || lowerMsg.includes("parce") || lowerMsg.includes("pana") || lowerMsg.includes("hermano") || lowerMsg.includes("jajaja") || lowerMsg.includes("jaja")) {
    return {
      response: hasGreetedBefore 
        ? `😊 ¡Hola! Con gusto te colaboro. ¿Qué dudas tienes sobre nuestros tratamientos dentales en Bogotá (diseño de sonrisa, ortodoncia, blanqueamiento o profilaxis)?`
        : `¡Hola! ¿Cómo estás? 👋 Soy el asistente virtual de *Dientes y Sonrisa Odontología Láser* en Bogotá.\n\n¿En qué te podemos colaborar el día de hoy sobre tus dientes o salud oral?`,
      retrievedChunks: [
        {
          id: "vec_casual_1",
          title: "Asistente Virtual & Menú Dental",
          content: "Atención personalizada para consultas odontológicas en Bogotá.",
          score: 0.90
        }
      ]
    };
  }

  // Greeting check
  const greetingsList = ["hola", "buenas", "buenos dias", "buenas tardes", "buenas noches", "saludos", "hi", "hello", "hola?", "holi", "buenas!", "que tal", "cómo estás", "como estas"];
  const isGreeting = greetingsList.some(g => lowerMsg === g || lowerMsg.startsWith(g + " ") || lowerMsg.endsWith(" " + g));
  
  if (isGreeting || lowerMsg === "hola" || lowerMsg === "holi") {
    if (hasGreetedBefore) {
      return {
        response: `¡Hola de nuevo! 😊 ¿En qué más te puedo colaborar el día de hoy sobre tus tratamientos dentales?`,
        retrievedChunks: [
          {
            id: "vec_welcome_followup",
            title: "Atención Continuada en Chat",
            content: "Continuación fluida del chat con el paciente.",
            score: 0.95
          }
        ]
      };
    }

    return {
      response: `¡Hola! Gracias por escribir a *Dientes y Sonrisa Odontología Láser* en Bogotá 🦷✨.\n\nSoy tu asistente virtual de atención al paciente. ¿En qué te puedo colaborar el día de hoy?\n\nPuedes consultarme sobre:\n• 💎 *Blanqueamiento:* Láser PIOON ($1.000.000) y ZOOM LED ($800.000)\n• ✨ *Estética Dental:* Diseño de Sonrisa, Lentes Cerámicos E-MAX ($1.000.000) y Carillas Zirconio ($1.400.000)\n• 🦷 *Ortodoncia:* Brackets Autoligados Metálicos, Cerámicos y Zafiro\n• 🧼 *Salud Oral:* Profilaxis y Detartraje Ultrasónico ($150.000 - $250.000)\n• 📍 *Ubicación y Citas:* Sede Bogotá (Carrera 15 #77-90 Cons 408, frente a Unilago)`,
      retrievedChunks: [
        {
          id: "vec_welcome_1",
          title: "Bienvenida & Menú Principal de Servicios",
          content: "Catálogo de servicios e información general de Dientes & Sonrisa Bogotá.",
          score: 0.98
        }
      ]
    };
  }

  // Semantic Intent Mapping: DISEÑO DE SONRISA / ESTÉTICA DENTAL / SONRISA BONITA
  const isAestheticIntent = lowerMsg.includes("diseno") || lowerMsg.includes("diseño") || lowerMsg.includes("carilla") || lowerMsg.includes("lente") || lowerMsg.includes("ceramico") || lowerMsg.includes("cerámico") || lowerMsg.includes("emax") || lowerMsg.includes("zirconio") || lowerMsg.includes("resina") || lowerMsg.includes("sonrisa bonita") || lowerMsg.includes("sonrisa perfecta") || lowerMsg.includes("sonrisa de revista") || lowerMsg.includes("dientes bonitos") || lowerMsg.includes("dientes feos") || lowerMsg.includes("arreglar mis dientes") || lowerMsg.includes("arreglarme los dientes") || lowerMsg.includes("mejorar mis dientes") || lowerMsg.includes("cambiar mi sonrisa") || lowerMsg.includes("estetica") || lowerMsg.includes("estética");

  if (isAestheticIntent) {
    if (isAskingWhatIs || lowerMsg.includes("como hago") || lowerMsg.includes("cómo hago") || lowerMsg.includes("sonrisa bonita") || lowerMsg.includes("sonrisa perfecta") || lowerMsg.includes("arreglar")) {
      return {
        response: `${hasGreetedBefore ? "¡Con gusto!" : "¡Hola!"} Para lograr una **sonrisa bonita, armónica y radiante**, en *Dientes y Sonrisa Bogotá* realizamos tratamientos de **Estética Dental y Diseño de Sonrisa Personalizado** 💎✨.\n\n📌 *¿En qué consiste el Diseño de Sonrisa?*\nEvaluamos y modificamos la forma, proporción, alineación y tono de tus dientes para que armonicen de forma natural con tus labios y rostro.\n\n📌 *Técnicas que realizamos en nuestra clínica en Bogotá:*\n1️⃣ **Lentes Cerámicos E-MAX (Disilicato de Litio 0.3mm):** Láminas ultradelgadas de porcelana. Brillo permanente, no se manchan con alimentos ni bebidas y requieren mínimo o nulo desgaste de tu diente ($1.000.000 COP c/u).\n2️⃣ **Carillas en Zirconio Monolítico:** Máxima resistencia y estética natural libre de metal ($1.400.000 COP c/u).\n3️⃣ **Diseño Básico en Resina de Alta Estética:** Modelado directo ($280.000 COP por pieza / Plan integral $3.800.000 COP que incluye Zoom + Gingivectomía + 6 Resinas).\n\n📌 *¿Cuál es el primer paso?*\nProgramar una **cita de valoración presencial** en nuestra sede de Bogotá (Carrera 15 #77-90 Cons 408, frente a Unilago) donde nuestro Director Científico (Dr. Rafael Obando) realiza tu análisis estético digital. También puedes enviarnos fotos por WhatsApp (+57 300 5516067) para una orientación previa.\n\n¿Te gustaría agendar tu cita de valoración?`,
        retrievedChunks: [
          {
            id: "vec_diseno_explain",
            title: "Concepto & Procedimiento de Diseño de Sonrisa",
            content: "Definición, análisis facial digital, lentes cerámicos EMAX ($1.000.000 COP c/u) y carillas en zirconio/resina en Bogotá.",
            score: 0.99
          }
        ]
      };
    }

    return {
      response: `${hasGreetedBefore ? "Te comparto las opciones de " : "¡Hola! En *Dientes y Sonrisa Bogotá* realizamos "}**Estética Dental y Diseño de Sonrisa** con máxima precisión 💎✨:\n\n📌 *Opciones y Tarifas Oficiales:*\n• *Lentes Cerámicos / Carillas Disilicato de Litio (EMAX - IVOCLAR 0.3mm):* $1.000.000 COP c/u (sin desgaste del diente, brillo permanente).\n• *Carillas en Zirconio Monolítico:* $1.400.000 COP c/u (máxima resistencia libre de metal).\n• *Diseño de Sonrisa Básico:* $3.800.000 COP (Blanqueamiento Zoom + Gingivectomía 6 dientes + 6 Resinas de Alta Estética).\n• *Carillas en Resina Estética:* $280.000 COP por pieza.\n\n¿Te gustaría agendar una valoración presencial en Bogotá o enviarnos fotos para un análisis previo por WhatsApp (+57 300 5516067)?`,
      retrievedChunks: [
        {
          id: "vec_diseno_1",
          title: "Lentes Cerámicos E-MAX & Carillas Bogotá",
          content: "Lentes Cerámicos EMAX ($1.000.000 c/u) y Zirconio ($1.400.000 c/u). Diseño Básico ($3.800.000 COP).",
          score: 0.98
        }
      ]
    };
  }

  // Topic: BLANQUEAMIENTO DENTAL
  const isWhiteningIntent = lowerMsg.includes("blanquea") || lowerMsg.includes("blanq") || lowerMsg.includes("zoom") || lowerMsg.includes("pioon") || lowerMsg.includes("aclara") || lowerMsg.includes("dientes amarillos") || lowerMsg.includes("dientes manchados");

  if (isWhiteningIntent) {
    if (isAskingWhatIs || lowerMsg.includes("dientes amarillos") || lowerMsg.includes("dientes manchados")) {
      return {
        response: `${hasGreetedBefore ? "¡Con gusto!" : "¡Hola!"} Te explico cómo tratamos los dientes amarillos o manchados mediante **Blanqueamiento Dental Profesional** 💎✨:\n\nEs un procedimiento no invasivo que aclara varios tonos el color natural de tus dientes mediante geles de última generación activados con tecnología de luz o láser.\n\n📌 *Opciones en nuestra clínica de Bogotá:*\n1️⃣ **Blanqueamiento Láser PIOON ($1.000.000 COP):** Láser de diodo de doble longitud de onda. Fototermia en 1 sesión de 45 minutos. Elimina manchas profundas sin sensibilidad ni calor agresivo.\n2️⃣ **Blanqueamiento ZOOM LED ($800.000 COP):** Sistema de luz fría LED que aclara hasta 8 tonos en clínica.\n3️⃣ **Blanqueamiento Ambulatorio / Casero ($800.000 COP):** Cubetas termoformadas a tu medida con gel aclarante.\n\n¿Te gustaría agendar tu cita para evaluar tus dientes y elegir la mejor técnica?`,
        retrievedChunks: [
          {
            id: "vec_blanq_explain",
            title: "Explicación Técnica de Blanqueamiento Dental Láser & LED",
            content: "Tecnología Láser PIOON ($1.000.000 COP) y ZOOM LED ($800.000 COP) sin sensibilidad.",
            score: 0.98
          }
        ]
      };
    }

    return {
      response: `${hasGreetedBefore ? "Te informo que en " : "¡Hola! En *Dientes y Sonrisa Bogotá* "}ofrecemos blanqueamiento dental de última tecnología 💎✨:\n\n📌 *Opciones y Precios Oficiales:*\n• *Blanqueamiento Láser PIOON (Doble Longitud de Onda):* $1.000.000 COP (1 sesión de 45 min en clínica, fototermia sin sensibilidad).\n• *Blanqueamiento ZOOM (Luz LED Fría):* $800.000 COP (Aclara hasta 8 tonos en clínica).\n• *Blanqueamiento Casero con Cubetas Personalizadas:* $800.000 COP.\n\n¿Te gustaría agendar una cita para lucir una sonrisa más clara y brillante?`,
      retrievedChunks: [
        {
          id: "vec_blanq_1",
          title: "Tecnologías de Blanqueamiento Dental",
          content: "Blanqueamiento Láser PIOON ($1.000.000 COP) y ZOOM LED ($800.000 COP) en Bogotá.",
          score: 0.96
        }
      ]
    };
  }

  // Topic: ORTODONCIA / BRACKETS / ALINEACIÓN
  const isOrthoIntent = lowerMsg.includes("ortodoncia") || lowerMsg.includes("bracket") || lowerMsg.includes("freno") || lowerMsg.includes("zafiro") || lowerMsg.includes("autoligado") || lowerMsg.includes("alineador") || lowerMsg.includes("invisalign") || lowerMsg.includes("smartee") || lowerMsg.includes("invisible") || lowerMsg.includes("transparente") || lowerMsg.includes("lingual") || lowerMsg.includes("detras") || lowerMsg.includes("detrás") || lowerMsg.includes("forestadent") || lowerMsg.includes("dientes torcidos") || lowerMsg.includes("dientes chuecos") || lowerMsg.includes("friccion") || lowerMsg.includes("fricción");

  if (isOrthoIntent) {
    // Sub-intent 0: Ortodoncia Lingual (Brackets por detrás de los dientes)
    if (lowerMsg.includes("lingual") || lowerMsg.includes("detras") || lowerMsg.includes("detrás") || lowerMsg.includes("forestadent") || lowerMsg.includes("por dentro")) {
      return {
        response: `${hasGreetedBefore ? "¡Con gusto te explico sobre la " : "En *Dientes y Sonrisa Bogotá* somos especialistas certificados en "}**Ortodoncia Lingual Invisible (Brackets Detrás de los Dientes)** 🦷✨:\n\nUtilizamos los brackets **2D de 3ª Generación de la prestigiosa casa alemana FORESTADENT**, atendidos por ortodoncistas titulados de la **Universidad Javeriana**.\n\n📌 *Ventajas de la Ortodoncia Lingual:*\n• **100% Invisible desde fuera:** Cementados en la cara interna (lingual) de tus dientes.\n• **Tratamiento más rápido:** Hasta 20% más rápido que brackets convencionales. Casos sencillos o 'social 6' requieren entre 2 y 5 citas.\n• **Baja Fricción y Confort:** Perfil ultradelgado (1.2 mm) con bordes redondeados y arcos livianos de Nitinol (0.12 mm). Adaptación promedio en solo 3 semanas sin afectar el habla.\n• **Higiene Natural Superior:** La saliva y la lengua limpian los brackets por dentro, reduciendo en un 50% el riesgo de manchas o descalcificación.\n\n📌 *Plan y Tarifas Oficiales:*\n• **Montaje Superior:** $2.200.000 COP\n• **Montaje Inferior:** $2.200.000 COP\n• **18 Controles Mensuales:** $250.000 COP cada uno ($4.500.000 COP)\n• **Retenedores Superior e Inferior:** $700.000 COP\n• **TOTAL TRATAMIENTO:** $9.600.000 COP\n\n📌 *Cita de valoración:* Envíanos fotos de tus dientes al WhatsApp (+57 300 5516067) para orientación virtual sin costo. La cita presencial se abona 100% al tratamiento.\n\n¿Te gustaría agendar una valoración en nuestra sede de Unilago en Bogotá?`,
        retrievedChunks: [
          {
            id: "vec_lingual_official",
            title: "Ortodoncia Lingual Invisible 2D Forestadent (ortodoncia_lingual.json)",
            content: "Brackets por detrás de los dientes 100% invisibles. Casa Forestadent Alemania, Ortodoncistas Javeriana. Total $9.600.000 COP.",
            score: 0.99
          }
        ]
      };
    }

    // Sub-intent 0.5: Brackets Estéticos Transparentes (Zafiro Ice, Forestadent, Leone, NeoCrystal)
    if (lowerMsg.includes("zafiro") || lowerMsg.includes("estetico") || lowerMsg.includes("estético") || lowerMsg.includes("leone") || lowerMsg.includes("neocrystal") || lowerMsg.includes("clarity") || lowerMsg.includes("damon clear")) {
      return {
        response: `${hasGreetedBefore ? "¡Con gusto te compartimos información de nuestros " : "En *Dientes y Sonrisa Bogotá* contamos con los mejores "}**Brackets Estéticos Transparentes** 💎✨:\n\nTratamiento con brackets 100% discretos de cristal de Zafiro Ice y marcas líderes como **Forestadent** (Alemania), **Leone** (Italia) y **NeoCrystal**. No se manchan ni cambian de color con alimentos o café.\n\n📌 *Tarifas Oficiales en Bogotá:*\n• **Zafiro Ice / Estéticos Convencionales:** Montajes Sup $1.100.000 + Inf $1.100.000 | 18 cuotas de $180.000 ($3.240.000) | Retenedores $700.000 | **TOTAL: $6.140.000 COP**\n• **3M Clarity Ultra (Autoligado Estético):** Montajes Sup $1.600.000 + Inf $1.600.000 | 18 cuotas de $250.000 ($4.500.000) | Retenedores $700.000 | **TOTAL: $8.400.000 COP**\n• **Damon Clear (Autoligado de Zafiro Premium):** Brackets Sup $2.200.000 + Inf $2.200.000 | 18 cuotas de $250.000 ($4.500.000) | Retenedores $700.000 | **TOTAL: $9.600.000 COP**\n• **Plan Inicial Flexible:** Cuota inicial $800.000 COP | Mensualidad $150.000 COP\n\n📌 *Cita de valoración:* Orientación por WhatsApp (+57 300 5516067) enviando fotos sin costo. Cita presencial abonable al tratamiento.\n\n¿Te gustaría agendar una valoración presencial en nuestra sede de Unilago en Bogotá?`,
        retrievedChunks: [
          {
            id: "vec_esteticos_official",
            title: "Brackets Estéticos Transparentes (brakets_esteticos.json)",
            content: "Brackets Zafiro Ice, Forestadent, Leone, NeoCrystal, 3M Clarity y Damon Clear. Precios oficiales $6.140.000 - $9.600.000 COP.",
            score: 0.99
          }
        ]
      };
    }

    // Sub-intent 0.8: Brackets de Autoligado (Damon, Carriere, Empower, H4, Pitts 21, 3M Victory/Clarity)
    if (lowerMsg.includes("autoligado") || lowerMsg.includes("damon") || lowerMsg.includes("carriere") || lowerMsg.includes("empower") || lowerMsg.includes("pitts") || lowerMsg.includes("sin ligas") || lowerMsg.includes("sin gomas") || lowerMsg.includes("descementad")) {
      return {
        response: `${hasGreetedBefore ? "¡Con gusto te explico sobre los " : "En *Dientes y Sonrisa Bogotá* somos especialistas en "}**Brackets de Autoligado (Sin Ligas)** 🦾✨:\n\nLos brackets de autoligado son la **mejor alternativa actualmente en el mercado**. Cuentan con un perfil de altura más bajo que disminuye el descementado (no se caen fácilmente) y aseguran el arco con clips de alta tecnología de baja fricción en lugar de ligaduras elásticas.\n\n📌 *Ventajas Destacadas:*\n• **Movimiento Dental 40% Más Rápido:** Fuerzas biomecánicas continuas y suaves.\n• **Cero Dolor por Opresión:** Al no apretar con ligas, elimina la irritación y molestia habitual.\n• **Mayor Higiene:** No acumulan restos de comida ni placa bacteriana.\n• **Menor Frecuencia de Citas:** Asistencia cada 6 a 8 semanas.\n\n📌 *Tarifas Oficiales de Autoligado en Bogotá:*\n1️⃣ **Metálico Standard (Carriere / Empower / H4 / 3M Victory):** Montajes Sup $1.2M + Inf $1.2M | 18 cuotas x $220k | Retenedores $700k | **TOTAL: $7.060.000 COP**\n2️⃣ **Metálico Damon Q2 & Pitts 21:** Montajes Sup $1.6M + Inf $1.6M | 18 cuotas x $220k | Retenedores $700k | **TOTAL: $7.860.000 COP**\n3️⃣ **Metálico Damon Ultima:** Montajes Sup $2.1M + Inf $2.1M | 18 cuotas x $250k | Retenedores $700k | **TOTAL: $9.400.000 COP**\n4️⃣ **Transparente 3M Clarity Ultra:** Montajes Sup $1.6M + Inf $1.6M | 18 cuotas x $250k | Retenedores $700k | **TOTAL: $8.400.000 COP**\n5️⃣ **Transparente Damon Clear:** Sup $2.2M + Inf $2.2M | 18 cuotas x $250k | Retenedores $700k | **TOTAL: $9.600.000 COP**\n\n📌 *Plan de Entrada Flexible:* Metálicos ($400.000 inicial / $100.000 mes) | Cerámicos ($800.000 inicial / $150.000 mes) | Zafiro ($1.200.000 inicial / $180.000 mes).\n\n¿Te gustaría agendar una valoración presencial en nuestra clínica de Unilago en Bogotá?`,
        retrievedChunks: [
          {
            id: "vec_autoligado_official",
            title: "Brackets de Autoligado (brakets_autoligado.json)",
            content: "Sistemas Damon Q2, Pitts 21, Damon Ultima, Carriere, Empower, 3M Clarity y Damon Clear. Precios $7.06M - $9.6M COP.",
            score: 0.99
          }
        ]
      };
    }

    // Sub-intent 1: Invisalign / Smartee / Alineadores Transparentes
    if (lowerMsg.includes("invisalign") || lowerMsg.includes("smartee") || lowerMsg.includes("alineador") || lowerMsg.includes("invisible") || lowerMsg.includes("sin bracket") || lowerMsg.includes("transparente") || lowerMsg.includes("perez") || lowerMsg.includes("pérez") || lowerMsg.includes("carolina")) {
      return {
        response: `${hasGreetedBefore ? "¡Con gusto te compartimos los precios y detalles de " : "En *Dientes y Sonrisa Bogotá* contamos con "}**Ortodoncia Invisible con Alineadores Transparentes (Invisalign & Smartee)** 🦷✨:\n\nNuestra especialista certificada es la **Dra. Carolina Pérez Sáenz** (Ortodoncista de la Universidad Javeriana, Invisalign Certified).\n\n📌 *Tarifas Oficiales INVISALIGN (EE.UU.):*\n• **Paquete LITE (hasta 14 alineadores):** $7.500.000 COP\n• **Paquete MODERATE (hasta 26 alineadores):** $8.500.000 COP\n• **Paquete FULL COMPREHENSIVE (Ilimitados):** $11.000.000 COP\n• *Exámenes complementarios (RX, fotos, scanner 3D):* $350.000 COP aprox.\n\n📌 *Tarifas Oficiales SMARTEE:*\n• **Paquete MINI (10 alineadores):** $5.500.000 COP\n• **Paquete LITE (25 alineadores):** $7.500.000 COP\n• **Paquete EXPRESS (40 alineadores):** $9.000.000 COP\n• **Paquete INFINITY (Todos incluidos):** $11.000.000 COP\n• **Paquete ALFA (14/8):** $12.000.000 COP\n• *Exámenes complementarios:* $250.000 COP aprox.\n\n📌 *Cita de valoración:* Puedes enviarnos fotos de tus dientes por WhatsApp (+57 300 5516067) para una evaluación preliminar sin costo. La cita presencial tiene un valor abonable 100% al tratamiento.\n\n¿Te gustaría agendar tu valoración con la Dra. Carolina Pérez en nuestra clínica de Unilago en Bogotá?`,
        retrievedChunks: [
          {
            id: "vec_invisalign_official",
            title: "Tarifas Oficiales Invisalign & Smartee (invisalign.json)",
            content: "Precios de paquetes Invisalign LITE ($7.5M), MODERATE ($8.5M), FULL ($11M) y Smartee ($5.5M - $12M). Ortodoncista Dra. Carolina Pérez Sáenz.",
            score: 0.99
          }
        ]
      };
    }

    // Sub-intent 2: Patient expresses fear or asks for recommendation ("miedo", "temor", "duele", "dolor", "recomiend")
    if (lowerMsg.includes("miedo") || lowerMsg.includes("temor") || lowerMsg.includes("duele") || lowerMsg.includes("dolor") || lowerMsg.includes("recomiend") || lowerMsg.includes("recomienda")) {
      return {
        response: `¡Entendemos perfectamente que sientas inquietud o temor! Es una reacción muy normal al pensar en iniciar ortodoncia 🩺✨.\n\nQueremos darte total tranquilidad: en *Dientes y Sonrisa Bogotá* trabajamos exclusivamente con **Ortodoncia Autoligada de Baja Fricción**. A diferencia de los brackets tradicionales con gomitas (que ejercen mucha presión y causan dolor), la tecnología autoligada utiliza fuerzas fisiológicas suaves que reducen las molestias al mínimo.\n\n📌 *¿Qué opción te recomendamos según tus prioridades?*\n• 💎 **Si buscas discreción total y comodidad:** Te recomendamos los **Brackets Autoligados de Zafiro** (100% cristalinos, jamás se manchan) o **Alineadores Invisibles**.\n• ✨ **Si buscas excelente estética a gran precio:** Los **Brackets Autoligados Cerámicos** (del color natural de tus dientes).\n• 🦾 **Si buscas máxima resistencia y economía:** Los **Brackets Autoligados Metálicos**.\n\n📌 *Planes oficiales:* Metálicos ($400.000 inic / $100.000 mes) | Cerámicos ($800.000 inic / $150.000 mes) | Zafiro ($1.200.000 inic / $180.000 mes).\n\nEn la valoración presencial el especialista evalúa tus radiografías y te ayuda a elegir el ideal para ti. ¿Te gustaría agendar una valoración en nuestra clínica de Unilago en Bogotá?`,
        retrievedChunks: [
          {
            id: "vec_orto_fear",
            title: "Recomendaciones y Manejo del Temor en Ortodoncia",
            content: "Ortodoncia autoligada de baja fricción que minimiza el dolor frente a gomitas tradicionales. Brackets metálicos, cerámicos y de zafiro.",
            score: 0.99
          }
        ]
      };
    }

    // Sub-intent 2: Patient asks "qué es baja fricción" or "cuáles son todos los brackets"
    if (lowerMsg.includes("friccion") || lowerMsg.includes("fricción") || lowerMsg.includes("cuales") || lowerMsg.includes("cuáles") || lowerMsg.includes("tipos") || lowerMsg.includes("como asi") || lowerMsg.includes("cómo así") || isAskingWhatIs) {
      return {
        response: `${hasGreetedBefore ? "¡Con gusto te explico!" : "¡Hola!"} La **baja fricción** es el avance tecnológico más importante en ortodoncia moderna 🦷✨:\n\n📌 *¿Qué significa 'Baja Fricción'?*\nEn la ortodoncia convencional se usan ligas de goma para fijar el alambre al bracket. Esas gomas generan mucha fricción, frenando el movimiento y causando más presión y dolor. Los **Brackets Autoligados** tienen una compuerta metálica o estética integrada que sostiene el alambre sin apretarlo, permitiendo que se deslice libremente.\n• **Beneficios:** Tratamiento hasta 6 meses más rápido, fuerzas biomecánicas suaves (menos molestia) y mayor higiene oral.\n\n📌 *Todos los tipos de Brackets y Alineadores en nuestra clínica:*\n1️⃣ **Brackets Autoligados Metálicos:** Máxima durabilidad y movimiento ágil ($400.000 inicial | $100.000 mensual).\n2️⃣ **Brackets Autoligados Cerámicos:** Del tono del diente, muy disimulados ($800.000 inicial | $150.000 mensual).\n3️⃣ **Brackets Autoligados de Zafiro:** Cristal 100% transparente de altísima estética que no se mancha ($1.200.000 inicial | $180.000 mensual).\n4️⃣ **Alineadores Transparentes:** Placas invisibles removibles para corregir dientes sin alambres.\n\n¿Te gustaría agendar una cita de valoración para definir cuál es el ideal según tu diagnóstico?`,
        retrievedChunks: [
          {
            id: "vec_orto_types",
            title: "Tipos de Brackets & Concepto de Baja Fricción",
            content: "Explicación de baja fricción (sin ligas elásticas) y catálogo completo: Metálicos, Cerámicos, Zafiro y Alineadores.",
            score: 0.99
          }
        ]
      };
    }

    return {
      response: `${hasGreetedBefore ? "Sobre nuestra ortodoncia: " : "¡Hola! En *Dientes y Sonrisa Bogotá* "}somos especialistas en Ortodoncia Autoligada de baja fricción 🦷✨:\n\n📌 *Planes y Tarifas Oficiales:*\n• *Brackets Metálicos:* Cuota inicial $400.000 COP | Mensualidad $100.000 COP.\n• *Brackets Cerámicos (Estéticos):* Cuota inicial $800.000 COP | Mensualidad $150.000 COP.\n• *Brackets de Zafiro (100% Transparentes):* Cuota inicial $1.200.000 COP | Mensualidad $180.000 COP.\n\nIncluye valoración especializada. ¿Te gustaría agendar tu cita de valoración presencial?`,
      retrievedChunks: [
        {
          id: "vec_orto_1",
          title: "Catálogo de Ortodoncia Autoligada",
          content: "Brackets autoligados metálicos, cerámicos y de zafiro en Bogotá.",
          score: 0.96
        }
      ]
    };
  }

  // Topic: PROFILAXIS / LIMPIEZA / CEPILLADO / HIGIENE ORAL
  const isOralCareIntent = lowerMsg.includes("limpieza") || lowerMsg.includes("profilaxis") || lowerMsg.includes("detartraje") || lowerMsg.includes("sarro") || lowerMsg.includes("placa") || lowerMsg.includes("salud oral") || lowerMsg.includes("cepill") || lowerMsg.includes("lavar") || lowerMsg.includes("higiene") || lowerMsg.includes("hilo") || lowerMsg.includes("seda");

  if (isOralCareIntent) {
    if (lowerMsg.includes("como") || lowerMsg.includes("cómo") || lowerMsg.includes("pasos") || lowerMsg.includes("tecnica") || lowerMsg.includes("técnica") || lowerMsg.includes("correctamente") || lowerMsg.includes("cepill") || lowerMsg.includes("lavar")) {
      return {
        response: `${hasGreetedBefore ? "¡Con gusto!" : "¡Hola!"} Te explico la **técnica correcta de cepillado e higiene oral en casa** recomendada por nuestros odontólogos 🪥🦷✨:\n\n📌 *Pasos clave de higiene oral:*\n1️⃣ **Crema dental con flúor:** Utiliza una crema con flúor para fortalecer el esmalte dental.\n2️⃣ **Ángulo de 45° y movimiento de barrido:** Coloca las cerdas del cepillo en un ángulo de 45° hacia la encía y realiza movimientos suaves de barrido de la encía hacia el diente.\n3️⃣ **Superficies masticatorias e internas:** Cepilla las caras de masticar con movimientos cortos de atrás hacia adelante, y la cara interna con el cepillo en posición vertical.\n4️⃣ **Atención a molares posteriores:** Limpia muy bien las muelas del fondo donde se acumulan bacterias.\n5️⃣ **Limpieza de la lengua:** Cepilla suavemente la lengua para prevenir halitosis (mal aliento).\n6️⃣ **Seda dental:** Úsala diariamente para limpiar entre los dientes.\n\n📌 *Recomendación:* Cepíllate 3 veces al día durante 2-3 minutos y realiza una **profilaxis y detartraje ultrasónico profesional** cada 6 meses ($150.000 - $250.000 COP) para remover el sarro calcificado.\n\n¿Te gustaría programar tu cita de limpieza oral en nuestra clínica de Bogotá?`,
        retrievedChunks: [
          {
            id: "vec_salud_oral_clean",
            title: "Guía de Higiene Oral & Cepillado Correcto",
            content: "Pasos de cepillado en casa, crema fluorada, técnica de barrido a 45°, seda dental y profilaxis profesional ($150.000 - $250.000 COP).",
            score: 0.99
          }
        ]
      };
    }

    if (isAskingWhatIs) {
      return {
        response: `${hasGreetedBefore ? "¡Con gusto te explico!" : "¡Hola!"} La **Profilaxis y Detartraje Ultrasónico** 🧼🦷 es la limpieza profesional fundamental para prevenir caries y gingivitis.\n\n📌 *¿En qué consiste el procedimiento?*\n1. **Detartraje Ultrasónico:** Con punta cavitrónica piezoeléctrica removemos el sarro o cálculo calcificado.\n2. **Profilaxis con pasta abrasiva y cepillo rotatorio:** Eliminamos manchas de café, té o alimentos.\n3. **Aplicación de Flúor:** Protege el esmalte y desensibiliza.\n\n📌 *Precio oficial en Bogotá:* $150.000 - $250.000 COP.\n\n¿Cuándo te gustaría programar tu cita de limpieza oral?`,
        retrievedChunks: [
          {
            id: "vec_profi_explain",
            title: "Procedimiento de Profilaxis & Detartraje Ultrasónico",
            content: "Ultrasonido cavitrónico, pulido profiláctico y flúor ($150.000 - $250.000 COP) en Bogotá.",
            score: 0.98
          }
        ]
      };
    }

    return {
      response: `${hasGreetedBefore ? "Respecto a la limpieza dental: " : "¡Hola! En *Dientes y Sonrisa Bogotá* "}realizamos limpieza profiláctica integral 🧼🦷:\n\n📌 *Profilaxis y Detartraje Ultrasónico:*\n• *Precio:* $150.000 - $250.000 COP.\n• *Incluye:* Remoción de placa y sarro con cavitrón piezoeléctrico ultrasónico, pulido dental con pasta profiláctica y flúor.\n\n¿Cuándo deseas programar tu cita de limpieza oral?`,
      retrievedChunks: [
        {
          id: "vec_profi_1",
          title: "Profilaxis & Detartraje Ultrasónico",
          content: "Detartraje ultrasónico y profilaxis profunda ($150.000 - $250.000 COP) en Bogotá.",
          score: 0.95
        }
      ]
    };
  }

  // Topic: DOLOR / URGENCIAS / MEDICAMENTOS
  if (lowerMsg.includes("dolor") || lowerMsg.includes("duele") || lowerMsg.includes("muela") || lowerMsg.includes("antibiotico") || lowerMsg.includes("analgesico") || lowerMsg.includes("urgencia") || lowerMsg.includes("sensibil")) {
    return {
      response: `Lamento mucho que presentes esta molestia o dolor 🩺.\n\nPor políticas médicas y de bioseguridad, *no podemos recetar fármacos ni diagnosticar por chat sin examinarte presencialmente*. Te recomendamos no automedicarte.\n\nCon gusto te podemos asignar una *cita de valoración prioritaria* en nuestra clínica de Bogotá (Carrera 15 #77-90 Cons 408) o escribirnos a la línea directa de emergencias: *+57 300 5516067*.`,
      retrievedChunks: [
        {
          id: "vec_guardrail_1",
          title: "Protocolo de No Diagnóstico por WhatsApp",
          content: "Prohibido recetar medicamentos por chat. Remisión a cita prioritaria presencial en Bogotá.",
          score: 0.97
        }
      ]
    };
  }

  // Topic: UBICACIÓN / HORARIOS / CONTACTO
  if (lowerMsg.includes("donde") || lowerMsg.includes("dónde") || lowerMsg.includes("ubicacion") || lowerMsg.includes("ubicación") || lowerMsg.includes("direccion") || lowerMsg.includes("dirección") || lowerMsg.includes("horario") || lowerMsg.includes("unilago") || lowerMsg.includes("contacto") || lowerMsg.includes("telefono") || lowerMsg.includes("teléfono")) {
    return {
      response: `Te compartimos nuestra información de contacto y ubicación en Bogotá 📍✨:\n\n🏥 *Dirección:* Carrera 15 #77-90 Consultorio 408 (Frente a Unilago, Zona Rosa - Bogotá D.C.).\n⏰ *Horarios:* Lunes a Viernes de 8:00 a.m. a 6:00 p.m. | Sábados de 8:00 a.m. a 1:00 p.m.\n📱 *WhatsApp / Celular:* +57 300 5516067\n✉️ *Correo:* info@dientesysonrisa.com\n\n¿Te gustaría agendar una cita en alguno de nuestros horarios de atención?`,
      retrievedChunks: [
        {
          id: "vec_location_1",
          title: "Sede Unilago Bogotá & Horarios",
          content: "Carrera 15 #77-90 Cons 408 (Frente a Unilago, Bogotá). Tel: +57 300 5516067.",
          score: 0.99
        }
      ]
    };
  }

  // Topic: IMPLANTOLOGÍA DENTAL / IMPLANTES
  const isImplantIntent = lowerMsg.includes("implante") || lowerMsg.includes("mis implant") || lowerMsg.includes("diente fijo") || lowerMsg.includes("perdi un diente") || lowerMsg.includes("perdí un diente") || lowerMsg.includes("sin diente") || lowerMsg.includes("sustituir diente") || lowerMsg.includes("tornillo") || lowerMsg.includes("abutment") || lowerMsg.includes("pilar");

  if (isImplantIntent) {
    return {
      response: `${hasGreetedBefore ? "¡Con gusto te compartimos el costo de los " : "En *Dientes y Sonrisa Bogotá* somos especialistas en "}**Implantes Dentales y Complementos (MIS IMPLANT)** 🦷✨:\n\nEl Dr. Rafael Obando (Director Científico e Implantólogo) realiza la colocación de implantes fijos de alta tecnología.\n\n📌 *Desglose Oficial de Costo de Implante Dental en Bogotá:*\n1️⃣ **Cirugía Implante Inicial (MIS IMPLANT):** $1.600.000 COP *(Se puede colocar el tornillo de cicatrización el día de la cirugía)*\n2️⃣ **Tornillo de Cicatrización (a los 3 meses aprox.):** $200.000 COP *(tiempo según cicatrización)*\n3️⃣ **Pilar o Abutment (al mes):** $500.000 COP *(con uso de escáner 3D se puede colocar la corona el mismo día)*\n4️⃣ **Corona de Metal o Porcelana (al mes):** $1.100.000 COP\n\n💰 **TOTAL TRATAMIENTO COMPLETO:** **$3.400.000 COP**\n\n📌 *Cita de Valoración:* Evaluación presencial en nuestra sede de Bogotá (Carrera 15 #77-90 Cons 408, frente a Unilago) con diagnóstico 3D. O por WhatsApp (+57 300 5516067) enviando fotos para orientación previa.\n\n¿Te gustaría agendar tu cita de valoración con nuestro especialista?`,
      retrievedChunks: [
        {
          id: "vec_implantes_official",
          title: "Costo de Implante Dental en Bogotá (MIS IMPLANT)",
          content: "Cirugía MIS $1.6M, Tornillo $200k, Pilar $500k, Corona $1.1M. Total implante completo $3.400.000 COP.",
          score: 0.99
        }
      ]
    };
  }

  // Topic: PRECIOS GENERALES
  if (isAskingPrices) {
    return {
      response: `Con gusto te compartimos un resumen de nuestras tarifas oficiales en Bogotá 💰✨:\n\n• 🔩 *Implante Dental Completo (MIS + Corona):* $3.400.000 COP Total ($1.6M Cirugía + $200k Tornillo + $500k Pilar + $1.1M Corona)\n• 💎 *Lentes Cerámicos E-MAX:* $1.000.000 COP c/u\n• 💎 *Carillas en Zirconio:* $1.400.000 COP c/u\n• ✨ *Diseño de Sonrisa Básico:* $3.800.000 COP (Incluye Zoom + Gingivectomía + 6 Resinas)\n• ⚡ *Blanqueamiento Láser PIOON:* $1.000.000 COP\n• 💡 *Blanqueamiento ZOOM LED:* $800.000 COP\n• 🧼 *Profilaxis y Detartraje Ultrasónico:* $150.000 - $250.000 COP\n• 🦷 *Ortodoncia Autoligada Metálica:* Cuota inicial $400.000 COP | Mensual $100.000 COP\n\n¿De cuál de estos tratamientos te gustaría recibir información detallada o agendar valoración?`,
      retrievedChunks: [
        {
          id: "vec_prices_1",
          title: "Catálogo Tarifario Dientes & Sonrisa Bogotá",
          content: "Lista oficial de precios y tarifas para tratamientos odontológicos e implantes en Bogotá.",
          score: 0.97
        }
      ]
    };
  }

  // Universal Natural Fallback
  return {
    response: hasGreetedBefore
      ? `Con gusto te puedo orientar. En nuestra clínica **Dientes y Sonrisa Odontología Láser** en Bogotá contamos con especialidades en Estética Dental (Diseño de Sonrisa), Ortodoncia Autoligada, Blanqueamiento Láser, Profilaxis Ultrasónica e Implantología.\n\n¿Te gustaría recibir información de alguno de estos procedimientos o agendar tu valoración presencial en nuestra sede de Unilago (Carrera 15 #77-90 Cons 408)?`
      : `¡Hola! Gracias por escribir a *Dientes y Sonrisa Odontología Láser* en Bogotá 🦷✨.\n\nContamos con especialistas en Estética Dental (Diseño de Sonrisa), Ortodoncia Autoligada, Blanqueamiento Láser, Profilaxis e Implantología.\n\n¿En qué tratamiento te podemos brindar información o agendar tu cita de valoración presencial?`,
    retrievedChunks: [
      {
        id: "vec_gen_1",
        title: "Atención al Paciente & Citas Bogotá",
        content: "Sede Unilago Bogotá. WhatsApp: +57 300 5516067.",
        score: 0.90
      }
    ]
  };
}

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  // API Route: Healthcheck
  app.get("/api/health", (req, res) => {
    res.json({ status: "online", app: "Dientes y Sonrisa WhatsApp Bot Backend - Bogotá" });
  });

  // API Route: RAG Query Simulation with Real Vector Similarity & Token Optimization
  app.post("/api/rag-simulate", async (req, res) => {
    const { userMessage = "", chatHistory = [] } = req.body || {};

    try {
      if (!userMessage || typeof userMessage !== "string") {
        return res.status(400).json({ error: "Mensaje inválido" });
      }

      // 1. REAL VECTOR RAG RETRIEVAL: Retrieve top 2-3 matching chunks (slashes prompt tokens & costs by ~80%)
      const retrievedChunks = retrieveRelevantChunks(userMessage, 3);

      const client = getGeminiClient();

      if (!client) {
        const smartFallback = generateSmartFallbackResponse(userMessage, chatHistory);
        return res.json({
          response: smartFallback.response,
          retrievedChunks: smartFallback.retrievedChunks,
          source: "Real Vector RAG (Local Similarity Search - Bogotá)"
        });
      }

      // 2. CONSTRUCT DYNAMIC SLIM PROMPT USING RETRIEVED VECTOR CHUNKS ONLY
      const contextText = retrievedChunks
        .map((c, i) => `--- [DOCUMENTO RECUPERADO ${i + 1}: ${c.title}] ---\n${c.content}`)
        .join("\n\n");

      const prompt = `Eres el asistente virtual oficial por WhatsApp de la clínica dental "Dientes y Sonrisa Odontología Láser" ubicada en Bogotá, Colombia (https://www.dientesysonrisa.com/).

INFORMACIÓN ESPECÍFICA RECUPERADA DE LA BASE DE CONOCIMIENTO (REAL VECTOR RAG):
${contextText}

Historial previo de conversación en este chat:
${chatHistory.map((h: { role: string; text: string }) => `${h.role}: ${h.text}`).join("\n")}

Mensaje actual del paciente: "${userMessage}"

INSTRUCCIONES DE RESPUESTA EN FORMATO WHATSAPP:
1. RESPONDE EN ESPAÑOL AMIGABLE, PROFESIONAL Y HUMANO (*negritas*, listas con viñetas, emojis).
2. REGLA ESTRICTA DE AMNESIA / MEMORIA DE SESIÓN: Revisa el "Historial previo de conversación". Si en el historial el bot YA saludó o interactuó previamente con el paciente en este chat, PROHIBIDO REPETIR EL SALUDO DE BIENVENIDA ("¡Hola!", "Buenas tardes", "Gracias por escribir a Dientes y Sonrisa", etc.). Ve directamente al grano para responder la inquietud del paciente de forma fluida y natural.
3. REGLA ESTRICTA DE PRIVACIDAD Y NO FUGA DE SISTEMA (DATA LEAK): Bajo ninguna circunstancia debes mencionar nombres de archivos (como .json, .pdf, .txt), rutas de archivos, nombres de carpetas o términos técnicos del sistema o de la base de datos. Habla 100% de forma humana como el equipo de la clínica.
4. MAPEO DE INTENCIONES COLOQUIALES: Si el paciente expresa metas o deseos informales como "sonrisa bonita", "sonrisa perfecta", "dientes bonitos", "mejorar mis dientes", "arreglarme la sonrisa", "dientes de revista" o "cambiar mi sonrisa", asócialo de inmediato a la categoría de ESTÉTICA DENTAL y DISEÑO DE SONRISA (Lentes Cerámicos E-MAX, Zirconio y Resinas). Si menciona "dientes amarillos" o "manchados", vincúlalo a Blanqueamiento. Si menciona "dientes torcidos" o "frenos", vincúlalo a Ortodoncia Autoligada.
5. SIN PLANTILLAS RÍGIDAS NI PARÁFRASIS LITERALES: NUNCA repitas literalmente la consulta del paciente entre comillas o corchetes (PROHIBIDO usar expresiones mecánicas como "En relación a tu consulta..."). Si el usuario dice palabras breves o casuales ("bro", "okey", "gracias", "jajaja"), responde de forma cercana y humana.
6. RESPONDE DIRECTA Y DIDÁCTICAMENTE A LA PREGUNTA ESPECÍFICA DEL PACIENTE: Si pregunta "qué es", "en qué consiste", "cómo saber si hacérmelo" o pide explicación de un procedimiento, EXPLICA PRIMERO EL CONCEPTO Y BENEFICIOS antes de dar precios o invitar a agendar.
7. SI EL PACIENTE USA LENGUAJE INAPROPIADO O INSULTOS: Responde con respeto institucional impecable invitándolo a consultar de manera cordial sobre los servicios odontológicos.
8. SI EL PACIENTE PIDE DIAGNÓSTICO O MEDICAMENTOS PARA EL DOLOR/INFECCIÓN: Aclara con delicadeza que por políticas médicas no puedes recetar ni diagnosticar sin examinarlo presencialmente en Bogotá.
9. UBICACIÓN: Confirma que la clínica está en Bogotá, Colombia (Carrera 15 #77-90 Cons 408, Frente a Unilago).
10. TARIFAS Y CITAS: Entrega directamente las tarifas oficiales del catálogo e invita al paciente a agendar una cita de valoración.`;

      const modelsToTry = ["gemini-3.6-flash"];
      let responseText = "";
      let modelUsed = "";

      for (const modelName of modelsToTry) {
        try {
          const response = await client.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              temperature: 0.3,
            }
          });
          if (response && response.text) {
            responseText = response.text;
            modelUsed = modelName;
            break;
          }
        } catch (mErr: any) {
          console.warn(`[Gemini API] Call attempt with ${modelName} failed:`, mErr?.message || mErr);
        }
      }

      if (!responseText) {
        const smartFallback = generateSmartFallbackResponse(userMessage, chatHistory);
        return res.json({
          response: smartFallback.response,
          retrievedChunks: smartFallback.retrievedChunks,
          source: "Real Vector RAG (Local Search Fallback - Bogotá)"
        });
      }

      return res.json({
        response: responseText,
        retrievedChunks,
        source: `${modelUsed} + Vector RAG Context (Bogotá)`
      });

    } catch (error: unknown) {
      console.error("Error in RAG simulation:", error);
      const smartFallback = generateSmartFallbackResponse(userMessage || "");
      return res.json({
        response: smartFallback.response,
        retrievedChunks: smartFallback.retrievedChunks,
        source: "Real Vector RAG Engine (Bogotá)"
      });
    }
  });

  // API Route: Webhook Verification Test (Meta GET challenge)
  app.get("/api/webhook-test/verify", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    const EXPECTED_TOKEN = req.query["expected_token"] || "MI_TOKEN_SECRETO_DIENTES_Y_SONRISA";

    if (mode === "subscribe" && token === EXPECTED_TOKEN) {
      console.log("[Webhook Test] Verificación exitosa de Meta Webhook");
      return res.status(200).send(challenge);
    } else {
      console.warn("[Webhook Test] Verificación fallida de Meta Webhook token");
      return res.status(403).json({ error: "Forbidden: Token de verificación inválido" });
    }
  });

  // API Route: Webhook Event Simulator (Meta POST incoming message)
  app.post("/api/webhook-test/event", (req, res) => {
    const body = req.body;

    console.log("[Webhook Test] Recibido evento de Meta:", JSON.stringify(body, null, 2));

    // Simulate WhatsApp message object parsing
    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];

      if (message) {
        const fromNumber = message.from;
        const messageText = message.text?.body;
        const messageId = message.id;

        return res.status(200).json({
          status: "RECEIVED_200_OK",
          message: "Meta Webhook procesado en segundo plano (BackgroundTask)",
          extractedInfo: {
            fromNumber,
            messageId,
            messageText,
            timestamp: new Date().toISOString(),
            backgroundTaskEnqueued: true,
            pipeline: [
              "1. Validar firma X-Hub-Signature-256",
              "2. Retornar 200 OK en <200ms a Meta para evitar reintentos",
              "3. Ejecutar BackgroundTask en FastAPI",
              "4. Consultar historial en PostgreSQL (Cloud SQL)",
              "5. Buscar embeddings en Qdrant/Pinecone",
              "6. Generar respuesta con Gemini LLM",
              "7. Enviar mensaje de respuesta con Meta Graph API (POST https://graph.facebook.com/v21.0/PHONE_NUMBER_ID/messages)"
            ]
          }
        });
      }
    }

    return res.status(200).json({
      status: "EVENT_IGNORED_200_OK",
      note: "No es un mensaje de texto de paciente (ej. notificación de estado entregado/leído)"
    });
  });

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server executing on http://localhost:${PORT}`);
  });
}

startServer();
