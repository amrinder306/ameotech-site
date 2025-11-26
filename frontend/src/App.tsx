// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PageShell } from './components/layout/PageShell';
import { MarketingHome } from './pages/MarketingHome';
import { LabsLanding } from './pages/LabsLanding';
import { AuditPage } from './pages/AuditPage';
import { BuildEstimatorPage } from './pages/BuildEstimatorPage';
import ArchitectureBlueprintPage from "./pages/labs/ArchitectureBlueprintPage";
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminJobsPage } from './pages/AdminJobsPage';
import { AiReadinessPage } from "./pages/AiReadinessPage";

const App: React.FC = () => {
  return (
    <PageShell>
      <Routes>
        {/* Main marketing page */}
        <Route path="/" element={<MarketingHome />} />

        {/* Labs marketing page (tools as invite-only / request access) */}
        <Route path="/labs" element={<LabsLanding />} />
        <Route path="/labs/product-audit" element={<AuditPage />} />
        <Route path="/labs/build-estimator" element={<BuildEstimatorPage />} />
        <Route path="/labs/architecture-blueprint" element={<ArchitectureBlueprintPage />} />
        {/* Fallback – send anything unknown back to home */}
        <Route path="*" element={<MarketingHome />} />

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/jobs" element={<AdminJobsPage />} />
        <Route path="/labs/ai-readiness" element={<AiReadinessPage />} />

      </Routes>
    </PageShell>
  );
};

export default App;
