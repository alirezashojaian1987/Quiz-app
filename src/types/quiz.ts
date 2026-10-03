export type Difficulty='any' | 'easy' | 'medium' | 'hard';

export type Screen='start' | 'loading' | 'quiz' | 'result' | 'error';

export interface Category{
    id:number;
    name:string;
}

export interface Settings{
    category:string;
    difficulty:Difficulty;
    questions_amount:number;
}

export interface Question{
    question:string;
    correct:string;
    answers:string[];
}

export interface QuizState{
    screen:Screen;
    settings:Settings;
    questions:Question[];
    current_q:number;
    score:number;
    answered:boolean;
    selectedAnswer:string | null;
    error:string | null;
}

export const DEFAULT_SETTINGS:Settings={
    category:'',
    difficulty:'any',
    questions_amount:10,
};