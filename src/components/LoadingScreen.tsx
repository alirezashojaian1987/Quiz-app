export default function LoadingScreen() {
  return (
    <section className="relative w-full max-w-lg">
      <div
        aria-hidden
        className="absolute -inset-2 rounded-[2.5rem] bg-linear-to-br from-primary/25 via-transparent to-accent/20 blur-3xl opacity-70"
      />

      <div className="relative flex flex-col items-center justify-center gap-8 rounded-4xl border border-white/15 bg-white/5 p-12 sm:p-16 shadow-2xl shadow-black/40 backdrop-blur-2xl">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />

          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary/40 animate-spin"
            style={{ animationDuration: '1.2s' }}
          />

          <div
            className="absolute inset-3 rounded-full border-2 border-transparent border-b-accent/80 animate-spin"
            style={{ animationDuration: '1.8s', animationDirection: 'reverse' }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_20px_4px] shadow-primary/60 animate-pulse" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm font-medium text-white/80">
          <span>Loading questions</span>
          <span className="flex gap-0.5">
            <span className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-1 rounded-full bg-primary animate-bounce" />
          </span>
        </div>
      </div>
    </section>
  );
}