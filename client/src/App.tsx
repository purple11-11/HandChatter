import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Header from "./components/Header";
import Footer from "./components/Footer";
// import Login from "./pages/Login";
// import SignUp from "./pages/SignUp";
// import PersonalLearning from "./pages/PersonalLearning";
// import Quiz from "./pages/Quiz";
import Mypage from "./pages/Mypage";
import "./styles/index.scss";

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Main />} />
                {/* <Route path="/login" element={<Login />} /> */}
                {/* <Route path="/signup" element={<SignUp />} /> */}
                {/* <Route path="/personal-learning" element={<PersonalLearning />} /> */}
                {/* <Route path="/quiz" element={<Quiz />} /> */}
                <Route path="/Mypage" element={<Mypage />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
