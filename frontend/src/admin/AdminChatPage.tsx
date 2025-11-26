import React from 'react';

export const AdminChatPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Live Chat (Sales / Admin)</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
        This is a placeholder for the live agent console. In the next iteration, this will show:
      </p>
      <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-1">
        <li>Waiting sessions (bot escalations, human requested)</li>
        <li>Active sessions assigned to this agent</li>
        <li>Past sessions / leads with filters</li>
      </ul>
      <p className="text-xs text-gray-400 mt-4">
        For now, chat is only handled by the on-site assistant widget.
      </p>
    </div>
  );
};
