import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Container } from '../components/ui/Container';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000';


type ContentItem = {
  id: string;
  title: string;
  slug: string;
  body_rich: string;
  tags?: string[];
  excerpt?: string;
};

export const CaseStudyDetail: React.FC = () => {
  const { slug } = useParams();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/content/case-studies/${slug}`);
        if (!res.ok) throw new Error('Failed to load case study');
        const data = await res.json();
        setItem(data);
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
          {!loading && !item && (
            <p className="text-sm text-red-500">Case study not found.</p>
          )}
          {item && (
            <>
              <div className="mb-6">
                {item.tags && item.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
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
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{item.title}</h1>
                {item.excerpt && (
                  <p className="text-gray-600 text-sm mb-4">{item.excerpt}</p>
                )}
              </div>
              <article className="prose prose-gray max-w-none">
                {item.body_rich.split('\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </article>
            </>
          )}
        </Container>
      </section>
    </PageShell>
  );
};
