import Header from "../components/Header";
import Footer from "../components/Footer";
import React, { useState } from "react";
import axios from "axios";

interface Sign {
    title: string;
    url: string;
    referenceIdentifier: string;
    subDescription: string;
}

export default function Main() {
    const url = "http://api.kcisa.kr/openapi/service/rest/meta13/getCTE01701";
    const apiKey = "5e912661-427a-40bb-814d-facab428d26f";
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<Sign[]>([]);
    const [error, setError] = useState<string>("");

    const handleSearch = async () => {
        try {
            console.log("하이");
            const response = await axios.get(url, {
                params: {
                    serviceKey: apiKey,
                    // numOfRows: "10",
                    // pageNo: "1",
                },
            });
            const { data } = response;
            console.log(data.response.body.items.item);

            const results: Sign[] = data.response.body.items.item;
            console.log(results);
            setSearchResults(results);
            setError("");
        } catch (error) {
            setSearchResults([]);
            setError("검색 중 오류가 발생했습니다.");
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    return (
        <>
            <Header />
            <section></section>
            <section>
                <div>
                    <input
                        type="text"
                        placeholder="수어 검색"
                        value={searchTerm}
                        onChange={handleChange}
                    />
                    <button onClick={handleSearch}>검색</button>
                    {error && <p>{error}</p>}
                    <ul>
                        {searchResults.map((sign, index) => (
                            <li key={index}>
                                {/* <img src={sign.url} alt={sign.title} /> */}
                                <p>
                                    <a href={sign.url} target="_blank">
                                        {sign.title}
                                    </a>
                                </p>
                                <img src={sign.referenceIdentifier} alt="" />
                                <p>{sign.title}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
            <Footer />
        </>
    );
}
