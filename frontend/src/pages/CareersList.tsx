const API_BASE = import.meta.env.VITE_API_BASE ??
(import.meta.env.DEV ? 'http://localhost:8000' : '');

import React, { useEffect, useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Container } from '../components/ui/Container';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Link } from 'react-router-dom';

type JobMeta = {
  location?: string;
  employment_type?: string;
  experience_level?: string;
};

type JobItem = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  meta?: JobMeta;
};

export const CareersList: React.FC = () => {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/content/jobs`);
        if (!res.ok) throw new Error('Failed to load jobs');
        const data = await res.json();
        setJobs(data.items ?? data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <PageShell>
      <section className="py-16 bg-white">
        <Container>
          <SectionHeader
            title="Careers at Ameotech"
            subtitle="Join a senior engineering team building production-grade AI systems."
          />
          {loading && <p className="text-gray-500 text-sm">Loading…</p>}
          <div className="space-y-4">
            {jobs.map((job) => (
              <article
                key={job.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <h2 className="text-lg font-semibold mb-1">
                    <Link to={`/careers/${job.slug}`} className="hover:text-blue-600">
                      {job.title}
                    </Link>
                  </h2>
                  {job.excerpt && (
                    <p className="text-sm text-slate-600 dark:text-slate-300">{job.excerpt}</p>
                  )}
                  {job.meta && (
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                      {job.meta.location && <span>📍 {job.meta.location}</span>}
                      {job.meta.employment_type && <span>• {job.meta.employment_type}</span>}
                      {job.meta.experience_level && <span>• {job.meta.experience_level}</span>}
                    </div>
                  )}
                </div>
                <div className="text-sm">
                  <Link
                    to={`/careers/${job.slug}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    View role →
                  </Link>
                </div>
              </article>
            ))}
            {!loading && jobs.length === 0 && (
              <p className="text-gray-500 text-sm">No open roles right now. Check back soon.</p>
            )}
          </div>
        </Container>
      </section>
    </PageShell>
  );
};
