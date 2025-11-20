import React, { useEffect, useState, FormEvent } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAdminRole } from './AdminRoleContext';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000';

type ContentType = 'case_study' | 'job_post';
type ContentStatus = 'draft' | 'published' | 'archived';

type ContentItem = {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  excerpt?: string;
  body_rich: string;
  tags?: string[];
  meta?: Record<string, any>;
  status: ContentStatus;
};

type ContentItemCreate = {
  type: ContentType;
  title: string;
  slug: string;
  excerpt?: string;
  body_rich: string;
  tags?: string[];
  meta?: Record<string, any>;
  status?: ContentStatus;
};

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const AdminContentEditor: React.FC = () => {
  const { id } = useParams();
  const query = useQuery();
  const navigate = useNavigate();
  const { role } = useAdminRole();

  const [loading, setLoading] = useState<boolean>(!!id);
  const [saving, setSaving] = useState(false);
  const [item, setItem] = useState<ContentItem | null>(null);
  const [type, setType] = useState<ContentType>('case_study');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [body, setBody] = useState('');
  // Job meta fields
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [applyEmail, setApplyEmail] = useState('');

  const isEdit = !!id;

  const autoSplitClaude = (input: string) => {
    const parts = input.split(/---+|SUMMARY:|DETAILS:/i);
    let summary = "";
    let full = "";
    if (parts.length >= 3) {
      summary = parts[1].trim();
      full = parts[2].trim();
    } else {
      // fallback: first paragraph as summary
      const idx = input.indexOf("</p>");
      if (idx !== -1) {
        summary = input.slice(0, idx + 4);
        full = input;
      } else {
        summary = input.slice(0, 200) + "...";
        full = input;
      }
    }
    setExcerpt(summary);
    setBody(full);
  };


 
  const buildClaudePrompt = () => {
    const baseIntro = `You are helping Ameotech (Applied AI Engineering firm) draft high-quality website content.`;
    if (type === 'case_study') {
      return `${baseIntro}
Generate TWO HTML blocks for a case study:

1) SHORT SUMMARY HTML
- 1–3 sentences
- Wrap in a single <p>...</p>
- Audience: busy founders, CTOs and CPOs
- Focus on outcome and ROI

2) FULL DETAIL HTML
- Use <h2> sections: Challenge, Solution, Results
- Use <ul>/<li> for bullet points
- Keep it production-grade, not academic
- No <html>, <head> or <body> tags. Only inner HTML.

Tone:
- Clear, direct, senior-engineer level
- Concrete metrics where possible

The case study title is: "${title || '[[ADD TITLE HERE]]'}".`;
    }

    return `${baseIntro}
Generate TWO HTML blocks for a job posting:

1) SHORT SUMMARY HTML
- 1–2 sentences
- Wrap in a single <p>...</p>
- Explain who we are hiring and why it matters.

2) FULL DETAIL HTML
- Use headings: About the role, What you'll do, What you should bring, Bonus points, How we work
- Include location, experience level and tech stack if referenced.
- Use clean <h2>, <h3>, <ul>, <p>.

Tone:
- Senior-engineering friendly, direct, no fluff.

This is for job title: "${title || '[[ADD JOB TITLE HERE]]'}".`;
  };

  const runSeoAnalysis = () => {
    const html = body;
    if (!html) {
      alert('Add Full Detail HTML before running SEO analysis.');
      return;
    }
    const findings: string[] = [];
    const text = html.replace(/<[^>]+>/g, ' ');
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const readingTimeMin = Math.max(1, Math.round(wordCount / 200));

    if (!html.match(/<h1/i)) findings.push('No <h1> found – consider adding a main heading.');
    if (!html.match(/<h2/i)) findings.push('No <h2> found – consider section headings like Challenge, Solution, Results.');
    if (!html.match(/<p/i)) findings.push('No <p> tags found – content may not have readable paragraphs.');

    if (wordCount < 150) {
      findings.push(`Content is quite short (~${wordCount} words). Consider expanding for more depth.`);
    } else if (wordCount > 1500) {
      findings.push(`Content is long (~${wordCount} words). Consider trimming or splitting.`);
    }

    findings.push(`Estimated reading time: ${readingTimeMin} min(s).`);

    alert('SEO Analysis:\n\n' + findings.join('\n'));
  };

  const autoGenerateTags = () => {
    const html = body;
    if (!html) {
      alert('Add Full Detail HTML before generating tags.');
      return;
    }
    const lower = html.toLowerCase();
    const tags = new Set<string>();
    const addIf = (cond: boolean, tag: string) => { if (cond) tags.add(tag); };

    addIf(/pricing|price optimization|margin/.test(lower), 'Pricing');
    addIf(/forecast|demand/.test(lower), 'Forecasting');
    addIf(/data pipeline|etl|warehouse|bigquery|snowflake/.test(lower), 'Data Engineering');
    addIf(/automation|workflow|rpa/.test(lower), 'Automation');
    addIf(/retail|ecommerce|grocery/.test(lower), 'Retail');
    addIf(/fintech|credit|underwriting|risk/.test(lower), 'FinTech');
    addIf(/saas|subscription|churn/.test(lower), 'SaaS');
    addIf(/ml model|machine learning|ai /.test(lower), 'ML/AI');

    if (type === 'job_post') {
      addIf(/senior|lead/.test(lower), 'Senior');
      addIf(/backend|api|microservice/.test(lower), 'Backend');
      addIf(/frontend|react|typescript/.test(lower), 'Frontend');
      addIf(/devops|kubernetes|docker/.test(lower), 'DevOps');
      addIf(/data engineer|etl|warehouse/.test(lower), 'Data Engineer');
      addIf(/ml engineer|mlops/.test(lower), 'ML Engineer');
    }

    if (!tags.size) {
      tags.add(type === 'case_study' ? 'Case Study' : 'Job');
    }

    const current = tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const merged = Array.from(new Set([...current, ...Array.from(tags)])).join(', ');
    setTagsText(merged);
    alert('Tags updated based on content.');
  };

  const autoExtractMetadata = () => {
    if (!title) {
      alert('Set a title first to extract metadata.');
      return;
    }
    const slugBase = title;
    const slugValue = slugBase
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(slugValue);
    alert('Slug updated based on title.');
  };

  const loadTemplate = () => {
    if (type === 'case_study') {
      setExcerpt('<p>Short summary of the case study, highlighting problem, solution, and ROI in 1–3 sentences.</p>');
      setBody(`<h2>Challenge</h2>
<p>Describe the business problem, context, and why it mattered.</p>

<h2>Solution</h2>
<p>Explain the approach, architecture, and how Ameotech delivered it.</p>
<ul>
  <li>Key component or technique 1</li>
  <li>Key component or technique 2</li>
  <li>Key component or technique 3</li>
</ul>

<h2>Results</h2>
<p>Highlight measurable outcomes and ROI.</p>
<ul>
  <li>Metric 1 (e.g., +X% margin, -Y% churn)</li>
  <li>Metric 2</li>
</ul>`);
    } else {
      setExcerpt('<p>Short summary of the role and why it matters, in 1–2 sentences.</p>');
      setBody(`<h2>About the role</h2>
<p>Brief description of what this role owns and why it exists.</p>

<h2>What you'll do</h2>
<ul>
  <li>Responsibility 1</li>
  <li>Responsibility 2</li>
  <li>Responsibility 3</li>
</ul>

<h2>What you should bring</h2>
<ul>
  <li>Skill / experience 1</li>
  <li>Skill / experience 2</li>
</ul>

<h2>How we work</h2>
<p>Describe Ameotech's working style, culture, and expectations.</p>`);
    }
  };
 const validateHtml = (html: string) => {
    const warnings: string[] = [];
    if (!html.includes('<p')) warnings.push("No <p> tags found.");
    if (!html.match(/<h[1-3]/)) warnings.push("No heading tags (<h1>, <h2>, <h3>) found.");
    if ((html.match(/</g) || []).length !== (html.match(/>/g) || []).length)
      warnings.push("Mismatched < > brackets (possible unclosed tags).");
    return warnings;
  };

  const warnings = validateHtml(body);


  useEffect(() => {
    if (!isEdit) {
      const t = query.get('type') as ContentType | null;
      if (t === 'case_study' || t === 'job_post') {
        setType(t);
      }
      return;
    }
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/content/${id}`, {
          headers: {
            'x-role': role,
          },
        });
        if (!res.ok) throw new Error('Failed to load content item');
        const data: ContentItem = await res.json();
        setItem(data);
        setType(data.type);
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt ?? '');
        setBody(data.body_rich);
        setTagsText((data.tags ?? []).join(', '));
        const meta = data.meta ?? {};
        setLocation(meta.location ?? '');
        setEmploymentType(meta.employment_type ?? '');
        setExperienceLevel(meta.experience_level ?? '');
        setApplyEmail(meta.apply_email ?? '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit, query, role]);

  const buildPayload = (statusOverride?: ContentStatus): ContentItemCreate => {
    const tags = tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const meta: Record<string, any> = {};
    if (type === 'job_post') {
      if (location) meta.location = location;
      if (employmentType) meta.employment_type = employmentType;
      if (experienceLevel) meta.experience_level = experienceLevel;
      if (applyEmail) meta.apply_email = applyEmail;
    }

    return {
      type,
      title,
      slug,
      excerpt: excerpt || undefined,
      body_rich: body,
      tags: tags.length ? tags : undefined,
      meta: Object.keys(meta).length ? meta : undefined,
      status: statusOverride,
    };
  };

  const handleSave = async (status: ContentStatus = 'draft') => {
    setSaving(true);
    try {
      const payload = buildPayload(status);
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `${API_BASE}/admin/content/${id}` : `${API_BASE}/admin/content`;
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-role': role,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error('Failed to save content');
      }
      const saved: ContentItem = await res.json();
      setItem(saved);
      if (!isEdit) {
        navigate(`/admin/content/${saved.id}`, { replace: true });
      }
    } catch (err) {
      console.error(err);
      alert('Error saving content. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!item && !isEdit) {
      // First save as draft, then publish
      await handleSave('draft');
    }
    const targetId = item?.id || id;
    if (!targetId) return;
    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/admin/content/${targetId}/publish`, {
        method: 'POST',
        headers: {
          'x-role': role,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to publish content');
      }
      const updated: ContentItem = await res.json();
      setItem(updated);
      alert('Content published.');
    } catch (err) {
      console.error(err);
      alert('Error publishing content. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    const targetId = item?.id || id;
    if (!targetId) return;
    if (!window.confirm('Archive this content item?')) {
      return;
    }
    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/admin/content/${targetId}/archive`, {
        method: 'POST',
        headers: {
          'x-role': role,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to archive content');
      }
      const updated: ContentItem = await res.json();
      setItem(updated);
      alert('Content archived.');
    } catch (err) {
      console.error(err);
      alert('Error archiving content. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void handleSave('draft');
  };

  const titleLabel =
    type === 'case_study' ? 'Case Study Title' : 'Job Title';

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold">
            {isEdit ? 'Edit Content' : 'New Content'}
          </h1>
          <p className="text-xs text-gray-500">
            {type === 'case_study'
              ? 'Create or edit a case study. Use draft → publish workflow.'
              : 'Create or edit a job posting with rich text and job meta.'}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              const p = buildClaudePrompt();
              try {
                navigator.clipboard.writeText(p);
                alert('Claude prompt copied to clipboard.');
              } catch {
                alert('Claude prompt generated. Copy it manually from the AI Tools page if needed.');
              }
            }}
            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
          >
            Generate Claude Prompt
          </button>
          <button
            type="button"
            onClick={loadTemplate}
            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
          >
            Load Template
          </button>
          <button
            type="button"
            onClick={runSeoAnalysis}
            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
          >
            Analyze SEO
          </button>
          <button
            type="button"
            onClick={autoGenerateTags}
            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
          >
            Generate Tags
          </button>
          <button
            type="button"
            onClick={autoExtractMetadata}
            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
          >
            Extract Slug from Title
          </button>
        </div>

        <button
          onClick={() => navigate('/admin/content')}
          className="text-xs text-gray-600 hover:text-gray-900 underline"
        >
          ← Back to list
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isEdit && (
            <div className="flex gap-4">
              <label className="text-xs font-medium text-gray-700">
                Content type
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ContentType)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                  <option value="case_study">Case Study</option>
                  <option value="job_post">Job Post</option>
                </select>
              </label>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="text-xs font-medium text-gray-700">
              {titleLabel}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                required
              />
            </label>
            <label className="text-xs font-medium text-gray-700">
              Slug
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="dynamic-pricing-walmart"
                className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                required
              />
            </label>
          </div>

          <div className="flex justify-between items-center">
  <label className="text-xs font-medium text-gray-700 block">
    Full Detail HTML (paste full Claude-generated HTML)
<button type="button" className="ml-2 text-xs px-2 py-1 bg-blue-200 rounded hover:bg-blue-300" onClick={() => autoSplitClaude(prompt('Paste full Claude output (with summary + details):') || '')}>Auto-Split Claude Output</button>
  </label>
  <button type="button" className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setBody(prompt('Paste Claude HTML:') || '')}>Paste from Claude</button>
</div>
<label className="text-xs font-medium text-gray-700 block">
            Short Summary HTML (paste Claude-generated summary <p>...</p>)
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
            />
          </label>

          <div className="flex justify-between items-center">
  <label className="text-xs font-medium text-gray-700 block">
    Full Detail HTML (paste full Claude-generated HTML)
<button type="button" className="ml-2 text-xs px-2 py-1 bg-blue-200 rounded hover:bg-blue-300" onClick={() => autoSplitClaude(prompt('Paste full Claude output (with summary + details):') || '')}>Auto-Split Claude Output</button>
  </label>
  <button type="button" className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setBody(prompt('Paste Claude HTML:') || '')}>Paste from Claude</button>
</div>
<label className="text-xs font-medium text-gray-700 block">
            Tags (comma separated)
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="Retail, Pricing, Enterprise"
              className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
            />
          </label>

          {type === 'job_post' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="text-xs font-medium text-gray-700">
                Location
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Remote / India"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                />
              </label>
              <label className="text-xs font-medium text-gray-700">
                Employment Type
                <input
                  type="text"
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  placeholder="Full-time"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                />
              </label>
              <label className="text-xs font-medium text-gray-700">
                Experience Level
                <input
                  type="text"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  placeholder="Senior"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                />
              </label>
              <label className="text-xs font-medium text-gray-700">
                Apply Email
                <input
                  type="email"
                  value={applyEmail}
                  onChange={(e) => setApplyEmail(e.target.value)}
                  placeholder="careers@ameotech.com"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                />
              </label>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex justify-between items-center">
  <label className="text-xs font-medium text-gray-700 block">
    Full Detail HTML (paste full Claude-generated HTML)
<button type="button" className="ml-2 text-xs px-2 py-1 bg-blue-200 rounded hover:bg-blue-300" onClick={() => autoSplitClaude(prompt('Paste full Claude output (with summary + details):') || '')}>Auto-Split Claude Output</button>
  </label>
  <button type="button" className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setBody(prompt('Paste Claude HTML:') || '')}>Paste from Claude</button>
</div>
<label className="text-xs font-medium text-gray-700 block">
              Full Detail HTML (paste full Claude-generated HTML)
<button type="button" className="ml-2 text-xs px-2 py-1 bg-blue-200 rounded hover:bg-blue-300" onClick={() => autoSplitClaude(prompt('Paste full Claude output (with summary + details):') || '')}>Auto-Split Claude Output</button>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={14}
                className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 text-sm font-mono"
              />
            </label>
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">
                Preview (rendered HTML)
              </p>
              <div className="border border-gray-200 rounded-md p-3 h-full overflow-auto bg-white">
                
            {warnings.length > 0 && (
              <div className="mb-2 text-xs text-red-600">
                <strong>HTML Warnings:</strong>
                <ul className="list-disc ml-4">
                  {warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {!body && (
                  <p className="text-xs text-gray-400">
                    Start typing in the body field to see a preview here.
                  </p>
                )}
                {body &&
                  body.split('\n').map((para, idx) => (
                    <p key={idx} className="text-xs text-gray-800 mb-2">
                      {para}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Status:{' '}
              <span className="font-semibold">
                {item?.status ?? 'draft'}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="px-3 py-1 rounded border border-gray-300 text-xs hover:bg-gray-50 disabled:opacity-50"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={saving}
                className="px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700 disabled:opacity-50"
              >
                Publish
              </button>
              {isEdit && (
                <button
                  type="button"
                  onClick={handleArchive}
                  disabled={saving}
                  className="px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700 disabled:opacity-50"
                >
                  Archive
                </button>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
