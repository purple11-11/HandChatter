import { create } from "zustand";
import { persist } from "zustand/middleware";
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
    level?: string;
    description?: string;
    des_video?: string;
    authority?: number;
    provider?: string;
};

type UserStore = {
    userInfo: UserInfo | null;
    isLogin: boolean;
    profileImgUrl: string;
    favorite: boolean;
    favorites: { [key: string]: boolean };
    toggleFavorite: (tutorIdx: string) => void;
    tutorIdx: string;
    isFavorite: () => void;
    getInfo: () => Promise<void>;
    logout: () => void;
    dmToTutor: (tutorIdx: string) => void;
};

export const useInfoStore = create<UserStore>()(
    persist(
        (set) => ({
            userInfo: null,
            isLogin: false,
            role: "student",
            profileImgUrl: "",
            favorite: false,
            tutorIdx: "",
            favorites: {},

            getInfo: async () => {
                try {
                    const url = `${process.env.REACT_APP_API_SERVER}/api/userInfo`;
                    const res = await axios.get(url);
                    console.log(res.data);
                    if (!res.data.tutorInfo) {
                        const newProfileImgUrl =
                            process.env.REACT_APP_API_SERVER +
                            "/" +
                            res.data.studentInfo[0].profile_img;
                        set((state) => ({
                            profileImgUrl: newProfileImgUrl,
                            userInfo: res.data.studentInfo[0],
                            isLogin: true,
                        }));
                    } else {
                        const newProfileImgUrl =
                            process.env.REACT_APP_API_SERVER +
                            "/" +
                            res.data.tutorInfo[0].profile_img;
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
            isFavorite: () => {
                set((state) => ({ favorite: !state.favorite }));
            },
            toggleFavorite: (tutorIdx: string) => {
                set((state) => ({
                    favorites: {
                        ...state.favorites,
                        [tutorIdx]: !state.favorites[tutorIdx], // 해당 튜터의 찜 상태를 토글
                    },
                }));
            },
            dmToTutor: (index: string) => {
                set((state) => ({ tutorIdx: index }));
            },
        }),
        {
            name: "user-info",
        }
    )
);
