import { useEffect, useState } from "react";
import Button from "../../components/button/Button";
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
                    <Button
                        key={index}
                        text={`${index + 1}. ${option.title}`}
                        onClick={() => onAnswer(option.key === question.key)}
                    />
                ))}
            </div>
        </div>
    );
}
