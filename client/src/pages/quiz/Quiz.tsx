import { useEffect, useState } from "react";
import QuizBox from "./QuizBox";
import { SignRes } from "../../types/interface";
import { useNavigate } from "react-router-dom";
import styles from "./quiz.module.scss";
import { useInfoStore } from "../../store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useSignStore } from "../../store/signStore";
import Spinner from "../../components/spinner/Spinner";

const defaultData: SignRes[] = [
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
    const userInfo = useInfoStore((state) => state.userInfo);
    const fetchData = useSignStore((state) => state.fetchData);
    const data = useSignStore((state) => state.data);
    const loading = useSignStore((state) => state.loading);

    const navigation = useNavigate();

    const [currentQuiz, setCurrentQuiz] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [questions, setQuestions] = useState<SignRes[]>([]);
    const [options, setOptions] = useState<SignRes[][]>([]);
    const [quizFinished, setQuizFinished] = useState<boolean>(false);
    const [answered, setAnswered] = useState<boolean[]>(new Array(10).fill(false));

    useEffect(() => {
        if (!userInfo) {
            alert("로그인이 필요합니다.");
            return navigation("/login");
        }

        if (!data) fetchData();

        let shuffledQuestions = shuffle(data || []).slice(0, 10);
        setQuestions(shuffledQuestions);
        let optionsForQuestions = shuffledQuestions.map((question) => {
            let titles = shuffle(
                data
                    ? data
                          .filter((item) => item.title !== question.title)
                          .slice(0, 3)
                          .concat([question])
                    : defaultData
                          .filter((item) => item.title !== question.title)
                          .slice(0, 3)
                          .concat([question])
            );
            return titles;
        });
        setOptions(optionsForQuestions);
    }, []);

    const handleAnswer = (isCorrect: boolean) => {
        if (!answered[currentQuiz]) {
            if (isCorrect) {
                setScore(score + 1);
            }
            // else {
            //     setScore(score - 1);
            // }
            setAnswered((prevAnswered) =>
                prevAnswered.map((item, index) => (index === currentQuiz ? true : item))
            );
        }

        if (currentQuiz < 9) {
            // if (currentQuiz < fetchData.length - 1) {
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
        if (currentQuiz === 9) return alert("마지막 문제입니다.");
        if (currentQuiz < 9) {
            setCurrentQuiz(currentQuiz + 1);
        }
    };

    const handleReset = () => {
        setCurrentQuiz(0);
        setScore(0);
        setQuizFinished(false);
    };

    return (
        <section className="some-section">
            <>
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <h1 className={`${styles.title}`}>Quiz</h1>

                        {!quizFinished ? (
                            <div className={`${styles.quiz}`}>
                                <p>{userInfo?.nickname}님의 수어 실력을 퀴즈로 확인해보세요 🙌🏻</p>
                                <p className={`${styles.q_number}`}>
                                    {`${currentQuiz + 1}` + "/10"}
                                </p>
                                <QuizBox
                                    question={questions[currentQuiz]}
                                    options={options[currentQuiz]}
                                    onAnswer={handleAnswer}
                                />
                                <div className={`${styles.menu_btn}`}>
                                    <button onClick={handlePrev}>
                                        <FontAwesomeIcon icon={faChevronLeft} size={"3x"} />
                                    </button>
                                    <button onClick={handleNext}>
                                        <FontAwesomeIcon icon={faChevronRight} size={"3x"} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                className={
                                    score !== data?.length
                                        ? `${styles.answer}`
                                        : `${styles.allPass}`
                                }
                            >
                                <h2>🎊 맞춘 문제 🎉</h2>
                                <p>{score}개</p>
                                {score === data?.length && (
                                    <div className={`${styles.ending}`}>
                                        <p>축하합니다!!</p>
                                        <p>만점을 맞은 당신은 수어 고수!</p>
                                    </div>
                                )}
                                <button onClick={handleReset}> 다시 하기 </button>
                            </div>
                        )}
                    </>
                )}
            </>
        </section>
    );
}
