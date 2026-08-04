import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Knowledge Base & Official Pricing Catalog for "Dientes y Sonrisa Odontología Láser"
const CLINIC_KNOWLEDGE_BASE = `
NOMBRES DE LA CLÍNICA: Dientes & Sonrisa Odontología Láser
SLOGAN: "Esto sucede cuando se trabaja con amor"
SITIO WEB OFICIAL: https://www.dientesysonrisa.com/
DIRECCIÓN BOGOTÁ: Carrera 15 #77-90 Consultorio 408 (Frente a Unilago) - Bogotá D.C., Colombia
WHATSAPP DIRECTO: +57 300 5516067
PBX OFICIAL BOGOTÁ: +57 318 362 5555
EMAIL: info@dientesysonrisa.com
IDIOMAS: Español & English ("We Speak English")
RESEÑAS GOOGLE: 4.9 ★★★★★ (Basado en 330+ opiniones reales de pacientes)
HORARIOS DE ATENCIÓN: Lunes a Viernes: 8:00 AM - 6:00 PM | Sábados: 8:00 AM - 1:00 PM (Previa cita)

DIRECTORES Y EQUIPO DE ESPECIALISTAS:
- Dr. Rafael Obando: Director Científico, Odontólogo Especialista en Odontología Láser e Implantología Oral.
- Dra. Diana Carolina Pérez: Especialista en Ortodoncia y Ortopedia Maxilar (Autoligado, Invisalign, Lingual).

ESTRUCTURA Y BASE DE CONOCIMIENTO COMPLETA (WWW.DIENTESYSONRISA.COM):

1. ESTÉTICA DENTAL:
   - Diseño de Sonrisa Personalizado: Armonización facial digital previa. Evaluado directamente por el Director Científico con 1 año de garantía. Evaluación preliminar por fotos de celular vía WhatsApp gratis (+57 300 5516067).
   - Tarifas y Precios Diseño de Sonrisa Básico ($3.800.000 COP):
     * Blanqueamiento o Aclaramiento Dental LED Zoom: $800.000 COP (Blanqueamiento Láser Diodo costo adicional de +$200.000 COP).
     * Recorte o Diseño de encías con Electrobisturí / Láser (6 dientes anteriores superiores): $600.000 COP.
     * Alargar, cerrar y dar forma a 6 dientes anteriores superiores en Resina de Alta Estética (canino a canino): $2.400.000 COP.
     * Total Diseño de Sonrisa Básico: $3.800.000 COP.
   - Opciones y Materiales de Diseño de Sonrisa:
     * Gingivectomía / Diseño de encía con electrobisturí o Láser Pioon: Desde $380.000 COP.
     * Carillas en Resina de Alta Estética (Cita de 2h con luz día): Desde $280.000 COP por pieza.
     * Lentes Cerámicos / Carillas Disilicato de litio (EMAX - IVOCLAR 0.3mm): $1.000.000 COP c/u.
     * Lentes Cerámicos / Carillas en Zirconio: $1.400.000 COP c/u.
   - Blanqueamiento Dental:
     * Blanqueamiento Láser de Diodo PIOON: $1.000.000 COP (Doble longitud de onda fototérmica y analgésica/antiinflamatoria).
     * Blanqueamiento Dental ZOOM (Luz LED fría): $800.000 COP (2 sesiones de 45 min en clínica).
     * Blanqueamiento Casero con Cubetas/Acetatos blandos Exiss (Peróxido carbamida 10-15%): $800.000 COP.

2. ORTODONCIA (PRECIOS Y TARIFAS VIGENTES 2026 EN BOGOTÁ):
   - Ortodoncia Convencional Metálica MBT / ROTH:
     * Montaje Sup: $650.000 COP | Inf: $650.000 COP | 18 cuotas x $90.000 COP | Retenedores: $700.000 COP | Total: $3.620.000 COP.
   - Ortodoncia Convencional Synergy:
     * Montaje Sup: $850.000 COP | Inf: $850.000 COP | 18 cuotas x $120.000 COP | Retenedores: $700.000 COP | Total: $4.560.000 COP.
   - Brackets Estéticos Zafiro Ice (Cristal Transparente Inalterable):
     * Montaje Sup: $1.100.000 COP | Inf: $1.100.000 COP | 18 cuotas x $180.000 COP | Retenedores: $700.000 COP | Total: $6.140.000 COP.
   - Ortodoncia de Autoligado Metálico Standard (Carriere / Empower / H4 / 3M Victory):
     * Montaje Sup: $1.200.000 COP | Inf: $1.200.000 COP | 18 cuotas x $220.000 COP | Retenedores: $700.000 COP | Total: $7.060.000 COP.
   - Autoligado Metálico Damon Q2 / Pitts 21:
     * Montaje Sup: $1.600.000 COP | Inf: $1.600.000 COP | 18 cuotas x $220.000 COP | Retenedores: $700.000 COP | Total: $7.860.000 COP.
   - Autoligado Metálico Damon Ultima:
     * Montaje Sup: $2.100.000 COP | Inf: $2.100.000 COP | 18 cuotas x $250.000 COP | Retenedores: $700.000 COP | Total: $9.400.000 COP.
   - Autoligado Transparente Damon Clear:
     * Brackets Sup: $2.200.000 COP | Inf: $2.200.000 COP | 18 cuotas x $250.000 COP | Retenedores: $700.000 COP | Total: $9.600.000 COP.
   - Ortodoncia Lingual Invisible 2D Forestadent (Por detrás de los dientes):
     * Montaje Sup: $2.200.000 COP | Inf: $2.200.000 COP | 18 cuotas x $250.000 COP | Retenedores: $700.000 COP | Total: $9.600.000 COP.
   - Ortodoncia Invisible y Alineadores Transparentes (Invisalign & Smartee):
     * Especialista Certificada: Dra. Carolina Pérez Sáenz (Ortodoncista Universidad Javeriana, Invisalign Certified).
     * Invisalign Paquete LITE (14 alineadores): $7.500.000 COP
     * Invisalign Paquete MODERATE (26 alineadores): $8.500.000 COP
     * Invisalign Paquete FULL COMPREHENSIVE (Todos sin límite): $11.000.000 COP
     * Exámenes complementarios Invisalign (RX, fotos, scanner 3D): $350.000 COP aprox.
     * Smartee Paquete MINI (10 alineadores): $5.500.000 COP
     * Smartee Paquete LITE (25 alineadores): $7.500.000 COP
     * Smartee Paquete EXPRESS (40 alineadores): $9.000.000 COP
     * Smartee Paquete INFINITY (Todos incluidos): $11.000.000 COP
     * Smartee Paquete ALFA (14/8): $12.000.000 COP
     * Exámenes complementarios Smartee: $250.000 COP aprox.
     * Cita de orientación virtual sin costo por WhatsApp (+57 300 5516067) enviando fotos. Cita presencial abonable al tratamiento.

3. IMPLANTOLOGÍA DENTAL (COSTO DE IMPLANTE DENTAL EN BOGOTÁ Y COMPLEMENTOS):
   - Especialista Responsable: Dr. Rafael Obando (Director Científico, Odontólogo Especialista en Odontología Láser e Implantología Oral).
   - Desglose Oficial de Fases y Costos (Sistema MIS IMPLANT):
     1. Cirugía implante - Inicial MIS IMPLANT (Se puede colocar el Tornillo de cicatrización el día de la cirugía): $1.600.000 COP
     2. A los 3 meses - Tornillo de cicatrización (Puede variar los tiempos según cicatrización): $200.000 COP
     3. Al mes - Pilar o Abutment (Con el uso del escáner 3D se puede colocar la corona el mismo día): $500.000 COP
     4. Al mes - Corona de Metal o Porcelana: $1.100.000 COP
     - TOTAL IMPLANTE DENTAL COMPLETO CON CORONA Y ABUTMENT: $3.400.000 COP.

4. CIRUGÍA ORAL Y REHABILITACIÓN:
   - Bichectomía: Extracción de bolsas grasas de Bichat para perfilamiento facial (30 min, anestesia local).
   - Endodoncia Asistida por Láser: Desde $550.000 COP por conducto (99.8% efectividad bactericida).
   - Periodoncia Bogotá (Enfermedad Periodontal, Gingivitis y Periodontitis/Piorrea): Desde $290.000 COP por cuadrante. Tratamientos no quirúrgicos (limpieza ultrasónica profunda, alisado radicular, desinfección láser) y procedimientos quirúrgicos (cirugía de colgajo/reducción de bolsas, injertos de tejido blando del paladar e injertos óseos). Consulta presencial o de orientación por WhatsApp sin costo (+57 300 5516067).
   - Prótesis Dentales Bogotá (Fijas, Removibles y Dentaduras Postizas): Dientes y encías artificiales a la medida. Precios oficiales por prótesis:
     * AKERS Flexible (Parcial económica en 3 días): $700.000 COP
     * Prótesis Acrílico Nacional NEW STETIC: $1.000.000 COP
     * Prótesis Acrílico Importado DENTSPLY: $1.200.000 COP
     * Prótesis Alto Impacto LUCITONE DENTSPLY: $1.400.000 COP
     * Prótesis Flexible Irrompible FLEXITE PLUS DENTSPLY: $1.600.000 COP
     * Materiales premium: Dientes acrílicos New Stetic, Dentsply, Lucitone y Porcelana Ivoclar Vivadent.
   - Cordales (Molares del juicio) y Cirugía Oral.

5. ODONTOLOGÍA LÁSER Y ODONTOPEDIATRÍA:
   - Odontología Láser: Caries sin ruido de motor/torno, sin vibración.
   - Odontopediatría Especializada:
     * Para Bebés: Frenectomía lingual láser para lactancia materna sin dolor.
     * Para Adolescentes: Ortodoncia preventiva, sellantes y prevención de placa.
     * Personas con Discapacidades / Odontofobia: Atención empática, entornos adaptados y tecnología láser sin ruido agresivo.


REGLAS STRICTAS DE ATENCIÓN DEL BOT:
1. Dar precios exactos cuando los soliciten (autoligado, blanqueamiento, implantes, etc.).
2. Mencionar al Dr. Rafael Obando (Director Científico) o la Dra. Diana Carolina Pérez cuando pregunten por el equipo médico o especialistas.
3. Informar la ubicación: Carrera 15 #77-90 Consultorio 408 (Frente a Unilago), Bogotá D.C.
4. PROHIBIDO RECETAR MEDICAMENTOS: Si manifiestan dolor agudo, derivar de inmediato a urgencia presencial o comunicación directa por WhatsApp (+57 300 5516067).
5. TONO: Amable, empático, profesional y estructurado con emojis (*negritas*, viñetas).
`;

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

  // Universal Natural Fallback (No mechanical templates, no quoting user phrases)
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

  // API Route: RAG Query Simulation (calls Gemini with clinic knowledge base context)
  app.post("/api/rag-simulate", async (req, res) => {
    try {
      const { userMessage, chatHistory = [] } = req.body;

      if (!userMessage || typeof userMessage !== "string") {
        return res.status(400).json({ error: "Mensaje inválido" });
      }

      const client = getGeminiClient();

      if (!client) {
        const smartFallback = generateSmartFallbackResponse(userMessage, chatHistory);
        return res.json({
          response: smartFallback.response,
          retrievedChunks: smartFallback.retrievedChunks,
          source: "Simulated RAG (Local Knowledge Base - Bogotá)"
        });
      }

      // Live Gemini call with system prompt containing strict clinic context
      const prompt = `Eres el asistente virtual oficial por WhatsApp de la clínica dental "Dientes y Sonrisa Odontología Láser" ubicada en Bogotá, Colombia (https://www.dientesysonrisa.com/).

A continuación tienes la BASE DE CONOCIMIENTO exclusiva de la clínica:
---
${CLINIC_KNOWLEDGE_BASE}
---

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
10. TARIFAS Y CITAS: Entrega directamente las tarifas oficiales del catálogo e invita al paciente a agendar una cita de valoración.
11. ATENCIÓN PERSONALIZADA A TEMORES Y DUDAS ESPECÍFICAS DE ORTODONCIA:
    - Si el paciente dice "tengo miedo" o teme al dolor de los brackets, tranquilízalo/a explicando de forma empática que en la clínica usamos Ortodoncia Autoligada de Baja Fricción, que usa fuerzas biológicas suaves que no duelen como los brackets con gomitas. Recomiéndale opciones según sus prioridades (Zafiro/Alineadores para estética e higiene, Metálicos para presupuesto).
    - Si el paciente pregunta "¿cómo así baja fricción?" o "¿cuáles son todos los brackets?", explícale que "baja fricción" significa sin gomitas elásticas (un clip sostiene el alambre suavemente) y detalla TODOS los tipos de brackets (Metálicos, Cerámicos, Zafiro 100% transparente y Alineadores Invisibles).`;

      const modelsToTry = ["gemini-3.6-flash", "gemini-3.1-pro-preview"];
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
          source: "Simulated RAG (Local Knowledge Base - Bogotá)"
        });
      }

      const retrievedChunks = [
        {
          id: "vec_001",
          title: "Tecnología Láser y Precios - Dientes y Sonrisa Bogotá",
          content: "Láser de Diodo y Erbio para blanqueamiento, periodoncia, endodoncia y remoción de caries sin ruido de broca en Bogotá.",
          score: 0.95
        },
        {
          id: "vec_002",
          title: "Políticas de Valoración Médica y Citas",
          content: "Precios orientativos. Requerida valoración presencial en Bogotá. No recetas ni diagnósticos por chat.",
          score: 0.91
        },
        {
          id: "vec_003",
          title: "Ubicación Bogotá y Horarios de Atención",
          content: "Bogotá, Colombia (www.dientesysonrisa.com). Lun-Vie 8am-6pm, Sáb 8am-1pm.",
          score: 0.88
        }
      ];

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
        source: "RAG Knowledge Base Engine (Bogotá)"
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
