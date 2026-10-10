interface Props {
  message: string;
  onBack: () => void;
}

export default function ErrorScreen({ message, onBack }: Props) {
  return (
    <section className="w-full max-w-md bg-primary/20 backdrop-blur-xl border border-panel-border rounded-panel p-8 shadow-panel text-center">
      <h2 className="text-2xl font-extrabold mb-3">Something went wrong</h2>
      <p className="text-white/85 mb-6">{message}</p>
      <button
        onClick={onBack}
        className="w-full sm:w-2/3 py-3 rounded-pill bg-btn hover:bg-btn-hover font-bold transition-all duration-200 hover:scale-[1.02] shadow-btn cursor-pointer"
      >
        Back to settings
      </button>
    </section>
  );
}