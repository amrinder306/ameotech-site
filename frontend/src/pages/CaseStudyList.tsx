const API_BASE = import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? "${import.meta.env.VITE_API_BASE}/?" : "");

const API_BASE = import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? "${import.meta.env.VITE_API_BASE}/?" : "");

import React, { useEffect, useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Container } from '../components/ui/Container';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE ?? '${import.meta.env.VITE_API_BASE}/?';



type ContentItem = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  tags?: string[];
};

export const CaseStudyList: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/content/case-studies`);
        if (!res.ok) throw new Error('Failed to load case studies');
        const data = await res.json();
        setItems(data.items ?? data);
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
            title="Case Studies"
            subtitle="Selected examples of pricing, forecasting, and applied AI engineering work."
          />
          {loading && <p className="text-gray-500 text-sm">Loading…</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items.map((item) => (
              <article
                key={item.id}
                className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-bold mb-2">
                    <Link to={`/case-studies/${item.slug}`} className="hover:text-blue-600">
                      {item.title}
                    </Link>
                  </h2>
                  {item.tags && item.tags.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {item.excerpt && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                      {item.excerpt}
                    </p>
                  )}
                </div>
                <div>
                  <Link
                    to={`/case-studies/${item.slug}`}
                    className="text-sm font-semibold text-blue-600 hover:underline"
                  >
                    View case study →
                  </Link>
                </div>
              </article>
            ))}
            {!loading && items.length === 0 && (
              <p className="text-gray-500 text-sm">No case studies published yet.</p>
            )}
          </div>
        </Container>
      </section>
    </PageShell>
  );
};
