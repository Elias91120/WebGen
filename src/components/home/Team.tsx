import Reveal from '../motion/Reveal';
import eliasImg from '../../assets/images/Elias.jpeg';
import noamImg from '../../assets/images/Noam.jpeg';
import charlesImg from '../../assets/images/Charles.jpeg';
import type { Translations } from '../../i18n/translations';

interface TeamProps {
  t: Translations;
}

const members = [
  {
    name: 'Elias Eloumi',
    roleKey: 'elias' as const,
    descKey: 'eliasDesc' as const,
    img: eliasImg,
    linkedin: 'https://www.linkedin.com/in/elias-eloumi/',
  },
  {
    name: 'Noam Leclappart',
    roleKey: 'noam' as const,
    descKey: 'noamDesc' as const,
    img: noamImg,
    linkedin: 'https://www.linkedin.com/in/noam-leclapart-jublot/',
  },
  {
    name: 'Charles Garbus',
    roleKey: 'charles' as const,
    descKey: 'charlesDesc' as const,
    img: charlesImg,
    linkedin: 'https://www.linkedin.com/in/charlesgarbus/',
  },
];

export default function Team({ t }: TeamProps) {
  return (
    <section id="equipe" className="relative z-10 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 max-w-2xl md:mb-14">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-4xl">
            {t.team.title}
          </h2>
          <p className="mt-3 text-base text-slate-400 md:text-lg">{t.team.subtitle}</p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {members.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.05}>
              <article className="surface-card flex h-full flex-col items-center p-6 text-center md:p-7">
                <div className="mb-5 h-24 w-24 overflow-hidden rounded-full border border-cyan-400/30 p-0.5 md:h-28 md:w-28">
                  <img
                    src={m.img}
                    alt={m.name}
                    className="h-full w-full rounded-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-lg font-bold text-white">{m.name}</h3>
                <p className="mt-1 text-xs font-medium text-cyan-300">{t.team.roles[m.roleKey]}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                  {t.team.roles[m.descKey]}
                </p>
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-cyan-400/30 hover:text-cyan-200"
                >
                  LinkedIn
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
