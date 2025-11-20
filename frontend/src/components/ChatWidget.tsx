import React, { useEffect, useRef, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000';

type ReasoningOption = {
  intent: string;
  label: string;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  options?: ReasoningOption[]; // for show_options responses
};

type SuggestedReply = {
  id: string;
  text: string;
};

type ReasoningMeta = {
  segment?: string;
  supports_handoff?: boolean;
};

type ReasoningResponse = {
  session_id: string;
  intent: string;
  intent_confidence: number;
  action: string;
  action_payload: Record<string, any>;
  bot_reply: string;
  meta?: ReasoningMeta;
};

type ReasoningActionCard = {
  id: string;
  title: string;
  description?: string;
  ctaLabel: string;
  action: string;
  actionPayload: Record<string, any>;
};

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [suggestions] = useState<SuggestedReply[]>([]); // reserved for future
  const [loading, setLoading] = useState(false);
  const [actionCard, setActionCard] = useState<ReasoningActionCard | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Initialise chat session on first open
  useEffect(() => {
    if (!isOpen || sessionId) return;

    let cancelled = false;

    const initSession = async () => {
      try {
        const res = await fetch(`${API_BASE}/chat/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: window.location.pathname,
          }),
        });

        if (!res.ok) return;

        const data = await res.json();
        if (!cancelled) {
          setSessionId(data.session_id);

          // backend returns `welcome`
          if (data.welcome) {
            setMessages([
              {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: data.welcome as string,
              },
            ]);
          }
        }
      } catch (e) {
        console.warn('Failed to init chat session', e);
      }
    };

    initSession();

    return () => {
      cancelled = true;
    };
  }, [isOpen, sessionId]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll on new messages
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    el.scrollTop = el.scrollHeight;
  }, [messages, actionCard]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const sendMessage = async (text: string) => {
    if (!sessionId || !text.trim()) return;

    const trimmed = text.trim();

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };

    // clear any previous suggestion card when user sends a new message
    setActionCard(null);

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/reason/chat-route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: trimmed,
          page: window.location.pathname,
          context: {},
          history: messages.slice(-5).map((m) => ({
            from: m.role === 'user' ? 'user' : 'bot',
            text: m.content,
          })),
        }),
      });

      const data: ReasoningResponse = await res.json();
      const payload = data.action_payload ?? {};

      // If the engine wants to show options, render them inline as buttons,
      // not as a generic "Suggested next step" card.
      if (data.action === 'show_options' && Array.isArray(payload.options)) {
        const options: ReasoningOption[] = payload.options.map((opt: any) => ({
          intent: String(opt.intent ?? ''),
          label: String(opt.label ?? ''),
        }));

        const botMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.bot_reply,
          options,
        };

        setMessages((prev) => [...prev, botMessage]);
        setActionCard(null);
        return;
      }

      // Regular assistant text message
      const botMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.bot_reply,
      };

      setMessages((prev) => [...prev, botMessage]);

      // Build action card only for actions that map to a single clear CTA
      if (data.action && data.action !== 'show_message') {
        const title =
          payload.title ||
          (data.action === 'open_lab_tool'
            ? (() => {
                const lab = payload.lab_tool || payload.lab || 'audit';
                if (lab === 'audit') return 'Run a quick readiness audit';
                if (lab === 'build_estimator') return 'Estimate budget & delivery model';
                return 'Run a Labs tool';
              })()
            : data.action === 'escalate_human'
            ? 'Talk to Ameotech'
            : 'Next step');

        const description =
          payload.description ||
          (data.action === 'open_lab_tool'
            ? 'We can run a short, guided flow to turn this into a concrete plan.'
            : data.action === 'escalate_human'
            ? 'Some questions are better handled live with an engineer or founder.'
            : undefined);

        const ctaLabel =
          payload.ctaLabel ||
          (data.action === 'open_lab_tool'
            ? 'Open Labs'
            : data.action === 'escalate_human'
            ? 'Talk to a human'
            : 'Continue');

        setActionCard({
          id: crypto.randomUUID(),
          title,
          description,
          ctaLabel,
          action: data.action,
          actionPayload: payload,
        });
      } else {
        setActionCard(null);
      }
    } catch (err) {
      console.error('Chat error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleActionCardClick = () => {
    if (!actionCard) return;

    const { action, actionPayload } = actionCard;

    // Fire-and-forget feedback
    try {
      fetch(`${API_BASE}/reason/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          event: 'action_clicked',
          action,
          payload: {
            ...actionPayload,
            source: 'chat',
          },
        }),
      }).catch(() => {});
    } catch (e) {
      console.warn('Failed to send feedback', e);
    }

    if (action === 'open_lab_tool') {
      const lab = actionPayload.lab_tool || actionPayload.lab || 'audit';

      if (lab === 'audit') {
        window.location.href = '/labs/audit';
      } else if (lab === 'build_estimator') {
        window.location.href = '/labs/build-estimator';
      } else {
        window.location.href = '/labs';
      }
    } else if (action === 'escalate_human') {
      const href = actionPayload.link || 'mailto:hello@ameotech.com';
      window.location.href = href;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input);
  };

  const handleOptionClick = (opt: ReasoningOption) => {
    // When user clicks an option from show_options, treat it as their next message.
    // For now we just send the label text; the backend rules + prototypes will interpret it.
    if (!opt.label || loading) return;
    sendMessage(opt.label);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-blue-600 text-white px-4 py-2 shadow-lg hover:bg-blue-700 text-sm font-semibold"
      >
        Chat with Ameotech
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-80 max-w-[90vw] rounded-2xl shadow-2xl border border-gray-200 bg-white flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <div>
          <p className="text-xs font-semibold text-gray-900">Ameotech Assistant</p>
          <p className="text-[11px] text-gray-500">Applied AI & engineering questions</p>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          className="text-gray-400 hover:text-gray-700 text-lg leading-none"
        >
          ×
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex-1 px-4 py-3 space-y-3 overflow-y-auto max-h-80 bg-gray-50"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="max-w-full">
              <div
                className={`rounded-2xl px-3 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                }`}
              >
                {msg.content}
              </div>

              {/* Inline options for show_options responses */}
              {msg.options && msg.options.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {msg.options.map((opt) => (
                    <button
                      key={opt.intent + opt.label}
                      type="button"
                      onClick={() => handleOptionClick(opt)}
                      className="inline-flex items-center px-3 py-1.5 rounded-full border border-gray-300 bg-white text-[11px] text-gray-800 hover:border-blue-500 hover:text-blue-600"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {actionCard && (
          <div className="mt-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-3 text-xs text-left">
            <div className="text-[11px] uppercase tracking-wide text-blue-500 font-semibold mb-1">
              Suggested step
            </div>
            <div className="text-sm font-semibold text-gray-900 mb-1">
              {actionCard.title}
            </div>
            {actionCard.description && (
              <div className="text-xs text-gray-700 mb-2">
                {actionCard.description}
              </div>
            )}
            <button
              type="button"
              onClick={handleActionCardClick}
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
            >
              {actionCard.ctaLabel}
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-200 px-3 py-2 bg-white">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about AI, pricing, delivery..."
            className="flex-1 rounded-full border border-gray-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-full bg-blue-600 text-white px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWidget;
