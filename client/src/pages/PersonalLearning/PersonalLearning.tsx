import { useEffect, useRef, useState } from "react";
import styles from "./personalLearning.module.scss";
import ResultCard from "./ResultCard";
import { SignRes } from "../../types/interface";
import Pagination from "./Pagination";
import { useSignStore } from "../../store/signStore";
import Spinner from "../../components/spinner/Spinner";

type KORIndexType = {
    [key: string]: string[];
};

export default function PersonalLearning() {
    const fetchData = useSignStore((state) => state.fetchData);
    const data = useSignStore((state) => state.data);
    const loading = useSignStore((state) => state.loading);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<SignRes[]>([]);
    const [isSearched, setIsSearched] = useState<boolean>(false); // 검색 여부 확인용
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

    useEffect(() => {
        if (!data) fetchData();

        if (fetchedDataRef.current.length > 0) return;

        try {
            fetchedDataRef.current = data || [];
            setSearchResults(data || []);
            setError("");
        } catch (error) {
            console.error(error);
            setSearchResults([]);
            setError("검색 중 오류가 발생했습니다.");
        }
    }, []);

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
        <>
            {loading ? (
                <Spinner />
            ) : (
                <section>
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
                </section>
            )}
        </>
    );
}
