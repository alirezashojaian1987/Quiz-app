import type { QuizState } from "../types/quiz";

const STORAGE_KEY='quiz_data';

export function loadQuizState(): QuizState | null{
    try{
        const raw=localStorage.getItem(STORAGE_KEY);
        if(!raw) return null;

        const parsed=JSON.parse(raw);
        if(typeof parsed !== 'object' || !parsed.settings || !Array.isArray(parsed.questions)){
            return null;
        }

        return parsed as QuizState;
    } catch {
        return null;
    }
}

export function saveQuizState(state:QuizState):void{
    try{
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        console.log("Error saving data");
    }
}

export function clearQuizState():void{
    localStorage.removeItem(STORAGE_KEY);
}