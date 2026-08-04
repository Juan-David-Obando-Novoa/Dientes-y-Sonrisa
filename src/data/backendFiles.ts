export interface CodeFile {
  id: string;
  filename: string;
  path: string;
  category: 'core' | 'api' | 'services' | 'db' | 'config' | 'deploy';
  language: 'python' | 'dockerfile' | 'plaintext' | 'markdown' | 'env';
  description: string;
  code: string;
}

export const BACKEND_FILES: CodeFile[] = [
  {
    id: "req_txt",
    filename: "requirements.txt",
    path: "requirements.txt",
    category: "config",
    language: "plaintext",
    description: "Dependencias de producción para FastAPI, RAG (LangChain + Gemini), SQLAlchemy y Meta API.",
    code: `# Framework Web Asíncrono & Servidor ASGI
fastapi>=0.110.0
uvicorn[standard]>=0.28.0
gunicorn>=21.2.0
pydantic>=2.6.0
pydantic-settings>=2.2.0

# Cliente HTTP Asíncrono para Meta WhatsApp Graph API
httpx>=0.27.0

# Motor RAG & Integración LLM (LangChain + Google Gemini)
langchain>=0.1.13
langchain-community>=0.0.29
langchain-google-genai>=1.0.1
google-genai>=2.4.0

# Bases de Datos Vectoriales para RAG (Descomentar según proveedor preferido)
qdrant-client>=1.8.0
# pinecone-client>=3.1.0
# chromadb>=0.4.24

# Base de Datos Relacional (PostgreSQL para Cloud SQL) & ORM
SQLAlchemy>=2.0.28
psycopg2-binary>=2.9.9
alembic>=1.13.1

# Procesamiento de Documentos PDF/FAQs para RAG
pypdf>=4.1.0
tiktoken>=0.6.0

# Utilidades y Variables de Entorno
python-dotenv>=1.0.1
python-multipart>=0.0.9
`
  },
  {
    id: "main_py",
    filename: "main.py",
    path: "main.py",
    category: "core",
    language: "python",
    description: "Punto de entrada principal de la aplicación FastAPI con configuración de ciclo de vida y rutas.",
    code: `"""
Dientes y Sonrisa Odontología Láser - WhatsApp Business Bot Backend
Arquitectura: Clean Architecture
Despliegue: Google Cloud Run
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.api.routes import webhook
from app.db.database import init_db

# Configuración de Logging Estructurado
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - [%(levelname)s] - %(message)s"
)
logger = logging.getLogger("dientes_sonrisa_bot")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Gestión del ciclo de vida de la aplicación.
    Inicializa conexiones a PostgreSQL (Cloud SQL) y base vectorial al arrancar.
    """
    logger.info("Starting 'Dientes y Sonrisa' WhatsApp Bot Backend Service...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    
    # Inicializar tablas de base de datos
    try:
        init_db()
        logger.info("Database schemas initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing DB: {e}")
        
    yield
    
    logger.info("Shutting down 'Dientes y Sonrisa' Backend Service...")


app = FastAPI(
    title="Dientes y Sonrisa Odontología Láser - WhatsApp Bot API",
    description="Backend en FastAPI con RAG (Gemini + Vector DB) y Webhook de Meta para WhatsApp Business.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url=None
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir Rutas de la API (Clean Architecture)
app.include_router(webhook.router, prefix="/api/v1", tags=["WhatsApp Webhook"])


@app.get("/health", tags=["System"])
async def health_check():
    """Endpoint de comprobación de estado para Google Cloud Run Health Checks."""
    return {
        "status": "healthy",
        "service": "dientes-sonrisa-whatsapp-bot",
        "clinic": "Dientes y Sonrisa Odontología Láser",
        "version": "1.0.0"
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Manejo global de excepciones para evitar caídas del servidor."""
    logger.error(f"Unhandled error processing request {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "message": "Ocurrió un error inesperado en el servidor."}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
`
  },
  {
    id: "config_py",
    filename: "config.py",
    path: "app/core/config.py",
    category: "config",
    language: "python",
    description: "Configuración centralizada con Pydantic BaseSettings cargando variables de entorno.",
    code: `"""
Módulo de Configuración de Entorno (Core)
"""
from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional


class Settings(BaseSettings):
    # Entorno y Servidor
    ENVIRONMENT: str = Field(default="development", env="ENVIRONMENT")
    PORT: int = Field(default=8080, env="PORT")
    
    # Meta WhatsApp Business API
    META_VERIFY_TOKEN: str = Field(..., env="META_VERIFY_TOKEN", description="Token de verificación del Webhook en Meta")
    META_ACCESS_TOKEN: str = Field(..., env="META_ACCESS_TOKEN", description="Token de acceso permanente de Meta Graph API")
    META_PHONE_NUMBER_ID: str = Field(..., env="META_PHONE_NUMBER_ID", description="ID de teléfono de WhatsApp Business")
    META_GRAPH_VERSION: str = Field(default="v21.0", env="META_GRAPH_VERSION")
    
    # Motor de IA (Google Gemini)
    GEMINI_API_KEY: str = Field(..., env="GEMINI_API_KEY", description="API Key de Google Gemini")
    LLM_MODEL_NAME: str = Field(default="gemini-3.6-flash", env="LLM_MODEL_NAME")
    
    # Base de Datos Vectorial (Qdrant / Pinecone)
    VECTOR_DB_TYPE: str = Field(default="qdrant", env="VECTOR_DB_TYPE") # 'qdrant', 'pinecone', 'pgvector'
    QDRANT_URL: Optional[str] = Field(default=None, env="QDRANT_URL")
    QDRANT_API_KEY: Optional[str] = Field(default=None, env="QDRANT_API_KEY")
    PINECONE_API_KEY: Optional[str] = Field(default=None, env="PINECONE_API_KEY")
    PINECONE_ENVIRONMENT: Optional[str] = Field(default=None, env="PINECONE_ENVIRONMENT")
    VECTOR_COLLECTION_NAME: str = Field(default="dientes_sonrisa_kb", env="VECTOR_COLLECTION_NAME")
    
    # Base de Datos Relacional (Cloud SQL PostgreSQL)
    DATABASE_URL: str = Field(
        default="postgresql://user:password@localhost:5432/dientes_sonrisa_db",
        env="DATABASE_URL",
        description="String de conexión SQLAlchemy para PostgreSQL"
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
`
  },
  {
    id: "webhook_py",
    filename: "webhook.py",
    path: "app/api/routes/webhook.py",
    category: "api",
    language: "python",
    description: "Controlador del Webhook de Meta (WhatsApp API) con GET para verificación y POST con BackgroundTasks.",
    code: `"""
Enrutador de Webhook de WhatsApp Business (Meta API)
Ruta: /api/v1/webhook
"""

from fastapi import APIRouter, Request, Query, Response, BackgroundTasks, HTTPException, Depends
from fastapi.responses import PlainTextResponse
import logging

from app.core.config import settings
from app.models.schemas import WhatsAppWebhookPayload
from app.services.bot_logic import process_whatsapp_message

logger = logging.getLogger("webhook_router")
router = APIRouter()


@router.get("/webhook", response_class=PlainTextResponse)
async def verify_webhook(
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_verify_token: str = Query(None, alias="hub.verify_token"),
    hub_challenge: str = Query(None, alias="hub.challenge")
):
    """
    Endpoint GET que Meta invoca para verificar la URL del Webhook.
    Valida que hub.verify_token coincida con META_VERIFY_TOKEN y retorna hub.challenge.
    """
    logger.info("Meta Webhook verification request received.")
    
    if hub_mode == "subscribe" and hub_verify_token == settings.META_VERIFY_TOKEN:
        logger.info("Webhook verification SUCCESS! Returning challenge.")
        return hub_challenge
    else:
        logger.warning(f"Webhook verification FAILED. Token recibido: '{hub_verify_token}' no coincide.")
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Verification token mismatch"
        )


@router.post("/webhook")
async def receive_whatsapp_event(
    request: Request,
    background_tasks: BackgroundTasks
):
    """
    Endpoint POST que recibe eventos y mensajes de Meta WhatsApp API.
    CRÍTICO: Procesa el mensaje en segundo plano (BackgroundTasks) para responder 200 OK inmediatamente a Meta
    y evitar que Meta re-intente enviar el mensaje en bucle.
    """
    try:
        payload_dict = await request.json()
        logger.info(f"Incoming Meta Event: {payload_dict}")
    except Exception as e:
        logger.error(f"Error parsing JSON payload: {e}")
        return Response(status_code=400, content="Invalid JSON")

    # Extraer mensajes entrantes del payload de Meta
    entries = payload_dict.get("entry", [])
    for entry in entries:
        changes = entry.get("changes", [])
        for change in changes:
            value = change.get("value", {})
            messages = value.get("messages", [])
            contacts = value.get("contacts", [])
            
            if messages:
                for msg in messages:
                    # Extraer teléfono del remitente y contenido
                    patient_phone = msg.get("from")
                    msg_id = msg.get("id")
                    msg_type = msg.get("type")
                    
                    patient_name = "Paciente"
                    if contacts:
                        patient_name = contacts[0].get("profile", {}).get("name", "Paciente")
                    
                    if msg_type == "text":
                        text_body = msg.get("text", {}).get("body", "")
                        logger.info(f"Nuevo mensaje de {patient_name} ({patient_phone}): '{text_body}'")
                        
                        # ENCOLAR TAREA EN SEGUNDO PLANO
                        background_tasks.add_task(
                            process_whatsapp_message,
                            patient_phone=patient_phone,
                            patient_name=patient_name,
                            message_text=text_body,
                            message_id=msg_id
                        )
                    else:
                        logger.info(f"Mensaje omitido (tipo no soportado: {msg_type})")
                        
    # Retornar 200 OK INMEDIATAMENTE a Meta
    return Response(status_code=200, content="EVENT_RECEIVED")
`
  },
  {
    id: "bot_logic_py",
    filename: "bot_logic.py",
    path: "app/services/bot_logic.py",
    category: "services",
    language: "python",
    description: "Orquestador de lógica del bot: coordina persistencia en PostgreSQL, consulta a RAG y envío por Meta API.",
    code: `"""
Orquestador Principal de Lógica de Negocio del Bot de WhatsApp
"""

import logging
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.models import PatientSession, ChatMessage
from app.services.rag_service import rag_service
from app.services.whatsapp_service import send_whatsapp_text_message

logger = logging.getLogger("bot_logic")


async def process_whatsapp_message(
    patient_phone: str,
    patient_name: str,
    message_text: str,
    message_id: str
):
    """
    Tarea en segundo plano que procesa el mensaje de WhatsApp:
    1. Registra/obtiene sesión del paciente en PostgreSQL (Cloud SQL).
    2. Guarda el mensaje del usuario en el historial.
    3. Recupera historial previo para contexto de conversación.
    4. Invoca al Servicio RAG con la Base de Conocimiento de Dientes y Sonrisa.
    5. Guarda la respuesta generada en el historial.
    6. Envía la respuesta formateada al paciente vía WhatsApp Graph API.
    """
    logger.info(f"[BG Task] Procesando mensaje para {patient_phone}...")
    db: Session = SessionLocal()
    
    try:
        # 1. Obtener o crear sesión del paciente
        session_obj = db.query(PatientSession).filter(PatientSession.phone_number == patient_phone).first()
        if not session_obj:
            session_obj = PatientSession(
                phone_number=patient_phone,
                patient_name=patient_name
            )
            db.add(session_obj)
            db.commit()
            db.refresh(session_obj)
        
        # 2. Guardar mensaje entrante en la BD
        user_msg = ChatMessage(
            session_id=session_obj.id,
            sender="patient",
            message_text=message_text,
            meta_message_id=message_id
        )
        db.add(user_msg)
        db.commit()
        
        # 3. Obtener historial reciente de mensajes (últimos 6 mensajes)
        history_msgs = (
            db.query(ChatMessage)
            .filter(ChatMessage.session_id == session_obj.id)
            .order_by(ChatMessage.created_at.desc())
            .limit(6)
            .all()
        )
        
        # Formatear historial para el prompt RAG
        formatted_history = []
        for h_msg in reversed(history_msgs[:-1]): # Excluir el último recién insertado
            formatted_history.append({
                "role": "human" if h_msg.sender == "patient" else "assistant",
                "content": h_msg.message_text
            })
            
        # 4. Generar respuesta con el motor RAG
        bot_response_text = await rag_service.query_knowledge_base(
            user_query=message_text,
            chat_history=formatted_history
        )
        
        # 5. Guardar respuesta del bot en la BD
        bot_msg = ChatMessage(
            session_id=session_obj.id,
            sender="bot",
            message_text=bot_response_text
        )
        db.add(bot_msg)
        db.commit()
        
        # 6. Enviar mensaje por WhatsApp Graph API
        send_success = await send_whatsapp_text_message(
            recipient_phone=patient_phone,
            message_body=bot_response_text
        )
        
        if send_success:
            logger.info(f"[BG Task] Respuesta enviada exitosamente a {patient_phone}.")
        else:
            logger.error(f"[BG Task] Falló el envío del mensaje a {patient_phone}.")
            
    except Exception as e:
        logger.error(f"[BG Task] Error crítico procesando bot_logic: {e}", exc_info=True)
        # Mensaje de contingencia al paciente en caso de fallo técnico
        fallback_msg = (
            "¡Hola! Gracias por escribir a *Dientes y Sonrisa Odontología Láser* 🦷✨.\n\n"
            "En este momento estamos experimentando una breve pausa técnica. "
            "Un asesor de nuestro equipo se comunicará contigo en breve para resolver tus dudas o agendar tu cita."
        )
        await send_whatsapp_text_message(patient_phone, fallback_msg)
        
    finally:
        db.close()
`
  },
  {
    id: "rag_service_py",
    filename: "rag_service.py",
    path: "app/services/rag_service.py",
    category: "services",
    language: "python",
    description: "Servicio RAG con LangChain/Gemini, prompt de seguridad odontológica y conexión para base vectorial.",
    code: `"""
Servicio RAG (Retrieval-Augmented Generation) para Dientes y Sonrisa Odontología Láser
Módulo base pluggable preparado para Qdrant, Pinecone o PGVector
"""

import logging
from typing import List, Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate

from app.core.config import settings

logger = logging.getLogger("rag_service")

# Prompt del Sistema especializado con Límites Éticos y Médicos Claros
SYSTEM_RAG_PROMPT = """
Eres "DienteBot", el asistente virtual de inteligencia artificial de la clínica dental "Dientes y Sonrisa Odontología Láser".
Tu objetivo es brindar información precisa, amable y clara sobre los tratamientos odontológicos con tecnología láser de la clínica, precios orientativos y disponibilidad de citas.

A continuación tienes el CONTEXTO OFICIAL extraído de los documentos de la clínica (PDFs de tratamientos y FAQs):
====================================
{context}
====================================

Historial reciente de la conversación:
{chat_history}

Pregunta del paciente: {user_query}

REGLAS STRICTAS DE RESPUESTA Y SEGURIDAD MÉDICA:
1. BASADO ÚNICAMENTE EN EL CONTEXTO: Responde exclusivamente con la información del contexto anterior. Si la respuesta no está en el contexto o no estás seguro, di amablemente: "Esa consulta específica requiere la valoración de nuestros especialistas. Con gusto te agendamos una cita presencial para revisarte."
2. NO DAR DIAGNÓSTICOS NI RECETAR FÁRMACOS: Está estrictamente prohibido dar diagnósticos médicos, sugerir medicamentos o dosis (ej. ibuprofeno, amoxicilina). Si el paciente menciona dolor intenso, inflamación o sangrado, indícale amablemente que requiere una consulta presencial urgente para examinarlo.
3. PRECIOS ORIENTATIVOS: Cuando menciones precios, aclara siempre que son montos orientativos y que el valor final se confirma en la cita de valoración.
4. RESALTAR LA TECNOLOGÍA LÁSER: Cuando sea relevante, destaca los beneficios del láser (sin ruido molesto de broca, mínima inflamación, cicatrización acelerada, tratamiento en 1 sola sesión).
5. FORMATO WHATSAPP: Usa viñetas, emojis dentales (🦷, ✨, 📅, 📍) y *negritas* para resaltar puntos importantes. Máximo 3-4 párrafos breves.

Respuesta para WhatsApp:
"""


class RAGService:
    def __init__(self):
        # Inicializar LLM de Google Gemini
        try:
            self.llm = ChatGoogleGenerativeAI(
                model=settings.LLM_MODEL_NAME,
                google_api_key=settings.GEMINI_API_KEY,
                temperature=0.2, # Baja temperatura para evitar alucinaciones
            )
            logger.info(f"LLM Gemini ({settings.LLM_MODEL_NAME}) inicializado exitosamente.")
        except Exception as e:
            logger.error(f"Error inicializando ChatGoogleGenerativeAI: {e}")
            self.llm = None
            
        self.prompt_template = PromptTemplate(
            template=SYSTEM_RAG_PROMPT,
            input_variables=["context", "chat_history", "user_query"]
        )

    async def _retrieve_relevant_chunks(self, query: str, top_k: int = 3) -> str:
        """
        TODO: Conectar con la Base de Datos Vectorial elegida (Qdrant, Pinecone o PGVector).
        
        Ejemplo de integración con Qdrant / Pinecone:
        ---------------------------------------------
        # client = QdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY)
        # embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        # query_vector = embeddings.embed_query(query)
        # hits = client.search(collection_name=settings.VECTOR_COLLECTION_NAME, query_vector=query_vector, limit=top_k)
        # return "\\n\\n".join([hit.payload["text"] for hit in hits])
        """
        logger.info(f"[RAG Vector Search] Buscando chunks relevantes para: '{query}'")
        
        # MOCKUP DE CONTEXTO REAL EXTRAÍDO DE WWW.DIENTESYSONRISA.COM
        mock_context = """
        [Documento: FAQ_BaseConocimiento_DientesYSonrisa_Bogota_2026.pdf]
        CLÍNICA: Dientes y Sonrisa Odontología Láser.
        SITIO WEB: https://www.dientesysonrisa.com/
        UBICACIÓN: Bogotá D.C., Colombia (Sede Chicó / Usaquén / Zona Norte, atención con cita previa).
        HORARIOS: Lunes a Viernes 8:00 AM a 6:00 PM | Sábados 8:00 AM a 1:00 PM.
        CONTACTO: PBX Bogotá / WhatsApp +57 318 362 5555.
        
        1. BLANQUEAMIENTO DENTAL LÁSER DIODO:
        - Activación de gel mediante láser de diodo de alta gama.
        - Resultados visibles en una única sesión de 45 minutos.
        - Mínima o nula sensibilidad post-tratamiento.
        - Precio orientativo: $450.000 COP a $680.000 COP (sujeto a valoración presencial en Bogotá).
        
        2. DISEÑO DE SONRISA & GINGIVECTOMÍA LÁSER:
        - Carillas cerámicas y recontorneado estético de encías con láser.
        - Recorte de encías sin bisturí, sin sangrado y sin suturas. Curación rápida en 48-72 horas.
        - Precio orientativo: Desde $380.000 COP.

        3. PERIODONCIA Y TRATAMIENTO DE ENCÍAS CON LÁSER:
        - Desinfección fotoacústica de bolsas periodontales sin bisturí ni puntos de sutura.
        - Elimina gingivitis y periodontitis acelerando la cicatrización.
        - Precio orientativo: Desde $290.000 COP por zona.

        4. ENDODONCIA ASISTIDA POR LÁSER:
        - Desinfección de conductos radiculares eliminando hasta 99.8% de bacterias en canales estrechos.
        - Precio orientativo: Desde $550.000 COP.
        
        5. ODONTOPEDIATRÍA Y CARIES SIN RUIDO:
        - Remoción de tejido cariado con láser sin el ruido ni la vibración molesta del torno. Ideal para niños y pacientes con odontofobia.
        
        POLÍTICA DE DENEGACIÓN MÉDICA Y SEGURIDAD:
        - Ningún bot o personal administrativo puede recetar fármacos por chat. Pacientes con sintomatología dolorosa deben agendar valoración urgente presencial en la sede Bogotá.
        """
        return mock_context

    async def query_knowledge_base(self, user_query: str, chat_history: List[Dict[str, str]]) -> str:
        """
        Punto de entrada principal para consultar el motor RAG.
        """
        try:
            # 1. Recuperar contexto de la base vectorial
            retrieved_context = await self._retrieve_relevant_chunks(user_query)
            
            # 2. Formatear historial de conversación
            formatted_history_str = ""
            for msg in chat_history:
                formatted_history_str += f"{msg['role'].capitalize()}: {msg['content']}\\n"
                
            # 3. Construir Prompt
            prompt = self.prompt_template.format(
                context=retrieved_context,
                chat_history=formatted_history_str,
                user_query=user_query
            )
            
            # 4. Invocar LLM de Gemini
            if not self.llm:
                return "Disculpa, el servicio de inteligencia artificial no está configurado en este momento."
                
            response = await self.llm.ainvoke(prompt)
            return response.content
            
        except Exception as e:
            logger.error(f"Error en RAGService.query_knowledge_base: {e}", exc_info=True)
            return "Ocurrió un inconveniente al consultar la base de conocimiento. Por favor intenta más tarde."


# Instancia Singleton del Servicio RAG
rag_service = RAGService()
`
  },
  {
    id: "whatsapp_service_py",
    filename: "whatsapp_service.py",
    path: "app/services/whatsapp_service.py",
    category: "services",
    language: "python",
    description: "Cliente HTTP asíncrono en httpx para enviar mensajes a Meta WhatsApp Graph API.",
    code: `"""
Cliente Asíncrono HTTP para Meta WhatsApp Cloud API (Graph API)
"""

import httpx
import logging
from app.core.config import settings

logger = logging.getLogger("whatsapp_service")


async def send_whatsapp_text_message(recipient_phone: str, message_body: str) -> bool:
    """
    Envía un mensaje de texto plano o formateado por WhatsApp Graph API.
    URL: https://graph.facebook.com/v21.0/PHONE_NUMBER_ID/messages
    """
    url = f"https://graph.facebook.com/{settings.META_GRAPH_VERSION}/{settings.META_PHONE_NUMBER_ID}/messages"
    
    headers = {
        "Authorization": f"Bearer {settings.META_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": recipient_phone,
        "type": "text",
        "text": {
            "preview_url": False,
            "body": message_body
        }
    }
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.post(url, json=payload, headers=headers)
            if response.status_code == 200:
                logger.info(f"Mensaje WhatsApp enviado exitosamente a {recipient_phone}.")
                return True
            else:
                logger.error(f"Error al enviar mensaje por Meta Graph API. Status: {response.status_code}, Body: {response.text}")
                return False
        except Exception as e:
            logger.error(f"Excepción HTTP enviando mensaje a WhatsApp: {e}")
            return False
`
  },
  {
    id: "schemas_py",
    filename: "schemas.py",
    path: "app/models/schemas.py",
    category: "core",
    language: "python",
    description: "Modelos de datos Pydantic v2 para validación del payload de Meta Webhook y respuestas de API.",
    code: `"""
Esquemas de Datos Pydantic para Validación de Payloads
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Any


class WhatsAppTextMessage(BaseModel):
    body: str


class WhatsAppMessageItem(BaseModel):
    from_number: str = Field(..., alias="from")
    id: str
    timestamp: str
    type: str
    text: Optional[WhatsAppTextMessage] = None


class WhatsAppContactProfile(BaseModel):
    name: str


class WhatsAppContact(BaseModel):
    wa_id: str
    profile: Optional[WhatsAppContactProfile] = None


class WhatsAppValue(BaseModel):
    messaging_product: str
    metadata: Dict[str, Any]
    contacts: Optional[List[WhatsAppContact]] = None
    messages: Optional[List[WhatsAppMessageItem]] = None


class WhatsAppChange(BaseModel):
    value: WhatsAppValue
    field: str


class WhatsAppEntry(BaseModel):
    id: str
    changes: List[WhatsAppChange]


class WhatsAppWebhookPayload(BaseModel):
    object: str
    entry: List[WhatsAppEntry]


class BotResponseSchema(BaseModel):
    status: str
    recipient: str
    message_sent: str
`
  },
  {
    id: "database_py",
    filename: "database.py",
    path: "app/db/database.py",
    category: "db",
    language: "python",
    description: "Conexión a base de datos PostgreSQL (Cloud SQL) con SQLAlchemy y gestión de sesiones.",
    code: `"""
Módulo de Conexión a Base de Datos PostgreSQL (Cloud SQL)
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import logging

from app.core.config import settings

logger = logging.getLogger("db_config")

# Crear Motor de SQLAlchemy
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True, # Previene errores de conexiones cerradas por timeout en Cloud SQL
    pool_size=10,
    max_overflow=20
)

# Fábrica de Sesiones
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base declarativa para modelos ORM
Base = declarative_base()


def init_db():
    """Crea las tablas en PostgreSQL si no existen."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Inyector de dependencia de sesión de BD para FastAPI."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
`
  },
  {
    id: "models_py",
    filename: "models.py",
    path: "app/db/models.py",
    category: "db",
    language: "python",
    description: "Modelos ORM de SQLAlchemy para sesiones de pacientes e historial de mensajes de WhatsApp.",
    code: `"""
Modelos ORM de SQLAlchemy para PostgreSQL
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.database import Base


class PatientSession(Base):
    """Representa la sesión y datos básicos de un paciente en WhatsApp."""
    __tablename__ = "patient_sessions"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String(30), unique=True, nullable=False, index=True)
    patient_name = Column(String(100), default="Paciente")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relación con el historial de mensajes
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")


class ChatMessage(Base):
    """Guarda cada mensaje individual intercambiado con el paciente."""
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("patient_sessions.id"), nullable=False)
    sender = Column(String(10), nullable=False) # 'patient' o 'bot'
    message_text = Column(Text, nullable=False)
    meta_message_id = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("PatientSession", back_populates="messages")
`
  },
  {
    id: "diseno_sonrisa_json",
    filename: "diseno_sonrisa.json",
    path: "data/estetica_dental/diseno_sonrisa.json",
    category: "config",
    language: "plaintext",
    description: "Definición y diagnóstico digital DSD para diseño de sonrisa en Bogotá.",
    code: `{
  "titulo": "Diseño de Sonrisa Bogotá - Estética Dental Láser",
  "categoria": "ESTÉTICA DENTAL",
  "descripcion": "Armonización facial personalizada. Realizado por el Director Científico con 1 año de garantía.",
  "total_diseno_basico": "$3.800.000 COP",
  "blanqueamiento_zoom": "$800.000 COP",
  "diseno_encias_6_dientes": "$600.000 COP",
  "resinas_alta_estetica_6_dientes": "$2.400.000 COP"
}`
  },
  {
    id: "tipos_diseno_sonrisa_json",
    filename: "tipos_diseno_sonrisa.json",
    path: "data/estetica_dental/tipos_diseno_sonrisa.json",
    category: "config",
    language: "plaintext",
    description: "Tipos de diseño de sonrisa y tabla de costos de $3.800.000 COP.",
    code: `{
  "titulo": "Tipos de Diseño de Sonrisa Bogotá - Análisis Individual",
  "categoria": "ESTÉTICA DENTAL",
  "total_diseno_basico": "$3.800.000 COP",
  "tabla_costos": [
    { "procedimiento": "Blanqueamiento LED Zoom", "precio": "$800.000 COP" },
    { "procedimiento": "Diseño de encías (6 dientes)", "precio": "$600.000 COP" },
    { "procedimiento": "6 Resinas de Alta Estética", "precio": "$2.400.000 COP" }
  ]
}`
  },
  {
    id: "blanqueamiento_dental_json",
    filename: "blanqueamiento_dental.json",
    path: "data/estetica_dental/blanqueamiento_dental.json",
    category: "config",
    language: "plaintext",
    description: "Blanqueamiento Dental Láser PIOON ($1.000.000 COP) y opciones adicionales.",
    code: `{
  "titulo": "Blanqueamiento Dental Láser de Diodo PIOON",
  "categoria": "ESTÉTICA DENTAL",
  "precio_principal_laser_pioon": {
    "tratamiento": "Blanqueamiento Dental Láser PIOON",
    "precio": "$1.000.000 COP"
  },
  "otras_opciones": [
    { "tecnica": "ZOOM (Luz LED)", "precio": "$800.000 COP" },
    { "tecnica": "Casero con Cubetas", "precio": "$800.000 COP" }
  ]
}`
  },
  {
    id: "blanqueamiento_zoom_json",
    filename: "blanqueamiento_zoom.json",
    path: "data/estetica_dental/blanqueamiento_zoom.json",
    category: "config",
    language: "plaintext",
    description: "Blanqueamiento Dental ZOOM ($800.000 COP) y opción de Láser PIOON.",
    code: `{
  "titulo": "Blanqueamiento Dental ZOOM Bogotá - Luz LED Activada",
  "categoria": "ESTÉTICA DENTAL",
  "precio_principal_zoom": {
    "tratamiento": "Blanqueamiento Dental ZOOM",
    "precio": "$800.000 COP"
  },
  "opcion_alternativa": {
    "tratamiento": "Blanqueamiento Láser de Diodo PIOON",
    "precio": "$1.000.000 COP"
  }
}`
  },
  {
    id: "carillas_lentes_ceramicos_json",
    filename: "carillas_lentes_ceramicos.json",
    path: "data/estetica_dental/carillas_lentes_ceramicos.json",
    category: "config",
    language: "plaintext",
    description: "Lentes de contacto dentales cerámicos (EMAX $1.000.000 COP, Zirconio $1.400.000 COP).",
    code: `{
  "titulo": "Lentes de Contacto Cerámicos Dentales y Carillas - Bogotá",
  "categoria": "ESTÉTICA DENTAL",
  "precios_oficiales": [
    { "material": "Disilicato de Litio (EMAX - IVOCLAR)", "precio": "$1.000.000 COP c/u" },
    { "material": "Zirconio Monolítico", "precio": "$1.400.000 COP c/u" }
  ]
}`
  },
  {
    id: "brakets_autoligado_json",
    filename: "brakets_autoligado.json",
    path: "data/ortodoncia/brakets_autoligado.json",
    category: "config",
    language: "plaintext",
    description: "Precios y cuotas de ortodoncia autoligada (Carriere, Empower, Damon Q2, Damon Clear).",
    code: `{
  "titulo": "Brackets de Autoligado (Sin Ligas)",
  "categoria": "ORTODONCIA",
  "opciones": [
    { "sistema": "Autoligado Metálico Standard", "total_tratamiento": "$7.060.000 COP" },
    { "sistema": "Autoligado Metálico Damon Q2 / Pitts 21", "total_tratamiento": "$7.860.000 COP" },
    { "sistema": "Autoligado Transparente Damon Clear", "total_tratamiento": "$9.600.000 COP" }
  ]
}`
  },
  {
    id: "salud_oral_json",
    filename: "salud_oral.json",
    path: "data/estetica_dental/salud_oral.json",
    category: "config",
    language: "plaintext",
    description: "Profilaxis dental, detartraje ultrasónico y pasos de salud oral ($150.000 - $250.000 COP).",
    code: `{
  "titulo": "Salud Oral, Profilaxis y Detartraje Bogotá",
  "categoria": "ESTÉTICA DENTAL / ODONTOLOGÍA PREVENTIVA",
  "precio_estimado": "$150.000 - $250.000 COP",
  "pasos_profilaxis": [
    "Valoración e índice de placa",
    "Detartraje ultrasónico y raspado",
    "Pulido dental",
    "Fluoración con flúor neutro"
  ]
}`
  },
  {
    id: "dr_rafael_obando_json",
    filename: "dr_rafael_obando.json",
    path: "data/nosotros/dr_rafael_obando.json",
    category: "config",
    language: "plaintext",
    description: "Ficha profesional del Director Científico especialista en Odontología Láser e Implantes.",
    code: `{
  "nombre": "Dr. Rafael Obando",
  "cargo": "Director Científico",
  "especialidad": "Odontólogo Especialista en Odontología Láser e Implantología Oral"
}`
  },
  {
    id: "nuestra_ubicacion_json",
    filename: "nuestra_ubicacion.json",
    path: "data/contacto/nuestra_ubicacion.json",
    category: "config",
    language: "plaintext",
    description: "Ubicación oficial en Bogotá: Carrera 15 #77-90 Consultorio 408 (Frente a Unilago).",
    code: `{
  "direccion_oficial": "Carrera 15 #77-90 Consultorio 408 (Frente a Unilago) - Bogotá D.C., Colombia",
  "whatsapp": "+57 300 5516067",
  "pbx": "+57 318 362 5555"
}`
  },
  {
    id: "dockerfile",
    filename: "Dockerfile",
    path: "Dockerfile",
    category: "deploy",
    language: "dockerfile",
    description: "Dockerfile optimizado para producción en Google Cloud Run con ejecutor Uvicorn.",
    code: `# Imagen Base Oficial Ligera de Python 3.11
FROM python:3.11-slim as builder

# Prevenir generación de archivos .pyc y forzar salida stdout sin buffer
ENV PYTHONUNBUFFERED=1 \\
    PYTHONDONTWRITEBYTECODE=1 \\
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Instalar dependencias del sistema necesarias para psycopg2 / compilación
RUN apt-get update && apt-get install -y --no-install-recommends \\
    build-essential \\
    libpq-dev \\
    && rm -rf /var/lib/apt-get/lists/*

# Copiar e instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Etapa Final de Producción
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \\
    PORT=8080

WORKDIR /app

# Instalar solo librerías runtime para Postgres
RUN apt-get update && apt-get install -y --no-install-recommends \\
    libpq5 \\
    && rm -rf /var/lib/apt-get/lists/*

# Copiar paquetes instalados desde la etapa builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copiar el código fuente de la aplicación
COPY . .

# Crear usuario sin privilegios root por seguridad
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Exponer puerto configurado para Cloud Run
EXPOSE 8080

# Comando de ejecución con Uvicorn para Cloud Run
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "2"]
`
  },
  {
    id: "env_example",
    filename: ".env.example",
    path: ".env.example",
    category: "config",
    language: "env",
    description: "Plantilla de variables de entorno para desarrollo y producción en GCP Secret Manager.",
    code: `# Configuración de Entorno
ENVIRONMENT=production
PORT=8080

# Meta WhatsApp Business API Credentials
META_VERIFY_TOKEN=MI_TOKEN_SECRETO_DIENTES_Y_SONRISA
META_ACCESS_TOKEN=EAAG...
META_PHONE_NUMBER_ID=109876543210
META_GRAPH_VERSION=v21.0

# IA Google Gemini
GEMINI_API_KEY=AIzaSy...
LLM_MODEL_NAME=gemini-3.6-flash

# Base de Datos Vectorial (Qdrant / Pinecone)
VECTOR_DB_TYPE=qdrant
QDRANT_URL=https://xyz-example.qdrant.tech:6333
QDRANT_API_KEY=qdrant_key_secret_here
VECTOR_COLLECTION_NAME=dientes_sonrisa_kb

# Cloud SQL PostgreSQL Connection String
DATABASE_URL=postgresql://dbuser:SecretPassword123!@/dientes_sonrisa_db?host=/cloudsql/tu-proyecto-gcp:us-central1:dientes-sql-instance
`
  },
  {
    id: "readme_deploy",
    filename: "README_DEPLOY.md",
    path: "README_DEPLOY.md",
    category: "deploy",
    language: "markdown",
    description: "Guía paso a paso para desplegar en Google Cloud Run y configurar el Webhook en Meta.",
    code: `# Guía de Despliegue en Google Cloud Run - Dientes y Sonrisa

Esta guía describe los pasos necesarios para desplegar el backend en **Google Cloud Run** y vincularlo con la API de **WhatsApp Business (Meta)**.

---

## 1. Requisitos Previos en Google Cloud Platform (GCP)

1. Crear un proyecto en GCP: \`dientes-sonrisa-bot\`
2. Habilitar las siguientes APIs en GCP Console:
   \`\`\`bash
   gcloud services enable run.googleapis.com \\
                          containerregistry.googleapis.com \\
                          secretmanager.googleapis.com \\
                          sqladmin.googleapis.com
   \`\`\`
3. Instalar **Google Cloud SDK (\`gcloud\` CLI)** en tu equipo.

---

## 2. Construcción y Publicación de la Imagen Docker en Artifact Registry

\`\`\`bash
# Configurar proyecto GCP
gcloud config set project dientes-sonrisa-bot

# Crear repositorio en Artifact Registry (si no existe)
gcloud artifacts repositories create dientes-repo \\
    --repository-format=docker \\
    --location=us-central1

# Construir y subir la imagen usando Cloud Build
gcloud builds submit --tag us-central1-docker.pkg.dev/dientes-sonrisa-bot/dientes-repo/whatsapp-bot:v1 .
\`\`\`

---

## 3. Despliegue en Google Cloud Run

Ejecuta el siguiente comando para desplegar el contenedor:

\`\`\`bash
gcloud run deploy dientes-whatsapp-bot \\
    --image us-central1-docker.pkg.dev/dientes-sonrisa-bot/dientes-repo/whatsapp-bot:v1 \\
    --platform managed \\
    --region us-central1 \\
    --allow-unauthenticated \\
    --port 8080 \\
    --min-instances 0 \\
    --max-instances 5 \\
    --set-env-vars ENVIRONMENT=production,META_VERIFY_TOKEN=MI_TOKEN_SECRETO_DIENTES_Y_SONRISA,LLM_MODEL_NAME=gemini-3.6-flash \\
    --set-secrets GEMINI_API_KEY=GEMINI_KEY_SECRET:latest,META_ACCESS_TOKEN=META_TOKEN_SECRET:latest,DATABASE_URL=DB_URL_SECRET:latest
\`\`\`

Al finalizar, Cloud Run te entregará una URL HTTPS pública (ej. \`https://dientes-whatsapp-bot-xyz.a.run.app\`).

---

## 4. Configuración del Webhook en Meta Developer Portal

1. Entra a [Meta Developers Console](https://developers.facebook.com/).
2. Ve a tu App de **WhatsApp** -> **Configuración** -> **Webhook**.
3. En **URL de respuesta (Callback URL)**, ingresa:
   \`https://dientes-whatsapp-bot-xyz.a.run.app/api/v1/webhook\`
4. En **Token de verificación**, ingresa el valor configurado en \`META_VERIFY_TOKEN\` (ej. \`MI_TOKEN_SECRETO_DIENTES_Y_SONRISA\`).
5. Haz clic en **Verificar y guardar**.
6. En el panel de suscripciones de campos, activa la casilla **messages**.

¡Listo! El bot responderá en tiempo real a los mensajes de tus pacientes en WhatsApp usando RAG y Gemini AI.
`
  }
];
