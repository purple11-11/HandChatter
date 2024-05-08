import { Link } from "react-router-dom";
import { SignRes } from "../../types/interface";
import styles from "./resultCard.module.scss";

export default function ResultCard({ title, url, referenceIdentifier }: SignRes) {
    if (title.length > 11) title = title.slice(0, 10) + "...";
    return (
        <li className={`${styles.search_result_box}`}>
            <Link to={url} target="_blank">
                <img src={referenceIdentifier} alt="수어 썸네일" />
                <div className={`${styles.result_desc}`}>
                    <p className={`${styles.title}`}>{title}</p>
                </div>
            </Link>
        </li>
    );
}
