import { ArrowUpRight, CheckCircle } from '@phosphor-icons/react';
import Reveal from '../motion/Reveal';
import divorceImg from '../../assets/images/divorce.png';
import callKitchenImg from '../../assets/images/CallKitchen.jpeg';
import type { Translations } from '../../i18n/translations';

interface ProjectsProps {
  t: Translations;
}

const TWO_ICON =
  'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/8a/87/0f/8a870f74-5c66-359c-2901-e2fd674575f7/Placeholder.mill/400x400bb-75.webp';

export default function Projects({ t }: ProjectsProps) {
  const featured = t.projects.p2;
  const secondary = [
    { data: t.projects.p1, img: divorceImg, contain: true },
    { data: t.projects.p3, img: TWO_ICON, contain: false },
  ];

  return (
    <section id="projets" className="relative z-10 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 max-w-2xl md:mb-14">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-4xl">
            {t.projects.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-400 md:text-lg">
            {t.projects.subtitle}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-7" delay={0.05}>
            <article className="double-bezel h-full">
              <div className="double-bezel-inner flex h-full flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-brand-raised">
                  <img
                    src={callKitchenImg}
                    alt={featured.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan-200 backdrop-blur-sm">
                    {featured.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-7">
                  <h3 className="text-xl font-bold text-white md:text-2xl">{featured.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400 md:text-base">
                    {featured.desc}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {[featured.result1, featured.result2, featured.result3].map((r) => (
                      <li key={r} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-lime-300" weight="fill" />
                        {r}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={featured.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-6 w-full sm:w-fit"
                  >
                    {featured.btn}
                    <ArrowUpRight className="h-4 w-4" weight="bold" />
                  </a>
                </div>
              </div>
            </article>
          </Reveal>

          <div className="flex flex-col gap-5 lg:col-span-5">
            {secondary.map(({ data, img, contain }, i) => (
              <Reveal key={data.title} delay={0.1 + i * 0.06} className="flex-1">
                <article className="surface-card flex h-full flex-col p-5 md:p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 p-1.5">
                      <img
                        src={img}
                        alt=""
                        className={`h-full w-full rounded-lg ${contain ? 'object-contain' : 'object-cover'}`}
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                        {data.tag}
                      </p>
                      <h3 className="text-lg font-bold text-white">{data.title}</h3>
                    </div>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-slate-400">{data.desc}</p>
                  <a
                    href={data.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200"
                  >
                    {data.btn}
                    <ArrowUpRight className="h-4 w-4" weight="bold" />
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
