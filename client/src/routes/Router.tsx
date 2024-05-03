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
                    if (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_KEY) {
                        const response = await axios.get(process.env.REACT_APP_API_URL, {
                            params: {
                                serviceKey: process.env.REACT_APP_API_KEY,
                                numOfRows: "10",
                                pageNo: "1",
                            },
                        });
                        const items = response.data.response.body.items.item;
                        console.log("App.tsx items ::", items);

                        let results: SignRes[] = items.map((item: SignRes, index: number) => ({
                            key: index,
                            title: item.title,
                            url: item.url,
                            description: item.description,
                            referenceIdentifier: item.referenceIdentifier,
                            subDescription: item.subDescription,
                        }));

                        return results;
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
            { path: "mypage", element: <Mypage /> },
            { path: "tutors/:tutorIndex", element: <InstructorDetailPage /> },
            { path: "class", element: <Webcam /> },
        ],
    },
]);

export default router;
