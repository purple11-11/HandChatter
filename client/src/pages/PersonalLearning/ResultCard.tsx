import { Link } from "react-router-dom";
import { SignRes } from "../../types/interface";
import styles from "./resultCard.module.scss";

export default function ResultCard({
    title,
    url,
    description,
    subDescription, // 영상 자료
    referenceIdentifier,
}: SignRes) {
    return (
        <li className={`${styles.search_result_box}`}>
            <img src={referenceIdentifier} alt="수어 썸네일" />
            <div className={`${styles.result_desc}`}>
                <p>{title}</p>
                <Link to={url} target="_blank">
                    수어 영상 보러가기
                </Link>
            </div>
        </li>
    );
}
