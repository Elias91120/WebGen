import React from 'react';
import { Award, Briefcase, Cloud, Sparkles } from 'lucide-react';
import Reveal from './Reveal';
import SectionLines from './SectionLines';

interface SkillsRadarProps {
  lang: 'en' | 'fr';
}

const DOMAINS = [
  {
    id: 'design-product',
    icon: Sparkles,
    titleFr: 'Design produit',
    titleEn: 'Product design',
    descFr: 'Front-end réactif, pages créées dès le premier écran pour convaincre.',
    descEn: 'Responsive front-end, pages crafted from the first screen to convince.',
    skills: ['React & Next.js', 'UI/UX interactive', 'Tailwind CSS', 'TypeScript', 'Motion design', 'Swift iOS', 'Orchestration d’agents IA', 'Python & data'],
  },
  {
    id: 'cloud-ia',
    icon: Cloud,
    titleFr: 'Cloud & IA générative',
    titleEn: 'Cloud & generative AI',
    descFr: 'Infra cloud sécurisée et automatisations IA pour les entreprises.',
    descEn: 'Secure cloud infrastructure and AI automation for businesses.',
    skills: ['Amazon Web Services', 'CloudFormation', 'IA générative (LLM)', 'Machine learning', 'Docker', 'Coolify & Traefik', 'PostgreSQL & vector DB', 'Sécurité & réseau'],
  },
  {
    id: 'business-ops',
    icon: Briefcase,
    titleFr: 'Stratégie business',
    titleEn: 'Business strategy',
    descFr: 'Contact direct, décisions claires, sans jargon.',
    descEn: 'Direct contact, clear decisions, no jargon.',
    skills: ['Cadrage produit', 'Réponse sous 24h', 'Gestion de projet agile', 'Bilingue FR / EN', 'Go-to-market', 'Conformité SaaS', 'Accompagnement sur mesure', 'Résolution de problèmes métier'],
  },
];

const CERTS = [
  'AWS Certified Cloud Practitioner',
  'AWS Academy · Cloud Architecting',
  'AWS Academy · Machine Learning Foundations',
];

export const SkillsRadar: React.FC<SkillsRadarProps> = ({ lang }) => {
  const fr = lang === 'fr';

  return (
    <section id="skills" className="relative overflow-hidden py-20 md:py-28">
      <SectionLines variant="b" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-12 max-w-2xl md:mb-16">
          <span className="eyebrow">{fr ? 'Expertise' : 'Expertise'}</span>
          <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">
            {fr ? 'Trois pôles d’expertise, une exécution sans faille.' : 'Three areas of expertise, flawless execution.'}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-400 md:text-lg">
            {fr
              ? 'Design produit, ingénierie cloud & IA certifiée AWS, et pilotage business : tout ce qu’il faut pour livrer un produit qui tient ses promesses.'
              : 'Product design, AWS-certified cloud & AI engineering, and business management: everything needed to ship a product that keeps its promises.'}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {DOMAINS.map((domain, i) => {
            const Icon = domain.icon;
            return (
              <Reveal key={domain.id} delay={i * 90}>
                <div className="card h-full p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-mint/10 text-brand-mint ring-1 ring-brand-mint/25">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold text-white">
                    {fr ? domain.titleFr : domain.titleEn}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{fr ? domain.descFr : domain.descEn}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {domain.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-8">
          <div className="card flex flex-col gap-4 p-5 md:flex-row md:items-center md:gap-8 md:px-7">
            <div className="flex shrink-0 items-center gap-3 text-sm font-semibold text-white">
              <Award className="h-5 w-5 text-brand-lime" />
              {fr ? 'Certifications' : 'Certifications'}
            </div>
            <div className="flex flex-wrap gap-2">
              {CERTS.map((cert) => (
                <span
                  key={cert}
                  className="rounded-full border border-brand-lime/25 bg-brand-lime/[0.06] px-3.5 py-1.5 text-xs font-medium text-brand-lime"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default SkillsRadar;
