import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, ArrowRight } from 'lucide-react';

interface AiAgentWidgetProps {
  lang: 'en' | 'fr';
  onNavigateSection?: (sectionId: string) => void;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  actions?: { label: string; action: () => void }[];
}

const QUICK_PROMPTS = {
  fr: [
    "Quels sont vos tarifs ?",
    "C'est quoi 3geeks ?",
    "Quels projets avez-vous livrés ?",
    "Comment démarrer un projet ?"
  ],
  en: [
    "What are your pricing plans?",
    "What is 3geeks?",
    "What live projects have you shipped?",
    "How do we get started?"
  ]
};

export const AiAgentWidget: React.FC<AiAgentWidgetProps> = ({ lang, onNavigateSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialGreeting: Message = {
    sender: 'ai',
    text: lang === 'fr'
      ? "Bonjour ! Je suis l'assistant du studio 3Geeks. Posez-moi une question sur nos offres (site Starter 300€, projet sur mesure), nos réalisations clients ou notre façon de travailler."
      : "Hi! I'm the 3Geeks studio assistant. Ask me anything about our offers (€300 Starter site, custom projects), client case studies, or how we build."
  };

  const [messages, setMessages] = useState<Message[]>([initialGreeting]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateAnswer(query, lang, onNavigateSection);
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <>
      {/* Floating launcher trigger */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="3Geeks AI Agent"
          className="group relative flex items-center gap-2.5 rounded-full border border-cyan-400/40 bg-[#0d1117]/90 px-4 py-2.5 text-xs font-semibold text-white shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-cyan-300 hover:bg-[#0d1117] hover:scale-105 active:scale-95"
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400/80 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
          </span>
          <Bot className="h-4 w-4 text-cyan-300 group-hover:rotate-12 transition-transform" />
          <span className="font-mono">AI Agent · 3Geeks</span>
        </button>
      </div>

      {/* Modal / Drawer Chat Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative flex flex-col w-full sm:max-w-lg h-[85vh] sm:h-[600px] bg-[#0d1117]/95 border border-cyan-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-400/10 text-cyan-300">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    3Geeks Studio AI
                    <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[10px] text-cyan-300 font-sans border border-cyan-400/30">
                      En ligne
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'fr' ? 'Studio web français · 3 fondateurs' : 'French web studio · 3 founders'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Fermer le chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs sm:text-sm">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/15 text-cyan-300">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[84%] rounded-2xl px-4 py-3 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none shadow-md'
                        : 'bg-white/5 border border-white/10 text-slate-100 rounded-tl-none backdrop-blur-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-white/10">
                        {msg.actions.map((act, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => {
                              act.action();
                              setIsOpen(false);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-200 hover:bg-cyan-400/25 transition-colors"
                          >
                            {act.label} <ArrowRight className="h-3 w-3" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                  <Bot className="h-3.5 w-3.5 text-cyan-300 animate-spin" />
                  <span>3Geeks AI prépare une réponse...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Chips */}
            <div className="p-3 border-t border-white/10 bg-white/[0.02]">
              <p className="text-[10px] text-slate-400 mb-2 font-mono uppercase tracking-wider">
                {lang === 'fr' ? 'Questions fréquentes :' : 'Suggested queries:'}
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {QUICK_PROMPTS[lang].map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSend(prompt)}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-200 transition-colors text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 p-3 border-t border-white/10 bg-[#0d1117]"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === 'fr' ? 'Posez votre question à 3geeks...' : 'Ask 3geeks studio...'}
                className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all font-sans"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-cyan-400/20"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

function generateAnswer(
  query: string,
  lang: 'en' | 'fr',
  onNavigateSection?: (sectionId: string) => void
): Message {
  const q = query.toLowerCase();

  if (q.includes('tarif') || q.includes('prix') || q.includes('price') || q.includes('offre') || q.includes('300')) {
    return {
      sender: 'ai',
      text: lang === 'fr'
        ? "Chez 3geeks, nous proposons deux formules principales :\n1. Site Starter à 300€ (paiement unique) : site one-page responsive avec design moderne, offre claire et formulaire/WhatsApp.\n2. Projet web sur mesure (sur devis) : réservation, e-commerce, dashboard admin et automatisations.\nOption Sérénité à 50€/mois pour la maintenance et la sécurité."
        : "At 3geeks, we offer two main formats:\n1. Starter Website (€300 one-off): focused single-page responsive site with clear offer, contact flow and modern design.\n2. Custom Web Project (custom quote): bookings, e-commerce, custom admin dashboards, and integrations.\nPeace-of-Mind maintenance at €50/mo.",
      actions: onNavigateSection
        ? [{ label: lang === 'fr' ? 'Voir nos offres' : 'View service plans', action: () => onNavigateSection('services') }]
        : []
    };
  }

  if (q.includes('3geeks') || q.includes('c\'est quoi') || q.includes('studio') || q.includes('fondateur')) {
    return {
      sender: 'ai',
      text: lang === 'fr'
        ? "3geeks est un studio web & produit digital français fondé par trois associés complémentaires : Elias Elloumi (Design & Expérience visuelle), Noam Leclappart (Systèmes & Data) et Charles Garbus (Relation client & Business). Nous créons des sites et outils digitaux clairs, rapides et soignés."
        : "3geeks is a French web & digital product studio co-founded by three friends: Elias Elloumi (Design & Visual Experience), Noam Leclappart (Systems & Data), and Charles Garbus (Client Relations & Business). We build clean, fast, and polished web products."
    };
  }

  if (q.includes('projet') || q.includes('client') || q.includes('réalisation') || q.includes('shipped')) {
    return {
      sender: 'ai',
      text: lang === 'fr'
        ? "Parmi nos projets réels en ligne :\n- Express Divorce USA (SaaS juridique multi-états)\n- CallKitchen (Agent vocal IA 24/7 pour restaurants)\n- Two App (Application iOS grand public sur l'App Store)\n- Green Jardin (Shopify CBD + caisse POS & menu TV)\n- Prompt Hub & PromptOptim (outils IA Green IT)"
        : "Our live production products include:\n- Express Divorce USA (Legal-tech SaaS)\n- CallKitchen (Restaurant 24/7 AI voice reception)\n- Two App (Consumer iOS app on the App Store)\n- Green Jardin (Omnichannel CBD store + POS + TV menu)\n- Prompt Hub & PromptOptim (Green IT open tools)",
      actions: onNavigateSection
        ? [{ label: lang === 'fr' ? 'Parcourir les projets' : 'Browse projects', action: () => onNavigateSection('projets') }]
        : []
    };
  }

  return {
    sender: 'ai',
    text: lang === 'fr'
      ? `Expliquez-nous ce que vous souhaitez vendre, présenter ou automatiser. L'équipe 3geeks vous répond sous 24h avec la solution la plus simple.`
      : `Tell us what you want to sell, present or automate. The 3geeks team replies within 24h with the simplest next step.`,
    actions: onNavigateSection
      ? [{ label: lang === 'fr' ? 'Parler de mon projet' : 'Talk about my project', action: () => onNavigateSection('contact') }]
      : []
  };
}

export default AiAgentWidget;
