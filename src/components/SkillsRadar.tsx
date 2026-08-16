import React, { useState } from 'react';
import { Award, Cloud, Cpu, ShieldCheck, Sparkles, Code2, Briefcase } from 'lucide-react';
import GradientText from './GradientText';

interface SkillsRadarProps {
  lang: 'en' | 'fr';
}

interface CertBadge {
  title: string;
  issuer: string;
  holder: string;
  year: string;
  badge: string;
  link?: string;
}

export const TEAM_CERTS: CertBadge[] = [
  {
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services (AWS)',
    holder: 'Noam Leclapart-Jublot',
    year: '2025 – 2028',
    badge: 'AWS Certified Cloud',
    link: 'https://www.credly.com'
  },
  {
    title: 'AWS Academy Graduate - Cloud Architecting',
    issuer: 'Amazon Web Services (AWS)',
    holder: 'Noam Leclapart-Jublot',
    year: '2026',
    badge: 'Cloud Architect'
  },
  {
    title: 'AWS Academy Graduate - Machine Learning Foundations',
    issuer: 'Amazon Web Services (AWS)',
    holder: 'Noam Leclapart-Jublot',
    year: '2026',
    badge: 'AWS ML Foundations'
  }
];

export const TEAM_DOMAINS = [
  {
    id: 'cloud-ia',
    titleFr: 'Cloud & IA Générative d\'Entreprise',
    titleEn: 'Enterprise Cloud & GenAI',
    icon: Cloud,
    color: 'cyan',
    lead: 'Noam Leclapart-Jublot',
    leadRole: 'Ingénieur IA chez Thales · Certifié AWS Cloud',
    skills: [
      'AWS CloudFormation', 'Amazon Web Services (AWS)', 'IA Générative (LLM)',
      'Machine Learning Supervisé', 'Docker & Conteneurs', 'Coolify & Traefik',
      'PostgreSQL & Vector DB', 'Infra Cloud NAS & Sécurité'
    ]
  },
  {
    id: 'design-product',
    titleFr: 'Design Produit & Front-End Réactif',
    titleEn: 'Product Design & Reactive Front-End',
    icon: Sparkles,
    color: 'lime',
    lead: 'Elias Elloumi',
    leadRole: 'Lead Product & Architecture Front-End',
    skills: [
      'React 19 & Next.js', 'UI/UX Interactive', 'Tailwind CSS v4',
      'Python & Scripting Data', 'Orchestration d\'Agents IA', 'Motion Design & GSAP',
      'TypeScript', 'Swift iOS (App Store)'
    ]
  },
  {
    id: 'business-ops',
    titleFr: 'Stratégie Business & Relation Client',
    titleEn: 'Business Strategy & Client Relations',
    icon: Briefcase,
    color: 'violet',
    lead: 'Charles Garbus',
    leadRole: 'Tech Entrepreneur · Franco-Britannique Bilingue',
    skills: [
      'Cadrage & Stratégie Produit', 'Relation Client Directe (< 24h)', 'Gestion de Projet Agile',
      'Bilingue Anglais / Français (IGCSE)', 'Résolution de Problèmes Métier', 'GTM (Go-to-Market)',
      'Conformité & Juridique SaaS', 'Accompagnement Sur-Mesure'
    ]
  }
];

export const SkillsRadar: React.FC<SkillsRadarProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<string>('cloud-ia');

  const selectedDomain = TEAM_DOMAINS.find((d) => d.id === activeTab) || TEAM_DOMAINS[0];

  return (
    <section id="skills" className="py-10 md:py-24 relative bg-[#08090d] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 md:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3.5 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-lime-300 mb-3">
            <Cpu className="h-3.5 w-3.5" />
            {lang === 'fr' ? 'Complémentarité Technique 3geeks' : '3geeks Technical Synergy'}
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight">
            <GradientText colors={['#ffffff', '#a3e635', '#22d3ee', '#ffffff']} animationSpeed={7}>
              {lang === 'fr' ? 'Trois pôles d\'expertise pour une exécution parfaite' : 'Three areas of expertise for flawless execution'}
            </GradientText>
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            {lang === 'fr'
              ? 'L\'alliance entre la rigueur Cloud & IA d\'entreprise, le design produit d\'exception et le pilotage business bilingue.'
              : 'The alliance of enterprise Cloud & AI engineering, premium product design, and bilingual business management.'}
          </p>
        </div>

        {/* Certifications Display */}
        <div className="mb-10 md:mb-14">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" />
              {lang === 'fr' ? 'Certifications officielles de l\'équipe :' : 'Official team certifications:'}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {TEAM_CERTS.map((cert, index) => (
              <div
                key={index}
                className="glass-panel p-4 rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/5 via-[#0d1117]/80 to-cyan-500/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[9px] font-mono font-bold text-amber-300 border border-amber-400/30">
                      {cert.badge}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{cert.year}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{cert.title}</h4>
                  <p className="text-xs text-slate-400 font-mono">{cert.issuer}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-cyan-300 font-mono">
                  <span>{cert.holder}</span>
                  <ShieldCheck className="h-3.5 w-3.5 text-lime-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Expertise Domains Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
          {TEAM_DOMAINS.map((domain) => {
            const Icon = domain.icon;
            const isActive = activeTab === domain.id;
            return (
              <button
                key={domain.id}
                onClick={() => setActiveTab(domain.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl font-mono text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-400 to-lime-400 text-slate-950 shadow-lg shadow-cyan-400/20 scale-105'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-cyan-400/30'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-slate-950' : 'text-cyan-300'}`} />
                <span>{lang === 'fr' ? domain.titleFr : domain.titleEn}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Domain Card */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-cyan-400/30 max-w-4xl mx-auto bg-[#0d1117]/90 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-5 mb-6 gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300 font-bold block mb-1">
                {lang === 'fr' ? 'Pôle de compétences' : 'Expertise Pole'}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {lang === 'fr' ? selectedDomain.titleFr : selectedDomain.titleEn}
              </h3>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-right">
              <span className="text-[10px] font-mono text-slate-400 block">{lang === 'fr' ? 'Référent pôle' : 'Lead referent'}</span>
              <span className="text-xs font-bold text-lime-300 font-mono">{selectedDomain.lead}</span>
              <span className="text-[10px] text-slate-400 block font-mono">{selectedDomain.leadRole}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 md:gap-3">
            {selectedDomain.skills.map((skill, sIdx) => (
              <div
                key={sIdx}
                className="rounded-xl border border-white/10 bg-white/5 p-3 text-center transition-all hover:border-cyan-400/40 hover:bg-cyan-400/10"
              >
                <span className="text-xs md:text-sm font-mono font-medium text-slate-200 block">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsRadar;
