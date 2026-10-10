import { Check, RotateCcw, Trophy, Target } from "lucide-react";
import type { Question } from "../types/quiz";

interface Props{
  score:number;
  total:number;
  questions:Question[];
  onRestart:()=>void;
}

export default function ResultScreen({ score, total, questions, onRestart }: Props){
  const percentage=total > 0 ? Math.round((score/ total) * 100) : 0;

  const size=160;
  const stroke=12;
  const radius=(size - stroke) / 2;
  const circumference=2 * Math.PI * radius;
  const dashOffset=circumference * (1 - percentage / 100);

  const verdict =
    percentage >= 80 ? 'Amazing!' :
    percentage >= 60 ? 'Well done!' :
    percentage >= 40 ? 'Not bad!' :
    'Keep practicing!';

  return(
    <section className="relative w-full max-w-lg">
      <div
        aria-hidden
        className="absolute -inset-2 rounded-[2.5rem] bg-linear-to-br from-primary/25 via-transparent to-accent/20 blur-3xl opacity-70"
      />

      <div className="relative flex flex-col rounded-4xl border border-white/15 bg-white/5 p-6 sm:p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={stroke}
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="url(#ringGradient)"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
              <defs>
                <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00aeff" />
                  <stop offset="100%" stopColor="#ff9f1c" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold tracking-tight">{percentage}%</span>
              <span className="text-xs font-medium text-white/60 mt-0.5">
                {score} of {total}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Trophy className="w-4 h-4 text-accent" />
            <p className="text-lg font-extrabold">{verdict}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
              Review answers
            </span>
          </div>

          <ul className="max-h-56 overflow-y-auto pr-1 space-y-2 text-sm">
            {questions.map((q, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-lg bg-primary/20 text-primary text-[11px] font-bold mt-0.5">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-snug text-white/90 mb-1.5">
                    {q.question}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-white/70">
                    <Check className="w-3 h-3 text-correct shrink-0" />
                    <span className="text-correct font-semibold">Correct:</span>
                    <span className="truncate">{q.correct}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Restart */}
        <button
          onClick={onRestart}
          className="group flex items-center justify-center gap-2 w-full sm:w-2/3 self-center py-3.5 rounded-2xl bg-linear-to-r from-primary to-primary-dark font-bold text-base text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/50 active:scale-[0.99] cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-180" />
          Play again
        </button>
      </div>
    </section>
  );
}