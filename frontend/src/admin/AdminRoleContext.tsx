import React, { createContext, useContext, useState, useEffect } from 'react';

export type AdminRole = 'admin' | 'content_editor' | 'sales_rep';

type AdminRoleContextValue = {
  role: AdminRole;
  setRole: (r: AdminRole) => void;
};

const AdminRoleContext = createContext<AdminRoleContextValue | undefined>(undefined);

export const AdminRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<AdminRole>('admin');

  useEffect(() => {
    const stored = window.localStorage.getItem('ameotech_admin_role') as AdminRole | null;
    if (stored === 'admin' || stored === 'content_editor' || stored === 'sales_rep') {
      setRoleState(stored);
    }
  }, []);

  const setRole = (r: AdminRole) => {
    setRoleState(r);
    window.localStorage.setItem('ameotech_admin_role', r);
  };

  return (
    <AdminRoleContext.Provider value={{ role, setRole }}>
      {children}
    </AdminRoleContext.Provider>
  );
};

export const useAdminRole = (): AdminRoleContextValue => {
  const ctx = useContext(AdminRoleContext);
  if (!ctx) {
    throw new Error('useAdminRole must be used within AdminRoleProvider');
  }
  return ctx;
};
