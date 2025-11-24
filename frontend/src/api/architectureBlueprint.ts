// src/api/architectureBlueprint.ts

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000';

export type ArchitectureBlueprintRequest = {
  // Step 1 – Basic product
  product_type?: string;    // "saas" | "mobile_app" | "ecommerce" | "internal_tool" | "marketplace"
  expected_users: string;   // "<1k" | "1k-10k" | "10k-100k" | "100k-1M" | "1M+"
  traffic_pattern: string;  // "steady" | "bursty" | "seasonal" | "unpredictable"

  // Step 2 – Data & load
  data_size: string;        // "<5GB" | "5-50GB" | "50-500GB" | "500GB-5TB" | "5TB+"
  data_type: string;        // "transactional" | "analytics-heavy" | "logs & telemetry" | "media files"
  concurrency: string;      // "<10" | "10-100" | "100-500" | "500-2000" | "2000+"

  // Step 3 – Features
  realtime: string;         // "none" | "basic_realtime" | "heavy_realtime"
  multi_tenancy: string;    // "no" | "soft_multi_tenant" | "hard_multi_tenant"
  integrations: string;     // "few" | "many" | "mission_critical"

  // Step 4 – Constraints
  compliance: string;       // "none" | "gdpr" | "hipaa" | "soc2" | "fintech"
  deployment: string;       // "cloud" | "on_prem" | "hybrid"
  uptime: string;           // "99%" | "99.5%" | "99.9%" | "99.99%"

  // Optional
  description?: string;
  seo_needed?: boolean;
};

export type ArchitectureOverview = {
  tier: string;
  label: string;
  overall_score: number;
  description: string;
};

export type ArchitectureInfraConfig = {
  compute: string;
  database: string;
  caching?: string;
  queueing?: string;
  observability?: string;
  deployment_model?: string;
};

export type ArchitectureRiskItem = {
  area: string;
  title: string;
  detail: string;
};

export type ArchitectureBlueprintResponse = {
  tier: string;
  overview: ArchitectureOverview;
  scores: {
    load: number;
    data: number;
    features: number;
    risk: number;
  };
  backend_stack: string[];
  frontend_stack: string[];
  infra: ArchitectureInfraConfig;
  risks: ArchitectureRiskItem[];
  roadmap: string[];
  cost_band: string;
};

export async function runArchitectureBlueprint(
  payload: ArchitectureBlueprintRequest,
): Promise<ArchitectureBlueprintResponse> {
  const res = await fetch(`${API_BASE}/labs/architecture-blueprint/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to run Architecture Blueprint Tool');
  }

  return res.json() as Promise<ArchitectureBlueprintResponse>;
}
