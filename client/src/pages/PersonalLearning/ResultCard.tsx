import { Link } from "react-router-dom";
import { SignRes } from "../../types/interface";

export default function ResultCard({
    title,
    url,
    description,
    subDescription, // 영상 자료
    referenceIdentifier,
}: SignRes) {
    return (
        <li className="search_result_box">
            <img src={referenceIdentifier} alt="수어 썸네일" />
            <div className="result_desc">
                <p>{title}</p>
                <hr />
                <p>{description}</p>
                <Link to={url}>{url}</Link>
            </div>
        </li>
    );
}
