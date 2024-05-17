import Logo from "../assets/header-logo.png";
import Github from "../assets/github@2x.png";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="logo">
                    <img src={Logo} alt="" />
                    andChatter
                </div>
                <div className="footer-content">
                    <div>
                        <p>Front</p>
                        <ul>
                            <li>ReactJS</li>
                            <li>Typescript</li>
                            <li>SCSS</li>
                            <li>Zustand</li>
                            <li>WebRTC</li>
                        </ul>
                    </div>
                    <div>
                        <p>Back</p>
                        <ul>
                            <li>Javascript</li>
                            <li>Node.js</li>
                            <li>Swagger</li>
                            <li>MySQL</li>
                            <li>Sequelize.js</li>
                            <li>.ENV</li>
                            <li>Multer</li>
                            <li>bcrypt</li>
                        </ul>
                    </div>
                    <div>
                        <p>Our Team</p>
                        <ul>
                            <li>윤영인</li>
                            <li>추수연</li>
                            <li>김시연</li>
                            <li>권순모</li>
                            <li>이기혁</li>
                        </ul>
                    </div>
                    <div className="mobile-git-btn">
                        <a href="https://github.com/purple11-11/HandChatter" target="_blank">
                            <img src={Github} alt="" />
                            HandChatter
                        </a>
                    </div>
                </div>
                <div className="git-btn">
                    <a href="https://github.com/purple11-11/HandChatter" target="_blank">
                        <img src={Github} alt="" />
                        Git HandChatter
                    </a>
                </div>
            </div>
        </footer>
    );
}
