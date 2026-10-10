import { useState, type FormEvent } from "react";
import clsx from "clsx";
import { Sparkles, Swords, Hash, ArrowRight } from "lucide-react";
import type {Category, Difficulty, Settings} from "../types/quiz";

import Dropdown from "./Dropdown";

interface Props{
  categories:Category[];
  settings:Settings;
  onStart:(settings:Settings)=>void;
}

const DIFFICULTIES:{
  value:Difficulty;
  label:string;
  dot:string;
  active:string;
}[]=[
  {
    value:'any',
    label:'Any',
    dot:'bg-primary',
    active:'border-primary/60 bg-primary/25 shadow-lg shadow-primary/25',
  },

  {
    value: 'easy',
    label: 'Easy',
    dot: 'bg-emerald-400',
    active: 'border-emerald-400/60 bg-emerald-500/25 shadow-lg shadow-emerald-500/25',
  },

  {
    value: 'medium',
    label: 'Medium',
    dot: 'bg-amber-400',
    active: 'border-amber-400/60 bg-amber-500/25 shadow-lg shadow-amber-500/25',
  },

  {
    value: 'hard',
    label: 'Hard',
    dot: 'bg-rose-400',
    active: 'border-rose-400/60 bg-rose-500/25 shadow-lg shadow-rose-500/25',
  },
]

const inputClass=
'w-full px-4 py-2.5 rounded-pill bg-btn/60 text-white placeholder-white/50 ' +
'border border-white/15 outline-none transition ' +
'focus:border-primary focus:ring-2 focus:ring-primary/40';

const labelClass='flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white/60 mb-2';

export default function StartScreen({ categories, settings, onStart }:Props){
  const [form, setForm]=useState<Settings>(settings);

  const handleSubmit=(e:FormEvent)=>{
    e.preventDefault();
    onStart(form);
  };

  const categoryOptions=[
    { value:'', label:"Any category"},
    ...categories.map((cat)=>({value:String(cat.id), label:cat.name})),
  ];

  return(
    <section className="relative w-full max-w-lg">
      <div
        aria-hidden
        className="absolute -inset-2 rounded-[2.5rem] bg-linear-to-br from-primary/25 via-transparent to-accent/20 blur-3xl opacity-70"
      />
      <form onSubmit={handleSubmit} className="relative flex flex-col gap-7 rounded-4xl border border-white/15 bg-white/5 p-6 sm:p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl">
        <p className="text-[12px] font-bold tracking-[0.25em] text-primary/90 mb-1">
          Quiz Setup
        </p>

        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          Pick your challenge
        </h2>

        <div>
          <label className={labelClass}>
            <Sparkles className="w-3.5 h-3.5 text-primary"/>
            Category
          </label>
          <Dropdown
            value={form.category}
            options={categoryOptions}
            onChange={(v)=>setForm({ ...form, category:v })}
            placeholder="Any category"
            />
        </div>

        <div>
          <label className={labelClass}>
            <Swords className="w-3.5 h-3.5 text-primary"/>
            Difficulty
          </label>

          <div className="grid grid-cols-4 gap-1.5 rounded-2xl border border-white/10 bg-white/5 p-1.5">
            {DIFFICULTIES.map((diff)=>{
              const active=form.difficulty===diff.value;
              return(
                <button
                  key={diff.value}
                  type="button"
                  onClick={()=>setForm({ ...form, difficulty:diff.value })}
                  className={clsx(
                    "flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl",
                    "text-xs font-semibold border transition-all duration-200 cursor-pointer",
                    active ? diff.active + "text-white" : "border-transparent text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  <span
                    className={clsx(
                      "w-1.5 h-1.5 rounded-full transition-opacity duration-200",
                      diff.dot,
                      active ? "opacity-100" : "opacity-40",
                    )}
                  />
                    {diff.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between mb-2">
            <label className={labelClass + ' mb-0'}>
              <Hash className="w-3.5 h-3.5 text-primary" />
              Questions
            </label>

            <span className="text-xl font-extrabold tabular-nums leading-none bg-linear-to-br from-white to-white/50 bg-clip-text text-transparent">
              {form.questions_amount}
            </span>
          </div>

          <input
            type="range"
            min={1}
            max={50}
            value={form.questions_amount}
            onChange={(e)=>setForm({ ...form, questions_amount: Number(e.target.value) })}
            className={clsx(
              'w-full h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer',
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
              '[&::-webkit-slider-thumb]:rounded-full',
              '[&::-webkit-slider-thumb]:bg-primary',
              '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white',
              '[&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary/50',
              '[&::-webkit-slider-thumb]:transition-transform',
              'hover:[&::-webkit-slider-thumb]:scale-110',
              '[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5',
              '[&::-moz-range-thumb]:rounded-full',
              '[&::-moz-range-thumb]:bg-primary',
              '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white',
              '[&::-moz-range-thumb]:cursor-grab',
            )}
          />

          <div className="flex justify-between text-[10px] font-medium text-white/40 mt-1.5">
            <span>1</span>
            <span>50</span>
          </div>
        </div>

        <button
          type="submit"
          className={clsx(
            'group relative flex w-full items-center justify-center gap-2',
            'rounded-2xl py-3.5 text-base font-bold text-white cursor-pointer',
            'bg-linear-to-r from-primary to-primary-dark',
            'shadow-lg shadow-primary/30',
            'transition-all duration-200',
            'hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/50',
            'active:scale-[0.99]',
          )}
        >
          Start Quiz
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </form>
    </section>
  )
}