import { useEffect, useRef, useState } from "react";
import styles from "./personalLearning.module.scss";
import ResultCard from "./ResultCard";
import { SignRes } from "../../types/interface";
import { Outlet, useLoaderData, useLocation } from "react-router-dom";
import Pagination from "./Pagination";

type KORIndexType = {
    [key: string]: string[];
};

export default function PersonalLearning() {
    const results = useLoaderData() as SignRes[];
    const location = useLocation();

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<SignRes[]>([]);
    const [isSearched, setIsSearched] = useState<boolean>(false); // 검색 여부 확인용
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const fetchedDataRef = useRef<SignRes[]>([]);

    const [activeKey, setActiveKey] = useState<string | null>(null);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [currentGroup, setCurrentGroup] = useState(1);
    const itemsPerPage = 12;
    const pageGroup = 10;

    const currentGroupStart = (currentGroup - 1) * pageGroup + 1;
    const currentGroupEnd = currentGroup * pageGroup;
    const totalPages = Math.ceil(searchResults.length / itemsPerPage);
    const changeGroup = (group: number) => setCurrentGroup(group);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);

        const newGroup = Math.ceil(pageNumber / pageGroup);
        if (newGroup !== currentGroup) {
            changeGroup(newGroup);
        }
    };

    const pageNumbers = [];
    for (let i = currentGroupStart; i <= currentGroupEnd; i++) {
        pageNumbers.push(i);
    }

    // loader를 통해 받은 데이터 저장
    const getSignData = async () => {
        if (fetchedDataRef.current.length > 0) return;
        setIsLoading(true);

        try {
            fetchedDataRef.current = results;
            setSearchResults(results);
            setError("");
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setSearchResults([]);
            setError("검색 중 오류가 발생했습니다.");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getSignData();
    }, []);

    const handleSearch = async () => {
        if (!searchTerm) return alert("검색어를 입력해주세요.");
        setIsSearched(true);
        const filteredResults = fetchedDataRef.current.filter((result) =>
            result.title.includes(searchTerm)
        );
        setSearchResults(filteredResults);
        setError("");
    };

    const KOR: KORIndexType = {
        ㄱ: ["가", "나"],
        ㄴ: ["나", "다"],
        ㄷ: ["다", "라"],
        ㄹ: ["라", "마"],
        ㅁ: ["마", "바"],
        ㅂ: ["바", "사"],
        ㅅ: ["사", "아"],
        ㅇ: ["아", "자"],
        ㅈ: ["자", "차"],
        ㅊ: ["차", "카"],
        ㅋ: ["카", "타"],
        ㅌ: ["타", "파"],
        ㅍ: ["파", "하"],
        ㅎ: ["하", "히"],
    };

    const keywordSearch = (keyword: string) => {
        if (KOR[keyword]) {
            setIsSearched(true);
            setActiveKey(keyword);
            paginate(1);

            const startCharCode = KOR[keyword][0].charCodeAt(0);
            const endCharCode = KOR[keyword][1].charCodeAt(0);

            const filteredResults = fetchedDataRef.current.filter((result) => {
                const firstChar = result.title.charCodeAt(0);
                return firstChar >= startCharCode && firstChar < endCharCode;
            });
            setSearchResults(filteredResults);
        }
    };

    const handleReset = () => {
        setSearchResults(fetchedDataRef.current);
        setSearchTerm("");
        setIsSearched(false);
        setActiveKey(null);
    };

    return (
        <section>
            {location.pathname !== "/learning/quiz" && (
                <>
                    <div className={`${styles.title}`}>
                        <h1>무엇을 검색하시겠어요?</h1>

                        <div className={`${styles.search_bar}`}>
                            <input
                                type="text"
                                placeholder="수어 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button onClick={handleSearch}>검색</button>
                            {error && <p>{error}</p>}
                        </div>

                        <div className={`${styles.search_category}`}>
                            <button
                                key={"all"}
                                onClick={handleReset}
                                className={activeKey === null ? `${styles.active}` : ""}
                            >
                                전체
                            </button>
                            {Object.keys(KOR).map((keyword) => (
                                <button
                                    key={keyword}
                                    onClick={() => keywordSearch(keyword)}
                                    className={activeKey === keyword ? `${styles.active}` : ""}
                                >
                                    {keyword}
                                </button>
                            ))}
                        </div>
                    </div>

                    <h2 className={`${styles.result_title}`}>
                        {isSearched ? "검색 결과" : "전체"} ({searchResults.length})
                    </h2>
                    <ul className={`${styles.results}`}>
                        {isLoading && <p>데이터를 불러오고 있어요 😀</p>}
                        {currentItems.map((result) => (
                            <ResultCard {...result} />
                        ))}
                    </ul>
                    <Pagination
                        paginate={paginate}
                        pageGroup={pageGroup}
                        setCurrentGroup={setCurrentGroup}
                        currentGroup={currentGroup}
                        currentPage={currentPage}
                        pageNumbers={pageNumbers}
                        totalPages={totalPages}
                    />
                </>
            )}
            <Outlet />
        </section>
    );
}
