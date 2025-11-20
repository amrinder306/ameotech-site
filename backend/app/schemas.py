from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel


class SuggestedReply(BaseModel):
  id: str
  label: str


class ChatSessionCreateResponse(BaseModel):
  session_id: str
  welcome: str
  suggestions: List[SuggestedReply]


class ChatMessageRequest(BaseModel):
  session_id: str
  message: str


class ChatMessageResponse(BaseModel):
  reply: str
  suggestions: List[SuggestedReply] = []


class ContentType(str):
  CASE_STUDY = "case_study"
  JOB_POST = "job_post"


class ContentStatus(str):
  DRAFT = "draft"
  PUBLISHED = "published"
  ARCHIVED = "archived"


class ContentItemBase(BaseModel):
  type: str
  title: str
  slug: str
  excerpt: Optional[str] = None
  body_rich: str
  tags: Optional[list[str]] = None
  meta: Optional[dict] = None


class ContentItem(ContentItemBase):
  id: str
  status: str


class ContentItemCreate(ContentItemBase):
  status: Optional[str] = ContentStatus.DRAFT


class ContentListResponse(BaseModel):
  items: list[ContentItem]

# ----------------------
# Labs: Product & Engineering Audit
# ----------------------


class AuditScores(BaseModel):
  product: int
  engineering: int
  data_ai: int


class AuditRecommendation(BaseModel):
  area: str
  title: str
  detail: str


class AuditRequest(BaseModel):
  product_stage: str
  release_freq: str
  tech_stack: Optional[str] = None
  ci_cd: bool
  testing: str
  data_centralized: bool
  analytics: str
  pain_points: List[str] = []


class AuditResponse(BaseModel):
  scores: AuditScores
  recommendations: List[AuditRecommendation]


# ----------------------
# Labs: Build Cost & Delivery Model Estimator
# ----------------------


class EstimatorScores(BaseModel):
  complexity: int
  urgency: int
  team: int
  budget: int


class EstimatorRequest(BaseModel):
  project_types: List[str]
  urgency: str
  company_stage: str
  team: str
  budget: str


class EstimatorResponse(BaseModel):
  model: str
  budget: str
  timeline: str
  scores: EstimatorScores
  plan: List[str]
  recommendations: List[str]

