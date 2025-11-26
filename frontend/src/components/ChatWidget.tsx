import React, { useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE ??
  (import.meta.env.DEV ? "http://localhost:8000" : "");

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type SuggestedReply = {
  label?: string;
  short_label?: string;
  payload?: string;
};

type NextAction = {
  label: string;
  type: "open_lab_tool" | "open_url" | "escalate_human" | string;
  target?: string;
  payload?: any;
};

type ChatResponse = {
  reply?: string;
  bot_reply?: string;
  suggested_replies?: SuggestedReply[];
  next_actions?: NextAction[];
  intent?: string;
};

const createId = () => Math.random().toString(36).slice(2);

export const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: createId(),
      role: "assistant",
      content:
        "Hi, I’m the Ameotech triage assistant. I can route you to the right thing: pricing engine, new build, modernisation, Labs tools or a real human.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedReply[]>([]);
  const [nextActions, setNextActions] = useState<NextAction[]>([]);
  const [sessionId] = useState(() => createId());

  const appendMessage = (role: ChatMessage["role"], content: string) => {
    setMessages((prev) => [...prev, { id: createId(), role, content }]);
  };

  const sendToBackend = async (content: string) => {
    setLoading(true);
    setSuggestions([]);
    setNextActions([]);
    try {
      const resp = await fetch(`${API_BASE}/reason/chat-route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: content,
        }),
      });
      if (!resp.ok) throw new Error("Failed to reach triage engine");
      const data: ChatResponse = await resp.json();
      const replyText = data.bot_reply || data.reply || "";
      
      if (replyText) {
        appendMessage("assistant", replyText);
      }
      
      // 1) Try using backend suggestions
      let suggestionList = data.suggested_replies ?? [];
      
      // 2) If none, but this is the classic triage prompt, inject defaults
      if (!suggestionList.length && replyText.includes("point you in the right direction")) {
        suggestionList = [
          { label: "Start a new project", payload: "I want to start a new project" },
          { label: "Fix an existing system", payload: "I want to fix an existing system" },
          { label: "Talk pricing engine", payload: "I want to discuss pricing engine" },
          { label: "See Labs tools", payload: "Show me your Labs tools" },
          { label: "Careers at Ameotech", payload: "I want to explore careers" },
        ];
      }
      
      setSuggestions(suggestionList);
      
      // keep next_actions for later use when ARE starts returning them
      if (Array.isArray(data.next_actions)) {
        setNextActions(data.next_actions);
      }
      
    } catch (err: any) {
      appendMessage(
        "assistant",
        "Something went wrong on our side. You can still email hello@ameotech.com and we’ll pick it up."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    appendMessage("user", trimmed);
    setInput("");
    await sendToBackend(trimmed);
  };

  const handleSuggestionClick = async (s: SuggestedReply) => {
    const text =
      s.payload || s.label || s.short_label || "".trim();
    if (!text) return;
    appendMessage("user", text);
    await sendToBackend(text);
  };

  const handleActionClick = async (a: NextAction) => {
    // feedback for analytics / future ARE use
    try {
      await fetch(`${API_BASE}/reason/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          event: "next_action_clicked",
          action: a.type,
          payload: a.payload ?? {},
        }),
      }).catch(() => {});
    } catch {
      // ignore
    }

    if (a.type === "open_lab_tool") {
      const lab =
        a.payload?.lab_tool || a.payload?.lab || a.target || "audit";

      if (lab === "audit") {
        window.location.href = "/labs/product-audit";
      } else if (lab === "build_estimator") {
        window.location.href = "/labs/build-estimator";
      } else if (lab === "architecture_blueprint") {
        window.location.href = "/labs/architecture-blueprint";
      } else if (lab === "ai_readiness") {
        window.location.href = "/labs/ai-readiness";
      } else {
        window.location.href = "/labs";
      }
      return;
    }

    if (a.type === "open_url") {
      const url = a.payload?.url || a.target;
      if (url) window.location.href = url;
      return;
    }

    if (a.type === "escalate_human") {
      try {
        await fetch(`${API_BASE}/internal/notify-sales`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            source: "chat",
            last_message: messages[messages.length - 1]?.content,
            transcript: messages,
            next_action: a,
          }),
        }).catch(() => {});
      } catch {
        // ignore
      }

      const href =
        a.payload?.link ||
        "mailto:hello@ameotech.com?subject=Ameotech%20chat%20escalation";
      window.location.href = href;
      return;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="w-80 md:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Ameotech Assistant
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Routing you to the right thing.
            </p>
          </div>
        </div>

        <div className="flex-1 max-h-80 overflow-y-auto px-4 py-3 space-y-2 text-sm">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-2xl px-3 py-2 max-w-[80%] ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <p className="text-xs text-slate-400">Thinking…</p>
          )}
        </div>

        {/* Suggested replies (from ARE) */}
        {suggestions.length > 0 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSuggestionClick(s)}
                className="inline-flex items-center rounded-full border border-slate-300 dark:border-slate-700 px-3 py-1 text-[11px] text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {s.short_label || s.label || s.payload || "Choose"}
              </button>
            ))}
          </div>
        )}

        {/* Future: next_actions from ARE/Labs */}
        {nextActions.length > 0 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {nextActions.map((a, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleActionClick(a)}
                className="inline-flex items-center rounded-full border border-slate-300 dark:border-slate-700 px-3 py-1 text-[11px] text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {a.label}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center gap-2"
        >
          <input
            type="text"
            className="flex-1 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Ask about pricing engine, AI, Labs or careers…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="text-xs font-medium text-blue-600 dark:text-blue-400 disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
