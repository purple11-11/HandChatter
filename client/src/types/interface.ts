export interface RoleProps {
    role: "student" | "tutor";
}

export interface SignupData {
    id: string;
    pw: string;
    nickname: string;
    email: string;
    authDocument: File | null;
    [key: string]: string | File | null; // 인덱스 시그니처
}

export interface InputProps {
    labelText?: string;
    type: string;
    name: string;
    value: string;
    handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    btnText?: string;
    onClick?: () => Promise<void>;
}
