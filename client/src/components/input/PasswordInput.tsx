import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import React, { forwardRef, useState } from "react";
import styles from "./passwordInput.module.scss";

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
            <div className={`${styles.pw_input_wrapper}`}>
                <input
                    ref={ref}
                    type={isShow ? "text" : type}
                    autoComplete="current-password"
                    {...rest}
                />
                <div className={`${styles.eye_icon}`} onClick={handleClick}>
                    <FontAwesomeIcon
                        className={`${styles.icon}`}
                        icon={isShow ? faEyeSlash : faEye}
                    />
                </div>
            </div>
        </>
    );
});

export default PasswordInput;
