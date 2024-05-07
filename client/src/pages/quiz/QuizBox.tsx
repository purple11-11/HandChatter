import { SignRes } from "../../types/interface";
import styles from "./quizBox.module.scss";

interface QuizBoxProps {
    question: SignRes;
    options: SignRes[];
    onAnswer: (isCorrect: boolean) => void;
}

export default function QuizBox({ question, options, onAnswer }: QuizBoxProps) {
    const randomIndex = Math.floor(Math.random() * 10);
    return (
        <div className={`${styles.quiz_box}`}>
            <video controls src={question?.subDescription}></video>
            <div className={`${styles.answer_btn}`}>
                {options?.map((option, index) => {
                    let displayTitle = option.title;
                    if (displayTitle.length > 5) displayTitle = option.title.slice(0, 5) + "...";
                    return (
                        <button
                            key={index}
                            onClick={() => onAnswer(option.key === question.key)}
                        >{`${index + 1}. ${displayTitle}`}</button>
                    );
                })}
            </div>
        </div>
    );
}
