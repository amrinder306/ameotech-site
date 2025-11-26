import React from 'react';

type Props = {
  children: React.ReactNode;
};

export const RequireAdmin: React.FC<Props> = ({ children }) => {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('ameotech_admin_token')
      : null;

  if (!token) {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
    return null;
  }

  return <>{children}</>;
};
