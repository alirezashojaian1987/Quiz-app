import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchCategories, fetchQuestions } from '../lib/api';
import { clearQuizState, loadQuizState, saveQuizState } from '../lib/storage';

import { DEFAULT_SETTINGS, type Category, type QuizState, type Settings, } from '../types/quiz';

const INITIAL_STATE: QuizState={
    screen: 'start',
    settings: DEFAULT_SETTINGS,
    questions:[],
    current_q: 0,
    score: 0,
    answered: false,
    selectedAnswer: null,
    error: null,
};

function rehydrate(): QuizState{
    const saved = loadQuizState();

    if(!saved || saved.questions.length === 0) return INITIAL_STATE;

    if(saved.screen === 'quiz' && saved.current_q >= saved.questions.length){
        return { ...saved, screen: 'result' };
    }

    if(saved.screen === 'loading' || saved.screen === 'error'){
        return { ...saved, screen: 'start', error: null };
    }

    return saved;
}

export function useQuiz(){
    const [state, setState]=useState<QuizState>(rehydrate);
    const [categories, setCategories]=useState<Category[]>([]);
    const abortRef=useRef<AbortController | null>(null);

    useEffect(()=>{
        const ctrl=new AbortController();
        fetchCategories(ctrl.signal)
        .then(setCategories)
        .catch((err: unknown)=>{
            if((err as Error).name !== 'AbortError'){
                console.error('Failed to load categories:', err);
            }
        });

        return () => ctrl.abort();
    }, []);

    useEffect(()=>{
        if (state.screen === 'loading' || state.screen === 'error') return;
        saveQuizState(state);
    }, [state]);

    const startQuiz=useCallback(async (settings: Settings)=>{
        abortRef.current?.abort();
        const ctrl=new AbortController();
        abortRef.current=ctrl;

        setState((prev)=>({ ...prev, screen: 'loading', settings, error: null }));

        try{
            const questions = await fetchQuestions(settings, ctrl.signal);

            if(questions.length === 0){
                setState((prev)=>({
                    ...prev,
                    screen: 'error',
                    error: 'No questions match those filters. Try different settings.',
                }));

                return;
            }

            setState((prev)=>({
                ...prev,
                screen: 'quiz',
                questions,
                current_q: 0,
                score: 0,
                answered: false,
                selectedAnswer: null,
                error: null,
            }));
            
            } catch (err) {
                if((err as Error).name === 'AbortError') return;
                setState((prev)=>({
                    ...prev,
                    screen: 'error',
                    error: 'Could not load questions. Check your connection and try again.',
                })
            );
        }
    }, []);

    const chooseAnswer=useCallback((answer: string)=>{
            setState((prev)=>{
                if(prev.answered) return prev;
                const q=prev.questions[prev.current_q];
                if(!q) return prev;

                const isCorrect=answer===q.correct;
                return{
                    ...prev,
                    answered: true,
                    selectedAnswer: answer,
                    score: isCorrect ? prev.score + 1 : prev.score,
                };
            });
    }, []);

    const nextQuestion=useCallback(()=>{
        setState((prev)=>{
            const next=prev.current_q + 1;

            if(next>=prev.questions.length){
                return{ ...prev, screen: 'result' };
            }

            return{ ...prev, current_q: next, answered: false, selectedAnswer: null };
            });
    }, []);

    const restart=useCallback(()=>{
            abortRef.current?.abort();
            clearQuizState();
            setState((prev) => ({ ...INITIAL_STATE, settings: prev.settings }));
    }, []);

    const goToStart=useCallback(()=>{
        setState((prev) => ({ ...prev, screen: 'start', error: null }));
    }, []);

    const currentQuestion=state.questions[state.current_q] ?? null;

    return{
        ...state,
        categories,
        currentQuestion,
        startQuiz,
        chooseAnswer,
        nextQuestion,
        restart,
        goToStart,
    };
}