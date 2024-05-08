import axios from "axios";
import { useState } from "react";
import styles from "./findId.module.scss";

export default function FindId() {
    const [email, setEmail] = useState<string>("");
    const [findIdResult, setFindIdResult] = useState<string>("");

    const findId = async () => {
        if (!email) return alert("이메일을 입력해주세요.");

        const res = await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_SERVER}/api/searchId?email=${email}`,
        });
        setFindIdResult(res.data);
    };

    return (
        <section className="some-section">
            <div className={`${styles.find_id_container}`}>
                <h2>아이디 찾기</h2>
                <div className={`${styles.find_id}`}>
                    <div className={`${styles.find_email}`}>
                        <label htmlFor="email">이메일</label>
                        <input
                            className={`${styles.find_id_input}`}
                            type="email"
                            id="email"
                            placeholder="example@example.com"
                            value={email || ""}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button className={`${styles.find_id_btn}`} type="button" onClick={findId}>
                        아이디 찾기
                    </button>

                    <div className={`${styles.find_id_result}`}>
                        <p>{findIdResult}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
