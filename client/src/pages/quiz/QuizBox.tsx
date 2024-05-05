import { useEffect, useState } from "react";
import { SignRes } from "../../types/interface";

interface QuizBoxProps {
    question: SignRes;
    options: SignRes[];
    onAnswer: (isCorrect: boolean) => void;
}

export default function QuizBox({ question, options, onAnswer }: QuizBoxProps) {
    return (
        <div className="quiz_box">
            <video controls src={question?.subDescription}></video>
            <div className="answer_btn">
                {options?.map((option, index) => (
                    <button key={index} onClick={() => onAnswer(option.key === question.key)}>{`${
                        index + 1
                    }. ${option.title}`}</button>
                ))}
            </div>
        </div>
    );
}
