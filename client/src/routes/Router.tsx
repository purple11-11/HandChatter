import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "../pages/Main";
import Mypage from "../pages/Mypage";
import Signin from "../pages/account/Signin";
import InstructorDetailPage from "../pages/InstructorDetailPage";
import Signup from "../pages/account/Signup";
import Webcam from "../pages/Webcam";
import FindId from "../pages/account/FindId";
import PersonalLearning from "../pages/PersonalLearning/PersonalLearning";
import Quiz from "../pages/quiz/Quiz";
import axios from "axios";
import { SignRes } from "../types/interface";
import App from "../App";
import Admin from "../pages/admin/Admin";
import AdminLogin from "../pages/admin/AdminLogin";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Main /> },
            {
                path: "learning",
                element: <PersonalLearning />,
                loader: async () => {
                    try {
                        if (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_KEY) {
                            const response = await axios.get(process.env.REACT_APP_API_URL, {
                                params: {
                                    serviceKey: process.env.REACT_APP_API_KEY,
                                    numOfRows: "100",
                                    pageNo: "1",
                                },
                            });

                            let results: SignRes[] = [];
                            if (!response.data.response.body.items) {
                                return results;
                            }

                            const items = response.data.response.body.items.item;
                            console.log("App.tsx items ::", items);

                            results = items.map((item: SignRes, index: number) => ({
                                key: index,
                                title: item.title,
                                url: item.url,
                                description: item.description,
                                referenceIdentifier: item.referenceIdentifier,
                                subDescription: item.subDescription,
                            }));

                            return results;
                        }
                    } catch (error) {
                        console.error("API 오청 중 오류 발생 ::", error);
                        return [];
                    }
                },
                children: [
                    {
                        path: "quiz",
                        element: <Quiz />,
                    },
                ],
            },
            { path: "login", element: <Signin /> },
            { path: "find/id", element: <FindId /> },
            { path: "signup/student", element: <Signup role={"student"} /> },
            { path: "signup/tutor", element: <Signup role={"tutor"} /> },
            { path: "mypage/:id", element: <Mypage /> },
            { path: "tutors/:tutorIndex", element: <InstructorDetailPage /> },
            { path: "class", element: <Webcam /> },
            { path: "admin", element: <Admin /> },
            { path: "adminLogin", element: <AdminLogin /> },
        ],
    },
]);

export default router;
