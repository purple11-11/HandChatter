import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
// import Login from "./pages/Login";
// import SignUp from "./pages/SignUp";
// import PersonalLearning from "./pages/PersonalLearning";
// import Quiz from "./pages/Quiz";
import "./styles/index.scss";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Main />} />
            {/* <Route path="/login" element={<Login />} /> */}
            {/* <Route path="/signup" element={<SignUp />} /> */}
            {/* <Route path="/personal-learning" element={<PersonalLearning />} /> */}
            {/* <Route path="/quiz" element={<Quiz />} /> */}
        </Routes>
    );
}

export default App;
