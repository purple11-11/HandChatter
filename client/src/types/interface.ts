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
    name?: string;
    email?: string;
    intro?: string;
    profileImg?: string;
}

export interface SignRes {
    key: number;
    result?: Object;
    title: string;
    url: string;
    description?: string;
    referenceIdentifier?: string; // 썸네일
    subDescription: string; // 영상 자료
}
export interface Tutor {
    nickname: string;
    email: string;
    description: string;
    price: string;
    des_video?: string;
    profile_img: string;
}

export interface Message {
    content: string;
    sender: string;
}

export type UserInfo = {
    tutor_idx?: number;
    stu_idx?: number;
    id: string;
    password: string;
    nickname: string;
    price: number;
    email: string;
    profile_img: string;
    description?: string;
    des_video?: string;
    authority?: number;
};

export type UserStore = {
    userInfo: UserInfo | null;
    isLogin: boolean;
    profileImgUrl: string;
    getInfo: () => Promise<void>;
};
