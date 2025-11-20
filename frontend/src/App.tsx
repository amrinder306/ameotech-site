import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PageShell } from './components/layout/PageShell';
import { MarketingHome } from './pages/MarketingHome';
import { LabsLanding } from './pages/LabsLanding';
import { AuditPage } from './pages/AuditPage';
import { BuildEstimatorPage } from './pages/BuildEstimatorPage';
import { CaseStudyList } from './pages/CaseStudyList';
import { CaseStudyDetail } from './pages/CaseStudyDetail';
import { CareersList } from './pages/CareersList';
import { JobDetail } from './pages/JobDetail';
import { AdminLayout } from './admin/AdminLayout';
import { AdminChatPage } from './admin/AdminChatPage';
import { AdminContentPage } from './admin/AdminContentPage';
import { AiToolsPage } from './admin/AiToolsPage';
import { AdminContentEditor } from './admin/AdminContentEditor';

const App: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PageShell>
            <MarketingHome />
          </PageShell>
        }
      />
      <Route path="/case-studies" element={<CaseStudyList />} />
      <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
      <Route path="/careers" element={<CareersList />} />
      
<Route path="/careers/:slug" element={<JobDetail />} />

<Route
  path="/labs"
  element={
    <PageShell>
      <LabsLanding />
    </PageShell>
  }
/>
<Route
  path="/labs/audit"
  element={
    <PageShell>
      <AuditPage />
    </PageShell>
  }
/>
<Route
  path="/labs/build-estimator"
  element={
    <PageShell>
      <BuildEstimatorPage />
    </PageShell>
  }
/>

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="chat" element={<AdminChatPage />} />
        <Route path="ai-tools" element={<AiToolsPage />} />
        <Route path="content" element={<AdminContentPage />} />
        <Route path="content/new" element={<AdminContentEditor />} />
        <Route path="content/:id" element={<AdminContentEditor />} />
      </Route>
    </Routes>
  );
};

export default App;
