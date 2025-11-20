import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { AdminRoleProvider, useAdminRole } from './AdminRoleContext';

const Sidebar: React.FC = () => {
  const { role, setRole } = useAdminRole();

  return (
    <aside className="w-64 bg-gray-900 text-gray-200 flex flex-col">
      <div className="px-4 py-4 font-bold text-lg border-b border-gray-800">
        Ameotech Admin
      </div>
      <div className="px-4 py-3 border-b border-gray-800 text-xs flex items-center justify-between gap-2">
        <span className="text-gray-400">Role</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as any)}
          className="bg-gray-800 text-gray-100 text-xs rounded px-2 py-1 border border-gray-700 focus:outline-none"
        >
          <option value="admin">Admin</option>
          <option value="content_editor">Content Editor</option>
          <option value="sales_rep">Sales Rep</option>
        </select>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1 text-sm">
        {(role === 'admin' || role === 'sales_rep') && (
          <NavLink
            to="/admin/chat"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md ${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-800/60'}`
            }
          >
            Live Chat
          </NavLink>
        )}
        {(role === 'admin' || role === 'content_editor') && (
          <NavLink
            to="/admin/ai-tools"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md ${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-800/60'}`
            }
          >
            AI Tools
          </NavLink>
        )}
        {(role === 'admin' || role === 'content_editor') && (
          <NavLink
            to="/admin/content"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md ${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-800/60'}`
            }
          >
            Content (Case Studies & Jobs)
          </NavLink>
        )}
      </nav>
      <div className="px-4 py-4 border-t border-gray-800 text-xs text-gray-400">
        <Link to="/" className="hover:text-white">
          ← Back to site
        </Link>
      </div>
    </aside>
  );
};

export const AdminLayout: React.FC = () => {
  return (
    <AdminRoleProvider>
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </AdminRoleProvider>
  );
};
