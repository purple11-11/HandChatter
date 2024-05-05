import { useEffect, useRef, useState } from "react";
import QuizBox from "./QuizBox";
import { SignRes } from "../../types/interface";
import { useLoaderData } from "react-router-dom";

const signData: SignRes[] = [
    {
        key: 1,
        title: "감상",
        url: "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20160102/238967/MOV000248432_215X161.jpg",
        subDescription:
            "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20160102/238967/MOV000248432_700X466.mp4",
    },
    {
        key: 2,
        title: "감상문",
        url: "https://www.youtube.com/watch?v=3Q3p2MK5nZI",
        subDescription:
            "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20160102/238968/MOV000248434_700X466.mp4",
    },
    {
        key: 3,
        title: "감싸다",
        url: "https://www.youtube.com/watch?v=3Q3p2MK5nZI",
        subDescription:
            "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20200821/733551/MOV000248440_700X466.mp4",
    },
    {
        key: 4,
        title: "팽이",
        url: "https://www.youtube.com/watch?v=3Q3p2MK5nZI",
        subDescription:
            "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20151115/210001/MOV000200000_700X466.mp4",
    },
    {
        key: 5,
        title: "감자",
        url: "https://www.youtube.com/watch?v=3Q3p2MK5nZI",
        subDescription:
            "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191007/625090/MOV000248444_700X466.mp4",
    },
];

function shuffle(array: SignRes[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export default function Quiz() {
    const signData1 = useLoaderData() as SignRes[];
    const [currentQuiz, setCurrentQuiz] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [questions, setQuestions] = useState<SignRes[]>([]);
    const [options, setOptions] = useState<SignRes[][]>([]);
    const [quizFinished, setQuizFinished] = useState<boolean>(false);

    useEffect(() => {
        let shuffledQuestions = shuffle([...(signData || [])]).slice(0, 10);
        /*  let shuffledQuestions = shuffle([...signData]).slice(0, signData.length); */
        setQuestions(shuffledQuestions);
        let optionsForQuestions = shuffledQuestions.map((question) => {
            let titles = shuffle(
                signData
                    .filter((item) => item.title !== question.title)
                    .slice(0, 3)
                    .concat([question])
            );
            return titles;
        });
        setOptions(optionsForQuestions);
    }, []);

    /* const [answered, setAnswered] = useState<boolean[]>(new Array(10).fill(false)); */
    const [answered, setAnswered] = useState<boolean[]>(new Array(signData?.length).fill(false));

    useEffect(() => {
        setAnswered(new Array(signData?.length).fill(false));
    }, []);

    const handleAnswer = (isCorrect: boolean) => {
        if (!answered[currentQuiz]) {
            if (isCorrect) {
                setScore(score + 1);
            }
            setAnswered((prevAnswered) =>
                prevAnswered.map((item, index) => (index === currentQuiz ? true : item))
            );
        }

        /*  if (currentQuiz < 9) { */
        if (currentQuiz < signData.length - 1) {
            setCurrentQuiz(currentQuiz + 1);
        } else {
            alert("퀴즈가 끝났습니다.");
            setQuizFinished(true);
        }
    };

    const handlePrev = () => {
        if (currentQuiz === 0) return alert("첫 번째 문제입니다.");
        if (currentQuiz > 0) {
            setCurrentQuiz(currentQuiz - 1);
        }
    };

    const handleNext = () => {
        if (currentQuiz === signData.length - 1) return alert("마지막 문제입니다.");
        if (currentQuiz < signData.length - 1) {
            setCurrentQuiz(currentQuiz + 1);
        }
    };

    const handleReset = () => {
        setCurrentQuiz(0);
        setScore(0);
        setQuizFinished(false);
    };

    return (
        <section>
            <h1>Quiz</h1>

            {!quizFinished ? (
                <div className="quiz">
                    <QuizBox
                        question={questions[currentQuiz]}
                        options={options[currentQuiz]}
                        onAnswer={handleAnswer}
                    />
                    <div className="menu_btn">
                        <button onClick={handlePrev}>이전</button>
                        <button onClick={handleNext}>다음</button>
                    </div>
                </div>
            ) : (
                <div className="answer">
                    <h2>맞춘 문제</h2>
                    <p>{score}개</p>
                    <button onClick={handleReset}> 다시 하기 </button>
                </div>
            )}
        </section>
    );
}
