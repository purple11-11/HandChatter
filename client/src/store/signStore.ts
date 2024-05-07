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
                try {
                    if (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_KEY) {
                        const response = await axios.get(process.env.REACT_APP_API_URL, {
                            params: {
                                serviceKey: process.env.REACT_APP_API_KEY,
                            },
                        });

                        let results: SignRes[] = [];
                        if (response.data.response.body.items) {
                            const items = response.data.response.body.items.item;

                            results = items.map((item: SignRes, index: number) => ({
                                key: index,
                                title: item.title,
                                url: item.url,
                                description: item.description,
                                referenceIdentifier: item.referenceIdentifier,
                                subDescription: item.subDescription,
                            }));
                        }

                        set({ data: results, loading: true });
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
