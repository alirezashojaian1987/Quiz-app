const data_infos={
    settings:{
        category:"",
        difficulty:"any",
        questions_amount:0,
    },
    questions:[],
    current_q:0,
    score:0,
    answered:false
};

const start_btn=document.getElementById("start_btn");
const next_btn=document.getElementById("next_btn");
const category_options=document.getElementById("categories");
const diff=document.getElementById("diff");
const Qnum=document.getElementById("Qnum");

const q_counter=document.getElementById("q_counter");
const current_score=document.getElementById("current_score");
const q_text=document.getElementById("q_text");
const answers_box=document.getElementById("answers");

const final_score=document.getElementById("final_score");
const your_results=document.getElementById("your_results");
const restart_btn=document.getElementById("restart_btn");

const cat_url="https://opentdb.com/api_category.php";

function display_page(page){
    const containers=document.querySelectorAll(".container");
    const current_page=document.getElementById(page);

    containers.forEach(c_page=>{
        c_page.classList.remove("active");
    });
    
    current_page.classList.add("active");
}

async function get_questions(){
    let url=`https://opentdb.com/api.php?amount=${data_infos.settings.questions_amount}&type=multiple`;
    if(data_infos.settings.difficulty!=="any")
        url+=`&difficulty=${data_infos.settings.difficulty}`;

    if(data_infos.settings.category)
        url+=`&category=${data_infos.settings.category}`;

    const res_url=await fetch(url);
    const data=await res_url.json();
    if(data.results.length===0){
        alert("No questions!");
        display_page("options_settings");
        return;
    }

    const shuffle=(answers)=>{
        return answers.sort(()=>Math.random()-0.5);
    }

    data_infos.questions=data.results.map(q=>({
        question:q.question,
        correct:q.correct_answer,
        answers:shuffle([...q.incorrect_answers,q.correct_answer])
    }));
}

async function get_categories(){
    try{
        const res=await fetch(cat_url);
        const data=await res.json();
        const select=document.getElementById("categories");
        data.trivia_categories.forEach(cat=>{
            const options=document.createElement("option");
            options.value=cat.id;
            options.textContent=cat.name;
            select.appendChild(options);
        });
    }
    catch(error){
        console.log(error);
    }
}

async function init(){
    await get_categories();
}

init();

function choose_answer(btn,answer,correct){
    if(data_infos.answered)
        return;
    data_infos.answered=true;

    if(answer===correct){
        data_infos.score++;
        btn.classList.add("correct");
    }

    else{
        btn.classList.add("wrong");
        [...answers_box.children].forEach(btn=>{
            if(btn.textContent===correct){
                btn.classList.add("correct");
            }
        });
    }

    next_btn.disabled=false;
    save_data();
}

function display_questions(){
    const q=data_infos.questions[data_infos.current_q];
    q_counter.textContent=`${data_infos.current_q+1} of ${data_infos.questions.length}`;
    current_score.textContent=`Your score so far: ${data_infos.score}`;
    q_text.innerHTML=q.question;

    answers_box.innerHTML="";
    data_infos.answered=false;
    next_btn.disabled=true;

    q.answers.forEach(a=>{
        const btn=document.createElement("button");
        btn.textContent=a;
        btn.onclick=()=>choose_answer(btn,a,q.correct);
        answers_box.appendChild(btn);
    });

}

function load_data(){
    const saved_data=localStorage.getItem("quiz_data");
    if(saved_data){
        const data=JSON.parse(saved_data);
        if(data.questions && data.questions.length>0){
            Object.assign(data_infos,data);
            category_options.value=data_infos.settings.category;
            diff.value=data_infos.settings.difficulty || "any";
            Qnum.value=data_infos.settings.questions_amount;

            if(data_infos.current_q<data_infos.questions.length){
                display_page("questions_page");
                display_questions();
            }
            
            else
                show_result();

            return;
        }
    }
    display_page("options_settings");
}

window.addEventListener("load",load_data);

function save_data(){
    localStorage.setItem("quiz_data",JSON.stringify(data_infos));
}

function show_result(){
    display_page("result_page");
    final_score.textContent=`Your scored ${data_infos.score} of ${data_infos.questions.length}`;

    your_results.innerHTML="";
    data_infos.questions.forEach((q,i)=>{
        const li=document.createElement("li");
        li.innerHTML=`<strong>${i+1}.</strong> ${q.question}<br><span style="color:rgb(0, 196, 0)">Correct answer: </span>${q.correct}`;
        your_results.appendChild(li);
    })
}

start_btn.addEventListener("click",async()=>{
    data_infos.settings.category=category_options.value;
    data_infos.settings.difficulty=diff.value;
    data_infos.settings.questions_amount=Qnum.value;
    data_infos.current_q=0;
    data_infos.score=0;

    display_page("loading_page");
    await get_questions();
    save_data();
    
    display_page("questions_page");
    display_questions();
});

next_btn.addEventListener("click",()=>{
    data_infos.current_q++;
    if(data_infos.current_q<data_infos.questions.length)
        display_questions();

    else
        show_result();

    save_data();
})

restart_btn.addEventListener("click",()=>{
    localStorage.removeItem("quiz_data");
    display_page("options_settings");
});