// src/pages/AdminJobsPage.tsx
import React, { useEffect, useState } from 'react';
import { Container } from '../components/ui/Container';
import { RequireAdmin } from '../components/admin/RequireAdmin';

type Job = {
  id: number;
  title: string;
  location: string;
  type: string;
  summary: string;
  active: boolean;
};

export const AdminJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('ameotech_admin_token');
    if (!token) return;
    fetch(`${import.meta.env.VITE_API_BASE ?? ''}/admin/jobs`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setJobs)
      .catch(() => {});
  }, []);

  return (
    <RequireAdmin>
      <section className="py-20">
        <Container className="max-w-4xl">
          <h1 className="text-2xl font-semibold mb-4">Jobs</h1>
          <p className="text-sm text-slate-500 mb-6">
            Simple in-memory admin. Replace endpoint implementation with DB-backed storage when
            ready.
          </p>
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{job.title}</p>
                  <p className="text-xs text-slate-500">
                    {job.location} · {job.type}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full border border-slate-300 text-slate-600">
                  {job.active ? 'Active' : 'Hidden'}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </RequireAdmin>
  );
};
