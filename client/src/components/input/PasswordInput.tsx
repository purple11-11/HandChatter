import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import React, { forwardRef, useState } from "react";
import "../../styles/components/input/password.scss";

interface PasswordProps extends React.HTMLProps<HTMLInputElement> {
    type: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordProps>(({ type, ...rest }, ref) => {
    const [isShow, setIsShow] = useState(false);
    const handleClick = () => {
        setIsShow(!isShow);
    };

    return (
        <>
            <div className="pw_input_wrapper">
                <input
                    ref={ref}
                    type={isShow ? "text" : type}
                    autoComplete="current-password"
                    {...rest}
                />
                <div className="eye_icon" onClick={handleClick}>
                    <FontAwesomeIcon icon={isShow ? faEyeSlash : faEye} />
                </div>
            </div>
        </>
    );
});

export default PasswordInput;
