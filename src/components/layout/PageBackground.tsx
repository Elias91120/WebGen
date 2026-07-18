/**
 * Quiet ambient stage: charcoal base, soft cyan blooms, fine grid, film grain.
 */
export default function PageBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#10151f_0%,#08090d_48%,#06070a_100%)]" />

      <div className="absolute -top-32 left-1/2 h-[32rem] w-[48rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.12)_0%,transparent_68%)] blur-2xl" />
      <div className="absolute top-[32%] -left-24 h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.06)_0%,transparent_70%)] blur-3xl" />
      <div className="absolute top-[45%] -right-16 h-[18rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(163,230,53,0.04)_0%,transparent_70%)] blur-3xl" />
      <div className="absolute bottom-[-8%] left-1/3 h-[16rem] w-[32rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] blur-3xl" />

      <div className="bg-grid-fade absolute inset-0 opacity-90" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(34,211,238,0.22)] to-transparent" />

      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
