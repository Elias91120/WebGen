import { Bot, CalendarCheck, Mail, RotateCcw, Send, Sparkles, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { openBooking } from '../lib/booking';

interface AiAgentWidgetProps {
  lang: 'en' | 'fr';
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  status?: 'streaming' | 'error';
}

const MAX_CHARS = 500;
const CONTACT_EMAIL = 'contact@3geeks.fr';

const COPY = {
  fr: {
    launcher: 'Assistant IA',
    title: 'Assistant 3geeks',
    online: 'En ligne',
    subtitle: 'Réponse en quelques secondes',
    greeting: 'Bonjour ! Je suis l’assistant de 3geeks. Posez-moi vos questions sur nos offres, nos délais, nos réalisations ou votre projet.',
    suggestionsLabel: 'Questions fréquentes',
    suggestions: ['Combien coûte un site vitrine ?', 'En combien de temps livrez-vous ?', 'Quels projets avez-vous réalisés ?', 'Comment se passe le paiement ?'],
    placeholder: 'Posez votre question…',
    send: 'Envoyer',
    typing: 'L’assistant rédige sa réponse…',
    disclaimer: 'Assistant IA : il peut se tromper. Pour un devis précis, réservez un appel.',
    book: 'Réserver un appel gratuit',
    email: 'Écrire un e-mail',
    reset: 'Nouvelle conversation',
    close: 'Fermer l’assistant',
    error: 'Je ne peux pas répondre pour le moment. Réservez un appel gratuit de 30 min ou écrivez-nous à contact@3geeks.fr : on vous répond sous 24 h.',
  },
  en: {
    launcher: 'AI assistant',
    title: '3geeks assistant',
    online: 'Online',
    subtitle: 'Answers in seconds',
    greeting: 'Hi! I’m the 3geeks assistant. Ask me about our offers, timelines, past projects or your own project.',
    suggestionsLabel: 'Popular questions',
    suggestions: ['How much is a showcase website?', 'How fast do you deliver?', 'What have you built?', 'How does payment work?'],
    placeholder: 'Ask your question…',
    send: 'Send',
    typing: 'The assistant is writing…',
    disclaimer: 'AI assistant: it can make mistakes. For an exact quote, book a call.',
    book: 'Book a free call',
    email: 'Send an email',
    reset: 'New conversation',
    close: 'Close the assistant',
    error: 'I can’t answer right now. Book a free 30-minute call or email us at contact@3geeks.fr: we reply within 24 hours.',
  },
};

// Answers that point to a call get a one-tap booking button.
const MENTIONS_CALL = /appel|book a (free )?call|free (30-minute )?call|calendly/i;

class ChatError extends Error {}

async function streamChat(
  body: { lang: string; messages: Array<Pick<ChatMessage, 'role' | 'content'>> },
  signal: AbortSignal,
  onEvent: (event: string, data: { t?: string }) => void,
) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok || !res.body || !res.headers.get('content-type')?.includes('text/event-stream')) {
    const data = await res.json().catch(() => ({}));
    throw new ChatError(typeof data.message === 'string' ? data.message : '');
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let index;
    while ((index = buffer.indexOf('\n\n')) >= 0) {
      const block = buffer.slice(0, index);
      buffer = buffer.slice(index + 2);
      const event = /^event: (.*)$/m.exec(block)?.[1];
      const data = /^data: (.*)$/m.exec(block)?.[1];
      if (event && data) onEvent(event, JSON.parse(data));
    }
  }
}

// Links, e-mails and **bold** from the model, rendered without injecting HTML.
const RICH = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*|(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"»])|([\w.%+-]+@[\w-]+\.[\w.-]*\w)/g;
const linkClass = 'font-medium text-brand-mint underline decoration-brand-mint/40 underline-offset-2 hover:decoration-brand-mint';

function renderRich(raw: string) {
  const text = raw.replace(/^#{1,6}\s+/gm, '');
  const nodes: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(RICH)) {
    const [whole, label, href, bold, url, email] = match;
    const at = match.index ?? 0;
    if (at > last) nodes.push(text.slice(last, at));
    if (href || url) {
      nodes.push(
        <a key={at} href={href || url} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {label || url}
        </a>,
      );
    } else if (bold) {
      nodes.push(<strong key={at} className="font-semibold text-white">{bold}</strong>);
    } else if (email) {
      nodes.push(<a key={at} href={`mailto:${email}`} className={linkClass}>{email}</a>);
    }
    last = at + whole.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export const AiAgentWidget: React.FC<AiAgentWidgetProps> = ({ lang }) => {
  const copy = COPY[lang];
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const warmedUp = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, isOpen]);

  // Lets the server load the model while the visitor reads and types.
  useEffect(() => {
    if (!isOpen || warmedUp.current) return;
    warmedUp.current = true;
    fetch('/api/chat/warm', { method: 'POST' }).catch(() => {});
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // No auto-focus on touch screens: it would pop the keyboard over the answer.
    if (window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const book = () => {
    setIsOpen(false);
    openBooking('chatbot');
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setBusy(false);
  };

  const send = async (text: string) => {
    const question = text.trim().slice(0, MAX_CHARS);
    if (!question || busy) return;

    const history = [...messages.filter((m) => m.status !== 'error'), { role: 'user' as const, content: question }];
    setMessages((prev) => [...prev, { role: 'user', content: question }, { role: 'assistant', content: '', status: 'streaming' }]);
    setInput('');
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;
    // Only ever touches the answer being streamed, even after a reset.
    const updateAnswer = (change: (m: ChatMessage) => ChatMessage) =>
      setMessages((prev) => {
        const current = prev[prev.length - 1];
        if (controller.signal.aborted || current?.status !== 'streaming') return prev;
        return [...prev.slice(0, -1), change(current)];
      });

    try {
      await streamChat(
        { lang, messages: history.slice(-10).map(({ role, content }) => ({ role, content })) },
        controller.signal,
        (event, data) => {
          if (event === 'delta') updateAnswer((m) => ({ ...m, content: m.content + (data.t || '') }));
          else if (event === 'replace') updateAnswer((m) => ({ ...m, content: data.t || '' }));
          else if (event === 'error') updateAnswer((m) => ({ ...m, content: data.t || copy.error, status: 'error' }));
        },
      );
      updateAnswer((m) => (m.content ? { ...m, status: undefined } : { ...m, content: copy.error, status: 'error' }));
    } catch (err) {
      const message = err instanceof ChatError && err.message ? err.message : copy.error;
      updateAnswer((m) => ({ ...m, content: message, status: 'error' }));
    } finally {
      if (abortRef.current === controller) setBusy(false);
    }
  };

  const conversation: ChatMessage[] = [{ role: 'assistant', content: copy.greeting }, ...messages];

  return (
    <>
      {/* Launcher: a round icon on phones so it never covers the page content */}
      <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={copy.launcher}
          aria-expanded={isOpen}
          className="group relative flex items-center gap-2.5 rounded-full border border-brand-mint/40 bg-surface/90 p-3.5 text-xs font-semibold text-white shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-brand-mint active:scale-95 sm:px-4 sm:py-2.5"
        >
          <span className="absolute right-0.5 top-0.5 flex h-2.5 w-2.5 shrink-0 sm:relative sm:right-auto sm:top-auto">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-mint/80 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-mint" />
          </span>
          <Bot className="h-5 w-5 text-brand-mint transition-transform group-hover:rotate-12 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">{copy.launcher}</span>
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="assistant-title"
        >
          <div
            className="relative flex h-[85svh] w-full flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-surface shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] sm:h-[620px] sm:max-w-lg sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-mint/30 bg-brand-mint/10 text-brand-mint">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 id="assistant-title" className="flex items-center gap-2 font-display text-sm font-semibold text-white">
                    {copy.title}
                    <span className="rounded-full border border-brand-mint/30 bg-brand-mint/10 px-2 py-0.5 font-sans text-[10px] font-medium text-brand-mint">
                      {copy.online}
                    </span>
                  </h3>
                  <p className="truncate text-[11px] text-slate-400">{copy.subtitle}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label={copy.reset}
                    title={copy.reset}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label={copy.close}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3.5 overflow-y-auto p-4 text-sm" aria-live="polite" aria-busy={busy}>
              {conversation.map((msg, idx) => {
                const isUser = msg.role === 'user';
                const waiting = msg.status === 'streaming' && !msg.content;
                const lastAnswer = !isUser && idx > 0 && !msg.status && idx === conversation.length - 1;
                return (
                  <div key={idx} className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    {!isUser && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-brand-mint/30 bg-brand-mint/10 text-brand-mint">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[84%] rounded-2xl px-4 py-3 leading-relaxed ${
                        isUser
                          ? 'rounded-tr-none bg-brand-gradient font-medium text-ink'
                          : 'rounded-tl-none border border-white/10 bg-white/[0.04] text-slate-100'
                      }`}
                    >
                      {waiting ? (
                        <span className="flex items-center gap-2 text-slate-400">
                          <span className="flex gap-1" aria-hidden="true">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-mint [animation-delay:-0.3s]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-mint [animation-delay:-0.15s]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-mint" />
                          </span>
                          {copy.typing}
                        </span>
                      ) : (
                        <p className="whitespace-pre-wrap break-words">{isUser ? msg.content : renderRich(msg.content)}</p>
                      )}

                      {(msg.status === 'error' || (lastAnswer && MENTIONS_CALL.test(msg.content))) && (
                        <div className="mt-3 flex flex-wrap gap-2 border-t border-white/10 pt-3">
                          <button
                            type="button"
                            onClick={book}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-gradient px-3 py-1.5 text-xs font-semibold text-ink transition-opacity hover:opacity-90"
                          >
                            <CalendarCheck className="h-3.5 w-3.5" /> {copy.book}
                          </button>
                          {msg.status === 'error' && (
                            <a
                              href={`mailto:${CONTACT_EMAIL}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-brand-mint/50 hover:text-white"
                            >
                              <Mail className="h-3.5 w-3.5" /> {copy.email}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Suggestions until the first question */}
            {messages.length === 0 && (
              <div className="border-t border-white/10 px-4 py-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{copy.suggestionsLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {copy.suggestions.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => send(prompt)}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-left text-xs text-slate-300 transition-colors hover:border-brand-mint/50 hover:bg-brand-mint/10 hover:text-white"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-white/10 bg-ink/40 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3"
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  maxLength={MAX_CHARS}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={copy.placeholder}
                  aria-label={copy.placeholder}
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-base text-white placeholder-slate-500 transition-colors focus:border-brand-mint/60 focus:bg-white/[0.07] focus:outline-none sm:text-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || busy}
                  aria-label={copy.send}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-slate-500">{copy.disclaimer}</p>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AiAgentWidget;
