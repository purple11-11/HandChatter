import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputProps } from "../../types/interface";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";

export default function PasswordInput({ type, name, value, handleChange }: InputProps) {
    const [isShow, setIsShow] = useState(false);
    const handleClick = () => {
        setIsShow(!isShow);
    };

    return (
        <>
            <div className="pw_input_wrapper">
                <input
                    type={isShow ? "text" : type}
                    name={name}
                    id={name}
                    value={value}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                />
                <div className="eye_icon" onClick={handleClick}>
                    <FontAwesomeIcon icon={isShow ? faEyeSlash : faEye} />
                </div>
            </div>
        </>
    );
}
