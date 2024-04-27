import { InputProps } from "../../types/interface";
import PasswordInput from "./PasswordInput";

export default function Input({
    labelText,
    type,
    name,
    value,
    handleChange,
    btnText,
    onClick,
}: InputProps) {
    return (
        <>
            <div className={`sign_up ${name}`}>
                <label htmlFor={name}>{labelText}</label>
                {/* TODO: <PasswordInput type="password" {...register("pw", { required: true })} /> */}
                {type === "password" ? (
                    <PasswordInput type="password" />
                ) : (
                    <input
                        type={type}
                        name={name}
                        id={name}
                        value={value}
                        onChange={handleChange}
                        required
                    />
                )}
                {btnText && (
                    <button type="button" onClick={onClick}>
                        {btnText}
                    </button>
                )}
            </div>
        </>
    );
}
