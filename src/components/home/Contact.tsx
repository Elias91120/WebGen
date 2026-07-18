import { PaperPlaneTilt } from '@phosphor-icons/react';
import Reveal from '../motion/Reveal';
import type { Translations } from '../../i18n/translations';

interface ContactProps {
  t: Translations;
  formStatus: 'idle' | 'submitting' | 'success';
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function Contact({ t, formStatus, onSubmit }: ContactProps) {
  return (
    <section id="contact" className="relative z-10 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-4xl">
              {t.contact.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-400 md:text-lg">
              {t.contact.subtitle}
            </p>

            <div className="mt-8 rounded-2xl border border-white/8 bg-[#0d1117]/70 p-5">
              <h3 className="font-semibold text-white">{t.contact.direct.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{t.contact.direct.subtitle}</p>
              <a
                href="https://wa.me/33671618119"
                target="_blank"
                rel="noopener noreferrer"
                className="button2 mt-4"
              >
                <svg viewBox="0 0 32 32" className="h-[22px] w-[22px] fill-[#25D366]" aria-hidden>
                  <path d="M16.004 3C9.377 3 4 8.304 4 14.84c0 2.37.73 4.56 1.98 6.38L4 29l7.99-2.09a12.2 12.2 0 0 0 4.014.67c6.627 0 12.004-5.304 12.004-11.84C28.008 8.304 22.631 3 16.004 3zm0 21.59c-1.24 0-2.45-.31-3.52-.9l-.25-.14-4.74 1.24 1.27-4.61-.16-.27a9.4 9.4 0 0 1-1.45-5.05c0-5.22 4.32-9.46 9.85-9.46s9.85 4.24 9.85 9.46-4.32 9.46-9.85 9.46z" />
                </svg>
                {t.contact.direct.phone}
              </a>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.06}>
            {formStatus === 'success' ? (
              <div className="surface-card flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
                <p className="font-display text-2xl font-bold text-white">{t.contact.successTitle}</p>
                <p className="mt-2 text-slate-400">{t.contact.successDesc}</p>
                <p className="mt-4 text-sm text-slate-500">{t.contact.successTip}</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="surface-card space-y-4 p-5 md:p-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-slate-400">{t.contact.form.name}</span>
                    <input
                      required
                      name="name"
                      type="text"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-400/40"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-slate-400">{t.contact.form.email}</span>
                    <input
                      required
                      name="email"
                      type="email"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-400/40"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-400">{t.contact.form.type}</span>
                  <select
                    name="type"
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#0d1117] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/40"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      —
                    </option>
                    {t.contact.form.types.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-400">
                    {t.contact.form.serviceInterest}
                  </span>
                  <select
                    name="service"
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#0d1117] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/40"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      —
                    </option>
                    {t.contact.form.serviceOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-400">{t.contact.form.message}</span>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-400/40"
                  />
                </label>
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  {formStatus === 'submitting' ? t.contact.form.sending : t.contact.form.btn}
                  <PaperPlaneTilt className="h-4 w-4" weight="bold" />
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
