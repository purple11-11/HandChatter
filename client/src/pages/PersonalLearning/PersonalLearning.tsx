import { useEffect, useRef, useState } from "react";
import Button from "../../components/button/Button";
import ResultCard from "./ResultCard";
import axios from "axios";
import { SignRes } from "../../types/interface";

type KORIndexType = {
    [key: string]: string[];
};

export default function PersonalLearning() {
    const url = "http://api.kcisa.kr/openapi/service/rest/meta13/getCTE01701";
    const apiKey = "5e912661-427a-40bb-814d-facab428d26f";

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<SignRes[]>([]);
    const [isSearched, setIsSearched] = useState<boolean>(false); // 검색 여부 확인용
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const fetchedDataRef = useRef<SignRes[]>([]);

    const getSignData = async () => {
        if (fetchedDataRef.current.length > 0) return;
        setIsLoading(true);
        try {
            const response = await axios.get(url, {
                params: {
                    serviceKey: apiKey,
                    numOfRows: "10",
                    pageNo: "1",
                },
            });

            const items = response.data.response.body.items.item;
            console.log(response.data.response.body);

            let results: SignRes[] = items.map((item: SignRes, index: number) => ({
                key: index,
                title: item.title,
                url: item.url,
                description: item.description,
                referenceIdentifier: item.referenceIdentifier,
                subDescription: item.subDescription,
            }));
            /*           .sort((a: SignRes, b: SignRes) => {
                    const titleA = a.title.substring(a.title.search(/[가-힣]/));
                    const titleB = b.title.substring(b.title.search(/[가-힣]/));

                    return titleA.localeCompare(titleB, "ko");
                }); */

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
    };

    return (
        <section>
            <h2>무엇을 검색하시겠어요?</h2>

            <div className="search_bar">
                <input
                    type="text"
                    placeholder="수어 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={handleSearch} text="검색" />
                {error && <p>{error}</p>}
            </div>
            <div className="search_category">
                <Button key={"all"} onClick={handleReset} text="전체" />
                {Object.keys(KOR).map((keyword) => (
                    <Button key={keyword} onClick={() => keywordSearch(keyword)} text={keyword} />
                ))}
            </div>
            <ul>
                <h3>
                    {isSearched ? "검색 결과" : "전체"} ({searchResults.length})
                </h3>
                {isLoading && <p>데이터를 불러오고 있어요 😀</p>}
                {searchResults.map((result) => (
                    <ResultCard {...result} />
                ))}
            </ul>
        </section>
    );
}
