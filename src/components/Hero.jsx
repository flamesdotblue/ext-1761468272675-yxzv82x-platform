import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative h-[60vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/8nsoLg1te84JZcE9/scene.splinecode" style={{ width: '100%', height: '100%' }} className="pointer-events-none" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/40 to-white pointer-events-none" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 backdrop-blur">
            Modern, minimalist, fintech-inspired dashboard
          </div>
          <h1 className="mt-4 text-3xl sm:text-5xl font-bold leading-tight text-slate-900">
            Track what you buy. Track what you sell. Know what makes you money.
          </h1>
          <p className="mt-3 text-slate-600 sm:text-lg">
            A simple inventory and cashflow tracker for local shopkeepers.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#transactions" className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800">Record transaction</a>
            <a href="#inventory" className="rounded-lg bg-white text-slate-900 px-4 py-2 text-sm ring-1 ring-slate-200 hover:bg-slate-50">View inventory</a>
          </div>
        </div>
      </div>
    </section>
  );
}
