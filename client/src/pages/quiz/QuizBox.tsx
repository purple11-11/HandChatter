import { SignRes } from "../../types/interface";
import styles from "./quizBox.module.scss";

interface QuizBoxProps {
    question: SignRes;
    options: SignRes[];
    onAnswer: (isCorrect: boolean) => void;
}

export default function QuizBox({ question, options, onAnswer }: QuizBoxProps) {
    return (
        <div className={`${styles.quiz_box}`}>
            <video controls src={question?.subDescription}></video>
            <div className={`${styles.answer_btn}`}>
                {options?.map((option, index) => (
                    <button key={index} onClick={() => onAnswer(option.key === question.key)}>{`${
                        index + 1
                    }. ${option.title.slice(0, 6)}`}</button>
                ))}
            </div>
        </div>
    );
}
