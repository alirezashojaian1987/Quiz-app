import clsx from "clsx";
import { Check, X, ArrowRight } from "lucide-react";
import type { Question } from "../types/quiz";

interface Props{
  question:Question;
  currentIndex:number;
  total:number;
  score:number;
  answered:boolean;
  selectedAnswer:string | null;
  onChoose:(answer: string) => void;
  onNext:()=>void;
}

const LETTERS=['A', 'B', 'C', 'D'];

export default function QuizScreen({ question, currentIndex, total, score, answered, selectedAnswer, onChoose, onNext,}:Props){
  const progress=((currentIndex + (answered ? 1 : 0)) / total) * 100;
  const isLast=currentIndex+1===total;

  const answerClass=(answer:string)=>{
    const base="group w-full flex items-center gap-3 text-left px-4 py-3.5 rounded-2xl " +
    "border text-sm sm:text-base font-medium transition-all duration-300";

    if(!answered)
      return clsx(
        base,
        "bg-white/5 border-white/10 text-white cursor-pointer",
        "hover:bg-white/10 hover:border-white/25 hover:translate-x-1",
    );

    if(answer===question.correct)
      return clsx(
        base,
        "bg-correct/20 border-correct/60 text-white shadow-lg shadow-correct/20",
      );

    if(answer===selectedAnswer)
      return clsx(
        base,
        "bg-wrong/20 border-wrong/60 text-white shadow-lg shadow-wrong/20",
      );
    
    return clsx(base,"bg-white/5 border-white/10 text-white/40");
  };

  const letterClass=(answer:string)=>{
    const base="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold transition-all duration-300";

    if(!answered) return clsx(base, "bg-white/10 text-white/70 group-hover:bg-primary/30 group-hover:text-white");
    if(answer===question.correct) return clsx(base, "bg-correct text-white");
    if(answer===selectedAnswer) return clsx(base, "bg-wrong text-white");

    return clsx(base, "bg-white/5 text-white/40");
  };

  return(
    <section className="relative w-full max-w-lg">
      <div
        aria-hidden
        className="absolute -inset-2 rounded-[2.5rem] bg-linear-to-br from-primary/25 via-transparent to-accent/20 blur-3xl opacity-70"
      />

      <div className="relative flex flex-col rounded-4xl border border-white/15 bg-white/5 p-6 sm:p-8 shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/50">
              Question {currentIndex+1} / {total}
            </span>

            <span className="flex items-center gap-1.5 text-xs font-bold text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"/>
              Score {score}
            </span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-linear-to-r from-primary to-accent transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="text-base sm:text-lg font-semibold leading-relaxed mb-6 text-white">
          {question.question}
        </p>

        <div className="flex flex-col gap-2.5 mb-7">
          {question.answers.map((answer, idx)=>{
            const isCorrect=answered && answer===question.correct;
            const isWrong=answered && answer===selectedAnswer && answer!==question.correct;

            return(
              <button
                key={answer}
                onClick={()=>onChoose(answer)}
                disabled={answered}
                className={answerClass(answer)}
              >
                <span className={letterClass(answer)}>
                  {isCorrect ? (
                    <Check className="w-3.5 h-3.5"/>
                  ) : isWrong ? (
                    <X className="w-3.5 h-3.5"/>
                  ) : (
                    LETTERS[idx]
                  )}
                </span>

                <span className="flex-1">{answer}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onNext}
          disabled={!answered}
          className={clsx(
            'group self-center flex items-center justify-center gap-2 w-full sm:w-2/3 py-3.5 rounded-2xl',
            'font-bold text-base text-white transition-all duration-200',
            answered
              ? 'bg-linear-to-r from-primary to-primary-dark shadow-lg shadow-primary/30 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/50 cursor-pointer active:scale-[0.99]'
              : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed',
          )}
        >
          {isLast ? 'See results' : 'Next question'}
          <ArrowRight
            className={clsx(
              'w-4 h-4 transition-transform duration-200',
              answered && 'group-hover:translate-x-1',
            )}
          />
        </button>
      </div>
    </section>
  )
}