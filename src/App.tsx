import clsx from 'clsx';
import logo from './assets/tym_logo.webp';
import { useQuiz } from "./hooks/useQuiz";
import StartScreen from "./components/StartScreen";
import LoadingScreen from "./components/LoadingScreen";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import ErrorScreen from "./components/ErrorScreen";

export default function App(){
    const quiz=useQuiz();
    const isHero=quiz.screen==='start' || quiz.screen==="error";

    return(
        <div className="relative min-h-screen flex flex-col items-center px-4 py-8 sm:py-12 overflow-hidden">
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute top-[-15%] left-[-10%] w-2xl h-2xl rounded-full bg-primary/25 blur-[130px]"/>
                <div className="absolute bottom-[-20%] right-[-10%] w-152 h-152 rounded-full bg-accent/15 blur-[130px]"/>
            </div>

            <header className={clsx(
                "items-center gap-4 sm:gap-6 transition-all duration-300",
                isHero
                    ? "flex flex-col sm:flex-row text-center sm:text-left mb-10"
                    : "flex flex-row mb-8",
                )}
            >
                <div className="relative shrink-0">
                    <div
                        className={clsx(
                            "absolute inset-0 rounded-3xl bg-primary/40 blur-2xl transition-opacity duration-300",
                            isHero ? "opacity-100" : "opacity-60",
                        )}
                    />

                    <div className="relative p-3 rounded-3xl bg-white/5 border border-white/15 backdrop-blur-xl">
                        <img
                            src={logo}
                            alt="Test your mind logo"
                            className={clsx(
                                "object-contain transition-all duration-300",
                                isHero ? "w-20 h-20 sm:w-24 sm:h-24" : "w-12 h-12",
                            )}
                        />
                    </div>
                </div>

                <div>
                    <h1 className={clsx(
                        "font-extrabold leading-tight tracking-tight transition-all duration-300",
                        isHero ? 'text-3xl sm:text-4xl md:text-5xl' : "text-lg sm:text-xl",
                    )}>
                        {isHero ? "Welcome to " : ""}
                        <span className="bg-linear-to-b from-[#7FDBFF] via-primary to-accent bg-clip-text text-transparent">
                            Test Your Mind
                        </span>
                        {isHero ? "" : " quiz"}
                    </h1>

                    {isHero && (
                        <p className="text-white/70 mt-3 text-sm sm:text-base max-w-lg">
                            Challenge your knowledge with questions from your favorite categories.
                        </p>
                    )}
                </div>
            </header>


            <main className="w-full flex justify-center">
                {quiz.screen==='start' && (
                    <StartScreen
                        categories={quiz.categories}
                        settings={quiz.settings}
                        onStart={quiz.startQuiz}
                    />
                )}

                {quiz.screen==='loading' && <LoadingScreen/>}

                {quiz.screen==='quiz' && quiz.currentQuestion && (
                    <QuizScreen
                        question={quiz.currentQuestion}
                        currentIndex={quiz.current_q}
                        total={quiz.questions.length}
                        score={quiz.score}
                        answered={quiz.answered}
                        selectedAnswer={quiz.selectedAnswer}
                        onChoose={quiz.chooseAnswer}
                        onNext={quiz.nextQuestion}
                    />
                )}

                {quiz.screen==='result' && (
                    <ResultScreen
                        score={quiz.score}
                        total={quiz.questions.length}
                        questions={quiz.questions}
                        onRestart={quiz.restart}
                    />
                )}

                {quiz.screen==='error' && (
                    <ErrorScreen
                        message={quiz.error ?? 'Something went wrong'}
                        onBack={quiz.goToStart}
                    />
                )}
            </main>
        </div>
    );
}