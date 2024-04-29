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
import Webcam from "./pages/Webcam";
import FindId from "./pages/account/FindId";

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/login" element={<Signin />} />
                <Route path="/find/id" element={<FindId />} />
                <Route path="/signup/student" element={<Signup role={"student"} />} />
                <Route path="/signup/tutor" element={<Signup role={"tutor"} />} />
                {/* <Route path="/personal-learning" element={<PersonalLearning />} /> */}
                {/* <Route path="/quiz" element={<Quiz />} /> */}
                <Route path="/mypage" element={<Mypage />} />
                <Route path="/tutors/:tutorIndex" element={<InstructorDetailPage />} />
                <Route path="/class" element={<Webcam />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
