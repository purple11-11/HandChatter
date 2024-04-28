import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Header from "./components/Header";
import Footer from "./components/Footer";
// import PersonalLearning from "./pages/PersonalLearning";
// import Quiz from "./pages/Quiz";
import Mypage from "./pages/Mypage";
import "./styles/index.scss";
import Signin from "./pages/account/Signin";
import InstructorDetailPage from "./pages/InstructorDetailPage";
import Chatting from "./components/Chatting";
import Signup from "./pages/account/Signup";

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/api" element={<Main />} />
                <Route path="/api/login" element={<Signin />} />
                <Route path="/api/student" element={<Signup role={"student"} />} />
                <Route path="/api/tutor" element={<Signup role={"tutor"} />} />
                {/* <Route path="/personal-learning" element={<PersonalLearning />} /> */}
                {/* <Route path="/quiz" element={<Quiz />} /> */}
                <Route path="/api/mypage" element={<Mypage />} />
                <Route path="/api/tutors/:tutorIndex" element={<InstructorDetailPage />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
