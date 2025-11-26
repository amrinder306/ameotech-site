const API_BASE = import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? "${import.meta.env.VITE_API_BASE}/?" : "");

const API_BASE = import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? "${import.meta.env.VITE_API_BASE}/?" : "");

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Container } from '../components/ui/Container';

const API_BASE = import.meta.env.VITE_API_BASE ?? '${import.meta.env.VITE_API_BASE}/?';


type JobMeta = {
  location?: string;
  employment_type?: string;
  experience_level?: string;
  apply_email?: string;
};

type JobItem = {
  id: string;
  title: string;
  slug: string;
  body_rich: string;
  excerpt?: string;
  meta?: JobMeta;
};

export const JobDetail: React.FC = () => {
  const { slug } = useParams();
  const [job, setJob] = useState<JobItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/content/jobs/${slug}`);
        if (!res.ok) throw new Error('Failed to load job');
        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      load();
    }
  }, [slug]);

  return (
    <PageShell>
      <section className="py-16 bg-white">
        <Container className="max-w-3xl">
          {loading && <p className="text-gray-500 text-sm">Loading…</p>}
          {!loading && !job && (
            <p className="text-sm text-red-500">Role not found.</p>
          )}
          {job && (
            <>
              <header className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{job.title}</h1>
                {job.excerpt && (
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">{job.excerpt}</p>
                )}
                {job.meta && (
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    {job.meta.location && <span>📍 {job.meta.location}</span>}
                    {job.meta.employment_type && <span>• {job.meta.employment_type}</span>}
                    {job.meta.experience_level && <span>• {job.meta.experience_level}</span>}
                  </div>
                )}
              </header>
              <article className="prose prose-gray max-w-none mb-8">
                {job.body_rich.split('\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </article>
              {job.meta?.apply_email && (
                <div className="mt-6 text-sm">
                  <p className="font-semibold mb-1">How to apply</p>
                  <p>
                    Send your CV, GitHub/portfolio, and a short note to{' '}
                    <a
                      href={`mailto:${job.meta.apply_email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {job.meta.apply_email}
                    </a>.
                  </p>
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </PageShell>
  );
};
