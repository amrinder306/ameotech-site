from __future__ import annotations

from typing import Optional, List, Dict, Any

from fastapi import FastAPI, HTTPException, Depends, Header,BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .schemas import (
  ChatSessionCreateResponse,
  ChatMessageRequest,
  ChatMessageResponse,
  ContentItem,
  ContentListResponse,
  ContentItemCreate,
  ContentType,
  ContentStatus,
  AuditRequest,
  AuditResponse,
  EstimatorRequest,
  EstimatorResponse,
)
from .chat_engine import chat_engine
from .content_store import STORE
from .audit_engine import run_audit
from .build_estimator_engine import run_estimator

# NEW: Architecture Blueprint Tool
from .labs.architecture_blueprint_engine import run_architecture_blueprint

# NEW: ARE-3.5 reasoning engine imports
from .reasoning.engine import ReasoningEngine
from .reasoning.memory import SessionMemory
from .labs.ai_readiness_engine import run_ai_readiness

import os
import httpx

from .auth import router as AuthRouter
app = FastAPI(title="Ameotech Website Backend", version="0.2.0")

# CORS: allow local dev by default
origins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# ----------------------
# In-memory store for reasoning sessions (ARE-3.5)
# ----------------------
app.include_router(AuthRouter)
REASON_SESSIONS: Dict[str, SessionMemory] = {}
reason_engine = ReasoningEngine()

def get_reason_session(session_id: str) -> SessionMemory:
  session = REASON_SESSIONS.get(session_id)
  if not session:
    session = SessionMemory(session_id=session_id)
    REASON_SESSIONS[session_id] = session
  return session

SALES_WEBHOOK_URL = os.getenv("SALES_WEBHOOK_URL")


async def _post_sales_webhook(payload: dict):
  if not SALES_WEBHOOK_URL:
    print("[SALES-NOTIFY]", payload)
    return
  async with httpx.AsyncClient(timeout=5) as client:
    try:
      await client.post(SALES_WEBHOOK_URL, json={"text": str(payload)})
    except Exception as exc:
      print("[SALES-NOTIFY-ERROR]", exc)


@app.post("/internal/notify-sales")
async def notify_sales(payload: dict, background: BackgroundTasks):
  """
  Lightweight hook to notify sales (Slack/email/etc) when a chat or lab
  result escalates to "talk to human".
  """
  # You can enrich the payload here if needed.
  background.add_task(_post_sales_webhook, payload)
  return {"ok": True}

# ----------------------
# Chat endpoints (existing chat_engine – unchanged)
# ----------------------


@app.post("/chat/session", response_model=ChatSessionCreateResponse)
def create_chat_session() -> ChatSessionCreateResponse:
  session = chat_engine.create_session()
  welcome = chat_engine.initial_welcome(session)
  return ChatSessionCreateResponse(
    session_id=session.id,
    welcome=welcome.reply,
    suggestions=welcome.suggestions,
  )


@app.post("/chat/message", response_model=ChatMessageResponse)
def chat_message(payload: ChatMessageRequest) -> ChatMessageResponse:
  try:
    return chat_engine.handle_message(payload.session_id, payload.message)
  except KeyError:
    raise HTTPException(status_code=404, detail="Session not found")



# ----------------------
# Labs: Product & Engineering Audit
# ----------------------


@app.post("/labs/audit/run", response_model=AuditResponse)
def labs_run_audit(payload: AuditRequest) -> AuditResponse:
  result = run_audit(payload.dict())
  return AuditResponse(**result)


# ----------------------
# Labs: Build Cost & Delivery Model Estimator
# ----------------------


@app.post("/labs/build-estimator/run", response_model=EstimatorResponse)
def labs_run_build_estimator(payload: EstimatorRequest) -> EstimatorResponse:
  result = run_estimator(payload.dict())
  return EstimatorResponse(**result)


# ----------------------
# Labs: Architecture Blueprint Tool
# ----------------------


class ArchitectureBlueprintRequest(BaseModel):
  # Step 1 – Basic product
  product_type: Optional[str] = "saas"  # saas / mobile_app / ecommerce / internal_tool / marketplace
  expected_users: str                   # <1k / 1k-10k / 10k-100k / 100k-1M / 1M+
  traffic_pattern: str                  # steady / bursty / seasonal / unpredictable

  # Step 2 – Data & load
  data_size: str                        # <5GB / 5-50GB / 50-500GB / 500GB-5TB / 5TB+
  data_type: str                        # transactional / analytics-heavy / logs & telemetry / media files
  concurrency: str                      # <10 / 10-100 / 100-500 / 500-2000 / 2000+

  # Step 3 – Features
  realtime: str                         # none / basic_realtime / heavy_realtime
  multi_tenancy: str                    # no / soft_multi_tenant / hard_multi_tenant
  integrations: str                     # few / many / mission_critical

  # Step 4 – Constraints
  compliance: str                       # none / gdpr / hipaa / soc2 / fintech
  deployment: str                       # cloud / on_prem / hybrid
  uptime: str                           # 99% / 99.5% / 99.9% / 99.99%

  # Optional free-text + SEO hint
  description: Optional[str] = None
  seo_needed: Optional[bool] = False


class ArchitectureRiskItem(BaseModel):
  area: str
  title: str
  detail: str


class ArchitectureInfraConfig(BaseModel):
  compute: str
  database: str
  caching: Optional[str] = ""
  queueing: Optional[str] = ""
  observability: Optional[str] = ""
  deployment_model: Optional[str] = ""


class ArchitectureOverview(BaseModel):
  tier: str
  label: str
  overall_score: int
  description: str


class ArchitectureBlueprintResponse(BaseModel):
  tier: str
  overview: ArchitectureOverview
  scores: Dict[str, int]
  backend_stack: List[str]
  frontend_stack: List[str]
  infra: ArchitectureInfraConfig
  risks: List[ArchitectureRiskItem]
  roadmap: List[str]
  cost_band: str


@app.post("/labs/architecture-blueprint/run", response_model=ArchitectureBlueprintResponse)
def labs_run_architecture_blueprint(payload: ArchitectureBlueprintRequest) -> ArchitectureBlueprintResponse:
  """
  Run the Architecture Blueprint engine and return a structured recommendation.
  """
  result = run_architecture_blueprint(payload.dict())
  return ArchitectureBlueprintResponse(**result)


# ----------------------
# Content endpoints (public)
# ----------------------


@app.get("/content/case-studies", response_model=ContentListResponse)
def list_case_studies() -> ContentListResponse:
  items = STORE.list_items(type=ContentType.CASE_STUDY, status=ContentStatus.PUBLISHED)
  return ContentListResponse(items=items)


@app.get("/content/case-studies/{slug}", response_model=ContentItem)
def get_case_study(slug: str) -> ContentItem:
  item = STORE.get_by_slug(ContentType.CASE_STUDY, slug, status=ContentStatus.PUBLISHED)
  if not item:
    raise HTTPException(status_code=404, detail="Case study not found")
  return item


@app.get("/content/jobs", response_model=ContentListResponse)
def list_jobs() -> ContentListResponse:
  items = STORE.list_items(type=ContentType.JOB_POST, status=ContentStatus.PUBLISHED)
  return ContentListResponse(items=items)


@app.get("/content/jobs/{slug}", response_model=ContentItem)
def get_job(slug: str) -> ContentItem:
  item = STORE.get_by_slug(ContentType.JOB_POST, slug, status=ContentStatus.PUBLISHED)
  if not item:
    raise HTTPException(status_code=404, detail="Job not found")
  return item


# ----------------------
# Reasoning engine endpoints (ARE-3.5)
# ----------------------


@app.post("/reason/chat-route")
def reason_chat_route(payload: dict):
  """
  Route a chat message through the new ARE-3.5 reasoning engine (no LLM).
  Expected payload from frontend:
    {
      "session_id": str,
      "message": str,
      "page": str,
      "context": {...},
      "history": [...]
    }
  """
  session_id = payload.get("session_id")
  if not session_id:
    raise HTTPException(status_code=400, detail="session_id is required")

  message = payload.get("message") or ""
  page = payload.get("page") or "/"

  session = get_reason_session(session_id)

  result = reason_engine.process(
    session=session,
    user_raw_message=message,
    page=page,
  )

  # SystemResponse → plain dict
  return {
    "session_id": result.session_id,
    "intent": result.intent,
    "intent_confidence": result.intent_confidence,
    "action": result.action,
    "action_payload": result.action_payload,
    "bot_reply": result.bot_reply,
    "meta": result.meta,
  }


@app.post("/reason/lab-next")
def reason_lab_next(payload: dict):
    """
    Deterministic “what next?” logic for Labs results.
    """
    lab_tool = payload.get("lab_tool") or payload.get("lab")
    lab_result = payload.get("lab_result") or payload.get("result") or {}

    next_actions = []
    reply_lines = []

    # --- AUDIT ---
    if lab_tool == "audit":
        scores = lab_result.get("scores", {}) or {}
        product = scores.get("product", 0)
        engineering = scores.get("engineering", 0)
        data_ai = scores.get("data_ai", 0)

        reply_lines.append(
            "Here’s how we usually think about next steps after a maturity audit:"
        )

        if engineering < 60 or data_ai < 50:
            next_actions.append(
                {
                    "label": "Run Architecture Blueprint",
                    "type": "open_lab_tool",
                    "target": "architecture_blueprint",
                    "payload": {"lab_tool": "architecture-blueprint"},
                }
            )
            reply_lines.append(
                "- Your engineering / data scores suggest stabilising foundations first via an architecture review."
            )
        else:
            next_actions.append(
                {
                    "label": "Run Build Estimator",
                    "type": "open_lab_tool",
                    "target": "build_estimator",
                    "payload": {"lab_tool": "build-estimator"},
                }
            )
            reply_lines.append(
                "- Your base looks reasonable. Next step is shaping budget and delivery via the estimator."
            )

        next_actions.append(
            {
                "label": "Talk to Ameotech",
                "type": "escalate_human",
                "payload": {"link": "mailto:hello@ameotech.com"},
            }
        )
        reply_lines.append(
            "- If you prefer a live walkthrough, we can review this together."
        )

    # --- BUILD ESTIMATOR ---
    elif lab_tool == "build_estimator":
        reply_lines.append(
            "Based on this estimator run, there are usually two paths that make sense:"
        )
        next_actions.append(
            {
                "label": "Review architecture options",
                "type": "open_lab_tool",
                "target": "architecture_blueprint",
                "payload": {"lab_tool": "architecture-blueprint"},
            }
        )
        next_actions.append(
            {
                "label": "Schedule a scoping call",
                "type": "escalate_human",
                "payload": {"link": "mailto:hello@ameotech.com"},
            }
        )

    # --- ARCHITECTURE BLUEPRINT ---
    elif lab_tool == "architecture_blueprint":
        reply_lines.append(
            "Architecture blueprints typically feed directly into a scoped engagement or modernisation plan."
        )
        next_actions.append(
            {
                "label": "Schedule a working session",
                "type": "escalate_human",
                "payload": {"link": "mailto:hello@ameotech.com"},
            }
        )

    # --- AI READINESS ---
    elif lab_tool == "ai_readiness":
        scores = lab_result.get("scores", {}) or {}
        overall = scores.get("score", 0)

        reply_lines.append(
            "Here’s how we normally interpret an AI readiness profile like this:"
        )

        if overall < 60:
            reply_lines.append(
                "- The right move is to strengthen architecture, data and workflows before committing to AI projects."
            )
            next_actions.append(
                {
                    "label": "Run Architecture Blueprint",
                    "type": "open_lab_tool",
                    "target": "architecture_blueprint",
                    "payload": {"lab_tool": "architecture-blueprint"},
                }
            )
        elif overall >= 75:
            reply_lines.append(
                "- You look reasonably ready for applied AI. It’s worth scoping a concrete project instead of more diagnostics."
            )
            next_actions.append(
                {
                    "label": "Run Build Estimator",
                    "type": "open_lab_tool",
                    "target": "build_estimator",
                    "payload": {"lab_tool": "build-estimator"},
                }
            )
        else:
            reply_lines.append(
                "- You’re in a mixed zone: there is potential, but also some gaps. A small, well-defined PoC or advisory sprint is usually safest."
            )

        next_actions.append(
            {
                "label": "Talk to Ameotech",
                "type": "escalate_human",
                "payload": {"link": "mailto:hello@ameotech.com"},
            }
        )

    # --- DEFAULT ---
    else:
        reply_lines.append(
            "You can share these lab results with the Ameotech team, or start a conversation via the contact form."
        )
        next_actions.append(
            {
                "label": "Contact Ameotech",
                "type": "escalate_human",
                "payload": {"link": "mailto:hello@ameotech.com"},
            }
        )

    bot_reply = "\n".join(reply_lines) if reply_lines else (
        "You can share these lab results with the Ameotech team, or start a conversation via the contact form."
    )

    return {
        "action": "show_next_actions",
        "action_payload": {"next_actions": next_actions},
        "bot_reply": bot_reply,
        "next_actions": next_actions,
    }



@app.post("/reason/feedback")
def reason_feedback(payload: dict):
  """
  Feedback stub (thumbs up/down, action_clicked, etc.).
  Kept for compatibility; extend to log into DB or analytics later.
  """
  # For now, just acknowledge.
  return {"ok": True}



# ----------------------
# Admin content endpoints
# ----------------------


def get_role(x_role: Optional[str] = Header(default=None)) -> str:
  # Very simple role header for demo; replace with real auth in production
  return x_role or "guest"


@app.get("/admin/content", response_model=ContentListResponse)
def admin_list_content(role: str = Depends(get_role)) -> ContentListResponse:
  if role not in ("admin", "content_editor"):
    raise HTTPException(status_code=403, detail="Forbidden")
  items = STORE.list_items()
  return ContentListResponse(items=items)


@app.post("/admin/content", response_model=ContentItem)
def admin_create_content(payload: ContentItemCreate, role: str = Depends(get_role)) -> ContentItem:
  if role not in ("admin", "content_editor"):
    raise HTTPException(status_code=403, detail="Forbidden")
  return STORE.create(payload)


@app.get("/admin/content/{item_id}", response_model=ContentItem)
def admin_get_content(item_id: str, role: str = Depends(get_role)) -> ContentItem:
  if role not in ("admin", "content_editor"):
    raise HTTPException(status_code=403, detail="Forbidden")
  item = STORE.get(item_id)
  if not item:
    raise HTTPException(status_code=404, detail="Content item not found")
  return item


@app.put("/admin/content/{item_id}", response_model=ContentItem)
def admin_update_content(item_id: str, payload: ContentItemCreate, role: str = Depends(get_role)) -> ContentItem:
  if role not in ("admin", "content_editor"):
    raise HTTPException(status_code=403, detail="Forbidden")
  updated = STORE.update(item_id, payload)
  if not updated:
    raise HTTPException(status_code=404, detail="Content item not found")
  return updated


@app.post("/admin/content/{item_id}/publish", response_model=ContentItem)
def admin_publish_content(item_id: str, role: str = Depends(get_role)) -> ContentItem:
  if role not in ("admin", "content_editor"):
    raise HTTPException(status_code=403, detail="Forbidden")
  updated = STORE.set_status(item_id, ContentStatus.PUBLISHED)
  if not updated:
    raise HTTPException(status_code=404, detail="Content item not found")
  return updated


@app.post("/admin/content/{item_id}/archive", response_model=ContentItem)
def admin_archive_content(item_id: str, role: str = Depends(get_role)) -> ContentItem:
  if role not in ("admin", "content_editor"):
    raise HTTPException(status_code=403, detail="Forbidden")
  updated = STORE.set_status(item_id, ContentStatus.ARCHIVED)
  if not updated:
    raise HTTPException(status_code=404, detail="Content item not found")
  return updated

@app.post("/labs/ai-readiness/run")
def run_ai_readiness_route(payload: dict):
    """
    AI Readiness Scan – deterministic scoring based on data, workflows, AI opportunities,
    organisation readiness and constraints.
    """
    return run_ai_readiness(payload)

