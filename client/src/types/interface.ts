export interface RoleProps {
    role: "student" | "tutor";
}

export interface SignupData {
    id: string;
    password: string;
    nickname: string;
    email: string;
    authDocument?: FileList | null;
    certification?: number;
}

export interface ChatRoom {
    id: number;
    name: string;
    email: string;
    intro: string;
}
