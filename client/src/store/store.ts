import { create } from "zustand";
import axios from "axios";

type UserInfo = {
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

type UserStore = {
    userInfo: UserInfo | null;
    isLogin: boolean;
    profileImgUrl: string;
    getInfo: () => Promise<void>;
    logout: () => void;
};

export const useInfoStore = create<UserStore>((set) => ({
    userInfo: null,
    isLogin: false,
    role: "student",
    profileImgUrl: "",

    getInfo: async () => {
        try {
            const url = `${process.env.REACT_APP_API_SERVER}/api/userInfo`;
            const res = await axios.get(url);
            console.log(res.data);
            if (!res.data.tutorInfo) {
                console.log("하하");
                const newProfileImgUrl =
                    process.env.REACT_APP_API_SERVER + res.data.studentInfo[0].profile_img;
                set((state) => ({
                    profileImgUrl: newProfileImgUrl,
                    userInfo: res.data.studentInfo[0],
                    isLogin: true,
                }));
            } else {
                console.log("하하");
                const newProfileImgUrl =
                    process.env.REACT_APP_API_SERVER + res.data.tutorInfo[0].profile_img;
                set((state) => ({
                    profileImgUrl: newProfileImgUrl,
                    userInfo: res.data.tutorInfo[0],
                    isLogin: true,
                }));
            }
        } catch (error) {
            set({ userInfo: null, isLogin: false, profileImgUrl: "" });
        }
    },
    logout: () => {
        set((state) => ({ isLogin: false, userInfo: null, profileImgUrl: "" }));
    },
}));
