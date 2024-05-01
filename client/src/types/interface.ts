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

export interface Sign {
    title: string;
    url: string;
    referenceIdentifier: string;
    subDescription: string;
}
export interface Tutor {
    nickname: string;
    email: string;
    content: string;
    price: string;
    des_video?: string;
    profile_img?: string;
}

export type UserInfo = {
    tutor_idx?: number;
    student_idx?: number;
    id: string;
    password: string;
    nickname: string;
    price: number;
    email: string;
    profile_img: string;
    description?: string;
    des_video?: string;
    authority: number;
};

export type UserStore = {
    userInfo: UserInfo | null;
    isLogin: boolean;
    profileImgUrl: string;
    getInfo: () => Promise<void>;
};