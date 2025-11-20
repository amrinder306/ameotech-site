import React, { useState } from 'react';

type ContentKind = 'case_study' | 'job_post';

const buildClaudePrompt = (kind: ContentKind, title: string) => {
  const baseIntro = `You are helping Ameotech (Applied AI Engineering firm) draft high-quality website content.`;
  if (kind === 'case_study') {
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

const analyzeHtmlSeo = (html: string) => {
  const result: string[] = [];
  const text = html.replace(/<[^>]+>/g, ' ');
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const readingTimeMin = Math.max(1, Math.round(wordCount / 200));

  if (!html.match(/<h1/i)) result.push('No <h1> found – consider adding a main heading.');
  if (!html.match(/<h2/i)) result.push('No <h2> found – consider section headings like Challenge, Solution, Results.');
  if (!html.match(/<p/i)) result.push('No <p> tags found – content may not have readable paragraphs.');

  if (wordCount < 150) {
    result.push(`Content is quite short (~${wordCount} words). Consider expanding for more depth.`);
  } else if (wordCount > 1500) {
    result.push(`Content is long (~${wordCount} words). Consider splitting into sections or trimming.`);
  }

  result.push(`Estimated reading time: ${readingTimeMin} min(s).`);

  return result;
};

const suggestTags = (html: string, kind: ContentKind): string[] => {
  const lower = html.toLowerCase();
  const tags = new Set<string>();

  const addIf = (cond: boolean, tag: string) => { if (cond) tags.add(tag); };

  // Simple keyword heuristics
  addIf(/pricing|price optimization|margin/.test(lower), 'Pricing');
  addIf(/forecast|demand/.test(lower), 'Forecasting');
  addIf(/data pipeline|etl|warehouse|bigquery|snowflake/.test(lower), 'Data Engineering');
  addIf(/automation|workflow|rpa/.test(lower), 'Automation');
  addIf(/retail|ecommerce|grocery/.test(lower), 'Retail');
  addIf(/fintech|credit|underwriting|risk/.test(lower), 'FinTech');
  addIf(/saas|subscription|churn/.test(lower), 'SaaS');
  addIf(/ml model|machine learning|ai /.test(lower), 'ML/AI');

  if (kind === 'job_post') {
    addIf(/senior|lead/.test(lower), 'Senior');
    addIf(/backend|api|microservice/.test(lower), 'Backend');
    addIf(/frontend|react|typescript/.test(lower), 'Frontend');
    addIf(/devops|kubernetes|docker/.test(lower), 'DevOps');
    addIf(/data engineer|etl|warehouse/.test(lower), 'Data Engineer');
    addIf(/ml engineer|mlops/.test(lower), 'ML Engineer');
  }

  if (!tags.size) {
    tags.add(kind === 'case_study' ? 'Case Study' : 'Job');
  }

  return Array.from(tags);
};

const extractMetadata = (html: string, title: string, kind: ContentKind) => {
  const slugBase = title || 'new-item';
  const slug = slugBase
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const lower = html.toLowerCase();
  let category = 'General';
  if (/retail|grocery|ecommerce/.test(lower)) category = 'Retail';
  else if (/fintech|credit|underwriting|loan/.test(lower)) category = 'FinTech';
  else if (/saas|subscription|b2b/.test(lower)) category = 'SaaS';
  else if (/entertainment|media|sports/.test(lower)) category = 'Media';

  let seniority = '';
  if (kind === 'job_post') {
    if (/senior|lead/.test(lower)) seniority = 'Senior';
    else if (/junior|graduate/.test(lower)) seniority = 'Junior';
    else seniority = 'Mid-level';
  }

  return { slug, category, seniority };
};

export const AiToolsPage: React.FC = () => {
  const [kind, setKind] = useState<ContentKind>('case_study');
  const [title, setTitle] = useState('');
  const [html, setHtml] = useState('');
  const [prompt, setPrompt] = useState('');
  const [seoFindings, setSeoFindings] = useState<string[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [meta, setMeta] = useState<{ slug: string; category: string; seniority?: string } | null>(null);

  const handleGeneratePrompt = () => {
    const p = buildClaudePrompt(kind, title);
    setPrompt(p);
    try {
      navigator.clipboard.writeText(p);
    } catch {
      // ignore
    }
  };

  const handleAnalyzeSeo = () => {
    setSeoFindings(analyzeHtmlSeo(html));
  };

  const handleSuggestTags = () => {
    setTagSuggestions(suggestTags(html, kind));
  };

  const handleExtractMeta = () => {
    setMeta(extractMetadata(html, title, kind));
  };

  const handleCopyPrompt = () => {
    if (!prompt) return;
    try {
      navigator.clipboard.writeText(prompt);
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Tools</h1>
          <p className="text-sm text-gray-600">
            Helper utilities to work with Claude, analyze HTML, and generate tags/metadata for Ameotech content.
          </p>
        </div>
      </header>

      <section className="border border-gray-200 rounded-lg p-4 bg-white">
        <h2 className="font-semibold text-sm mb-3">Content Context</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <label className="text-xs font-medium text-gray-700">
            Content Type
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as ContentKind)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              <option value="case_study">Case Study</option>
              <option value="job_post">Job Post</option>
            </select>
          </label>
          <label className="text-xs font-medium text-gray-700 flex-1">
            Title / Role
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={kind === 'case_study' ? "Dynamic Pricing at Enterprise Scale" : "Senior Backend Engineer"}
              className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">Claude Prompt Generator</h2>
          <button
            type="button"
            onClick={handleGeneratePrompt}
            className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Generate Prompt
          </button>
        </div>
        <p className="text-xs text-gray-500">
          This builds a ready-to-use instruction you can paste into Claude to get summary + full HTML.
        </p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={6}
          className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs font-mono"
          placeholder="Generated prompt will appear here..."
        />
        <button
          type="button"
          onClick={handleCopyPrompt}
          className="text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
        >
          Copy Prompt
        </button>
      </section>

      <section className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">HTML Input</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAnalyzeSeo}
              className="text-xs px-3 py-1 rounded bg-gray-900 text-white hover:bg-gray-800"
            >
              Analyze SEO
            </button>
            <button
              type="button"
              onClick={handleSuggestTags}
              className="text-xs px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            >
              Generate Tags
            </button>
            <button
              type="button"
              onClick={handleExtractMeta}
              className="text-xs px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            >
              Extract Metadata
            </button>
          </div>
        </div>
        <textarea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          rows={10}
          className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs font-mono"
          placeholder="Paste summary or full detail HTML from Claude here..."
        />

        {seoFindings.length > 0 && (
          <div className="mt-3 text-xs">
            <h3 className="font-semibold mb-1">SEO Findings</h3>
            <ul className="list-disc ml-4 space-y-1 text-gray-700">
              {seoFindings.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        {tagSuggestions.length > 0 && (
          <div className="mt-3 text-xs">
            <h3 className="font-semibold mb-1">Suggested Tags</h3>
            <p className="text-gray-700">{tagSuggestions.join(', ')}</p>
          </div>
        )}

        {meta && (
          <div className="mt-3 text-xs">
            <h3 className="font-semibold mb-1">Metadata</h3>
            <p><span className="font-medium">Slug:</span> {meta.slug}</p>
            <p><span className="font-medium">Category:</span> {meta.category}</p>
            {meta.seniority && <p><span className="font-medium">Seniority:</span> {meta.seniority}</p>}
          </div>
        )}
      </section>

      <section className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
        <h2 className="font-semibold text-sm">Templates</h2>
        <p className="text-xs text-gray-500">
          Use these as starting skeletons you can send to Claude or paste directly into the editor.
        </p>
        <details className="text-xs">
          <summary className="cursor-pointer font-semibold">Case Study Template</summary>
          <pre className="mt-2 whitespace-pre-wrap bg-gray-50 border border-gray-200 rounded p-2 text-[11px]">
{`<h2>Challenge</h2>
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
</ul>`}
          </pre>
        </details>

        <details className="text-xs mt-2">
          <summary className="cursor-pointer font-semibold">Job Post Template</summary>
          <pre className="mt-2 whitespace-pre-wrap bg-gray-50 border border-gray-200 rounded p-2 text-[11px]">
{`<h2>About the role</h2>
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
<p>Describe Ameotech's working style, culture, and expectations.</p>`}
          </pre>
        </details>
      </section>
    </div>
  );
};
