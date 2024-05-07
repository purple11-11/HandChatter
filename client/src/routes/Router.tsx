import { createBrowserRouter } from "react-router-dom";
import Main from "../pages/Main";
import Mypage from "../pages/Mypage";
import Signin from "../pages/account/Signin";
import InstructorDetailPage from "../pages/InstructorDetailPage";
import Signup from "../pages/account/Signup";
import Webcam from "../pages/Webcam";
import FindId from "../pages/account/FindId";
import PersonalLearning from "../pages/PersonalLearning/PersonalLearning";
import Quiz from "../pages/quiz/Quiz";
import App from "../App";
import Admin from "../pages/admin/Admin";
import AdminLogin from "../pages/admin/AdminLogin";
import FindPw from "../pages/account/FindPw";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Main /> },
            { path: "learning", element: <PersonalLearning /> },
            { path: "quiz", element: <Quiz /> },
            { path: "login", element: <Signin /> },
            { path: "find/id", element: <FindId /> },
            { path: "find/pw", element: <FindPw /> },
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
