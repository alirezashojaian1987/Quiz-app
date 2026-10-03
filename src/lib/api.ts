import type {Category, Question, Settings } from "../types/quiz";

const BASE_URL="https://opentdb.com";

interface ApiQuestion{
    question:string;
    correct_answer:string;
    incorrect_answers:string[];
}

interface ApiCategory{
    id:number;
    name:string;
}

function decodeHtml(html:string): string{
    const doc=new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent ?? html;
}

function shuffle<T>(arr:T[]):T[]{
    const result=[...arr];
    for(let i=result.length-1; i>0; i--){
        const j=Math.floor(Math.random()*(i+1));
        [result[i], result[j]]=[result[j], result[i]];
    }

    return result;
}

export async function fetchCategories(signal?: AbortSignal):Promise<Category[]>{
    const res=await fetch(`${BASE_URL}/api_category.php`, {signal});
    if(!res.ok) throw new Error(`Failed to fetch categories (${res.status})`);

    const data: { trivia_categories: ApiCategory[] }=await res.json();
    return data.trivia_categories.map(( { id, name } ) => ({ id, name}));
}

export async function fetchQuestions(
    settings:Settings,
    signal?:AbortSignal,
): Promise<Question[]>{
    const params=new URLSearchParams({
        amount:String(settings.questions_amount),
        type:'multiple',
    });

    if(settings.difficulty!=='any') params.set('difficulty', settings.difficulty);

    if(settings.category) params.set('category', settings.category);

    const res=await fetch(`${BASE_URL}/api.php?${params.toString()}`, { signal });
    if(!res.ok) throw new Error(`Failed to fetch questions (${res.status})`);

    const data: { response_code: number; results:ApiQuestion[] }=await res.json();

    if(data.response_code !== 0 || !data.results?.length) return[];

    return data.results.map((q)=>{
        const correct=decodeHtml(q.correct_answer);
        const incorrect=q.incorrect_answers.map(decodeHtml);
        return{
            question:decodeHtml(q.question),
            correct,
            answers:shuffle([...incorrect, correct]),
        }
    })
}