import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ChevronDown, Check } from "lucide-react";

export interface DropdownOption{
    value:string;
    label:string;
}

interface Props{
    value:string;
    options:DropdownOption[];
    onChange:(value:string)=>void;
    placeholder?:string;
}

export default function Dropdown({ value, options, onChange, placeholder='Select' }:Props){
    const [open, setOpen]=useState(false);
    const ref=useRef<HTMLDivElement>(null);

    useEffect(()=>{
        if(!open) return;

        const onDoc=(e:MouseEvent)=>{
            if(ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };

        const onEsc=(e:KeyboardEvent)=>{
            if(e.key==='Escape') setOpen(false);
        };

        document.addEventListener('mousedown', onDoc);
        document.addEventListener('keydown', onEsc);
        return () => {
            document.removeEventListener('mousedown', onDoc);
            document.removeEventListener('keydown', onEsc);
        };
    },[open]);

    const selected=options.find((o)=>o.value===value)

    return(
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={()=>setOpen((o)=>!o)}
                className={clsx(
                    "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl cursor-pointer",
                    "bg-white/5 border text-left text-sm font-medium text-white",
                    "transition-all duration-200",
                    open ? "border-primary/60 ring-2 ring-primary/30 bg-white/10" : "border-white/10 hover:border-white/25 hover:bg-white/8"
                )}
            >
                <span className={clsx("truncate", !selected && "text-white/50")}>
                    {selected?.label ?? placeholder}
                </span>
                <ChevronDown
                    className={clsx(
                        "w-4 h-4 shrink-0 transition-transform duration-300",
                        open ? "rotate-180 text-primary" : "text-white/60",
                    )}
                />
            </button>

            <div
                className={clsx(
                "absolute left-0 right-0 top-full mt-2 z-30 max-h-64 overflow-y-auto",
                "rounded-2xl border border-white/15 bg-btn/95 backdrop-blur-2xl",
                "shadow-2xl shadow-black/50",
                "origin-top transition-all duration-200 ease-out",
                open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none",
                )}
            >
                <ul className="p-1.5">
                    {options.map((opt)=>{
                        const isSelected=opt.value===value;
                        return(
                            <li key={opt.value}>
                                <button
                                    type="button"
                                    onClick={()=>{
                                        onChange(opt.value);
                                        setOpen(false);
                                    }}
                                    className={clsx(
                                        "w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl",
                                        "text-sm text-left transition-colors duration-150 cursor-pointer",
                                        isSelected ? "bg-primary/20 text-white font-semibold" : "text-white/80 hover:bg-white/10 hover:text-white",
                                    )}
                                >
                                    <span className="truncate">{opt.label}</span>
                                    {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}