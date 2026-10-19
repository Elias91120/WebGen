import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, Briefcase, ChevronDown, ShieldCheck, UserPlus, Users, Zap } from 'lucide-react';
import Reveal from './Reveal';
import { translations } from '../i18n';

import eliasImg from '../assets/images/Elias.jpeg';
import noamImg from '../assets/images/Noam.jpeg';
import nielsImg from '../assets/images/Niels.png';

type TeamCopy = (typeof translations)['en']['team'] | (typeof translations)['fr']['team'];
type FounderKey = 'elias' | 'noam';

// Both co-founders share the exact same card and contact treatment.
export const FOUNDERS: Record<FounderKey, { name: string; image: string; linkedin: string }> = {
  elias: { name: 'Elias Elloumi', image: eliasImg, linkedin: 'https://www.linkedin.com/in/elias-elloumi/' },
  noam: { name: 'Noam Leclapart-Jublot', image: noamImg, linkedin: 'https://www.linkedin.com/in/noam-leclapart-jublot/' },
};

// Add new business introducers here; each one gets an identical card. The last card invites new ones.
const INTRODUCERS = [
  { key: 'niels', name: 'Niels Wiriath', image: nielsImg },
] as const;

type Certification = {
  title: string;
  issuer: string;
  date?: string;
  expires?: string;
  expired?: boolean;
  credentialId?: string;
  skill?: string;
  link?: string;
};

type FounderProfile = {
  role: string;
  desc: string;
  expertise: readonly string[];
  background: readonly { title: string; org: string; period: string }[];
  certifications: readonly Certification[];
};

export const LinkedInIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 100 100" className={`${className} shrink-0 fill-current`} aria-hidden="true">
    <path d="M92.86,0H7.12A7.17,7.17,0,0,0,0,7.21V92.79A7.17,7.17,0,0,0,7.12,100H92.86A7.19,7.19,0,0,0,100,92.79V7.21A7.19,7.19,0,0,0,92.86,0ZM30.22,85.71H15.4V38H30.25V85.71ZM22.81,31.47a8.59,8.59,0,1,1,8.6-8.59A8.6,8.6,0,0,1,22.81,31.47Zm63,54.24H71V62.5c0-5.54-.11-12.66-7.7-12.66s-8.91,6-8.91,12.26V85.71H39.53V38H53.75v6.52H54c2-3.75,6.83-7.7,14-7.7,15,0,17.79,9.89,17.79,22.74Z" />
  </svg>
);

// Certifications shown before "show more" (same for both founders).
const CERTS_VISIBLE = 3;

const sectionTitle = 'flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300';

const FounderCard: React.FC<{ founderKey: FounderKey; profile: FounderProfile; labels: TeamCopy['labels'] }> = ({ founderKey, profile, labels }) => {
  const founder = FOUNDERS[founderKey];
  const [allCerts, setAllCerts] = useState(false);
  const hidden = profile.certifications.length - CERTS_VISIBLE;
  const certs = allCerts ? profile.certifications : profile.certifications.slice(0, CERTS_VISIBLE);

  return (
    <article className="card flex h-full flex-col p-6 md:p-8">
      <div className="flex items-center gap-5">
        <div className="h-20 w-20 shrink-0 rounded-full bg-brand-gradient p-[2px] md:h-24 md:w-24">
          <img src={founder.image} alt={founder.name} loading="lazy" className="h-full w-full rounded-full border-2 border-surface object-cover" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-xl font-semibold text-white md:text-2xl">{founder.name}</h3>
          <p className="mt-1 text-sm font-medium text-brand-mint">{profile.role}</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-slate-400 md:text-base">{profile.desc}</p>

      <div className="mt-6 border-t border-white/[0.07] pt-6">
        <h4 className={sectionTitle}><Zap className="h-3.5 w-3.5 text-brand-lime" />{labels.expertise}</h4>
        <ul className="mt-3 flex flex-wrap gap-2">
          {profile.expertise.map((skill) => (
            <li key={skill} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-300">{skill}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 border-t border-white/[0.07] pt-6">
        <h4 className={sectionTitle}><Briefcase className="h-3.5 w-3.5 text-brand-lime" />{labels.background}</h4>
        <ul className="mt-3 space-y-3">
          {profile.background.map((item) => (
            <li key={item.title + item.org} className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="text-xs text-slate-500">{item.org}</p>
              </div>
              <span className="shrink-0 pt-0.5 text-xs tabular-nums text-slate-500">{item.period}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 border-t border-white/[0.07] pt-6">
        <h4 className={sectionTitle}>
          <ShieldCheck className="h-3.5 w-3.5 text-brand-lime" />{labels.certifications}
          <span className="ml-auto tabular-nums text-slate-500">{profile.certifications.length}</span>
        </h4>
        <ul className="mt-3 space-y-3.5">
          {certs.map((c) => (
            <li key={c.title + c.issuer} className="border-l-2 border-brand-mint/40 pl-3">
              <p className="text-sm font-medium leading-snug text-white">{c.title}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {c.issuer}
                {c.date && ` · ${c.expired ? labels.expired : labels.issued} ${c.date}`}
                {c.expires && ` · ${labels.expires} ${c.expires}`}
              </p>
              {c.skill && <p className="mt-0.5 text-xs text-slate-400">{labels.skills} {c.skill}</p>}
              {c.link ? (
                <a href={c.link} target="_blank" rel="noopener noreferrer" className="-mb-2 inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-brand-mint transition-colors hover:text-white">
                  {labels.viewCredential} <ArrowUpRight className="h-3 w-3" />
                </a>
              ) : c.credentialId && (
                <p className="mt-0.5 break-all text-[11px] text-slate-500">{labels.credentialId} {c.credentialId}</p>
              )}
            </li>
          ))}
        </ul>
        {hidden > 0 && (
          <button
            type="button"
            onClick={() => setAllCerts((v) => !v)}
            aria-expanded={allCerts}
            className="mt-3 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-brand-mint transition-colors hover:text-white"
          >
            {allCerts ? labels.showLess : hidden === 1 ? labels.showMoreOne : labels.showMore.replace('{n}', String(hidden))}
            <ChevronDown className={`h-4 w-4 transition-transform ${allCerts ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      <div className="mt-auto pt-8">
        <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost w-full">
          <LinkedInIcon className="h-4 w-4 text-sky-400" /> {founder.name}
        </a>
      </div>
    </article>
  );
};

/** `showIntro`: false on /equipe, where the page intro (h1) replaces the section heading. */
export const TeamSection: React.FC<{ team: TeamCopy; showIntro?: boolean }> = ({ team, showIntro = true }) => (
  <section id="equipe" className={`relative py-20 md:py-28 ${showIntro ? 'border-t border-white/5' : ''}`}>
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      {showIntro && (
        <Reveal className="mb-12 max-w-2xl md:mb-16">
          <span className="eyebrow">{team.path}</span>
          <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">{team.title}</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-400 md:text-lg">{team.subtitle}</p>
        </Reveal>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        {(['elias', 'noam'] as const).map((key, i) => (
          <Reveal key={key} delay={i * 90}>
            <FounderCard founderKey={key} profile={team.founders[key]} labels={team.labels} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mb-8 mt-16 md:mt-20">
        <div className="flex items-center gap-4">
          <h3 className="font-display text-lg font-semibold text-white md:text-xl">{team.introducersTitle}</h3>
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <p className="mt-3 max-w-2xl text-sm text-slate-400">{team.introducersSubtitle}</p>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {INTRODUCERS.map((introducer, i) => (
          <Reveal key={introducer.key} delay={i * 90}>
            <article className="card flex h-full items-start gap-4 p-6">
              <img src={introducer.image} alt={introducer.name} loading="lazy" className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-white/15" />
              <div className="min-w-0">
                <h4 className="font-display text-lg font-semibold text-white">{introducer.name}</h4>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-brand-lime">
                  <Users className="h-3.5 w-3.5" />{team.introducerRole}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{team.introducers[introducer.key]}</p>
              </div>
            </article>
          </Reveal>
        ))}
        <Reveal delay={INTRODUCERS.length * 90}>
          <article className="card flex h-full items-start gap-4 border-dashed p-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-mint/10 text-brand-mint ring-1 ring-brand-mint/25">
              <UserPlus className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <h4 className="font-display text-lg font-semibold text-white">{team.introducerJoin.title}</h4>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{team.introducerJoin.desc}</p>
              <a
                href={`mailto:contact@3geeks.fr?subject=${encodeURIComponent(team.introducerJoin.subject)}`}
                className="mt-4 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-brand-mint transition-colors hover:text-white"
              >
                {team.introducerJoin.cta} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </article>
        </Reveal>
      </div>
    </div>
  </section>
);

export default TeamSection;
