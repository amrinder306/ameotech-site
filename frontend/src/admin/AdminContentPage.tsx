const API_BASE = import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? "${import.meta.env.VITE_API_BASE}/?" : "");

const API_BASE = import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? "${import.meta.env.VITE_API_BASE}/?" : "");

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminRole } from './AdminRoleContext';

const API_BASE = import.meta.env.VITE_API_BASE ?? '${import.meta.env.VITE_API_BASE}/?';

type ContentItem = {
  id: string;
  type: 'case_study' | 'job_post';
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
};

export const AdminContentPage: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { role } = useAdminRole();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/content`, {
          headers: {
            'x-role': role,
          },
        });
        if (!res.ok) {
          throw new Error('Failed to load content');
        }
        const data = await res.json();
        setItems(data.items ?? data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [role]);

  const handleNew = (type: 'case_study' | 'job_post') => {
    navigate(`/admin/content/new?type=${type}`);
  };

  const handleRowClick = (id: string) => {
    navigate(`/admin/content/${id}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold">Content</h1>
          <p className="text-xs text-gray-500">
            Case studies and job posts managed via a simple draft → publish workflow.
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => handleNew('case_study')}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            + New Case Study
          </button>
          <button
            onClick={() => handleNew('job_post')}
            className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
          >
            + New Job Post
          </button>
        </div>
      </div>
      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {!loading && (
        <table className="min-w-full text-sm border border-gray-200 rounded-md overflow-hidden">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-3 py-2 border-b border-gray-200">Title</th>
              <th className="px-3 py-2 border-b border-gray-200">Type</th>
              <th className="px-3 py-2 border-b border-gray-200">Slug</th>
              <th className="px-3 py-2 border-b border-gray-200">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(item.id)}
              >
                <td className="px-3 py-2 border-b border-gray-100">{item.title}</td>
                <td className="px-3 py-2 border-b border-gray-100">
                  {item.type === 'case_study' ? 'Case Study' : 'Job Post'}
                </td>
                <td className="px-3 py-2 border-b border-gray-100 text-xs text-gray-500">
                  {item.slug}
                </td>
                <td className="px-3 py-2 border-b border-gray-100">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                      item.status === 'published'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : item.status === 'draft'
                        ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        : 'bg-gray-100 text-slate-600 dark:text-slate-300 border border-gray-200'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-center text-xs text-gray-500">
                  No content items yet. You can seed a few via the backend store or create new ones.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
