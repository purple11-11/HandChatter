import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { SignRes } from "../types/interface";

type SignStore = {
    data: SignRes[] | null;
    loading: boolean;
    fetchData: () => Promise<void>;
};

export const useSignStore = create<SignStore>()(
    persist(
        (set) => ({
            data: null,
            loading: false,
            fetchData: async () => {
                set({ loading: true });
                console.log("ddd");
                try {
                    console.log("API_URL ::", process.env.REACT_APP_API_URL);

                    if (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_KEY) {
                        const response = await axios.get(
                            process.env.REACT_APP_API_SERVER + "/api/signs"
                        );
                        console.log("API Response ::", response.data);
                        set({ data: response.data, loading: true });
                    }
                } catch (error) {
                    console.error("API 오청 중 오류 발생 ::", error);
                    set({ data: [] });
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: "sign-storage",
        }
    )
);
