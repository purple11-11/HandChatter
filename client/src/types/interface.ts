export interface RoleProps {
    role: "student" | "tutor";
}

export interface SignupData {
    id: string;
    password: string;
    nickname: string;
    email: string;
    authDocument?: File | null;
}

export interface ChatRoom {
    id: number;
    name: string;
    email: string;
    intro: string;
}
