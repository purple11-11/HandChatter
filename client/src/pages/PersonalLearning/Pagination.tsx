import styles from "./pagination.module.scss";

interface PaginationProps {
    paginate: (pageNumber: number) => void;
    pageGroup: number;
    setCurrentGroup: (group: number) => void;
    currentGroup: number;
    currentPage: number;
    pageNumbers: number[];
    totalPages: number;
}

export default function Pagination({
    paginate,
    pageGroup,
    setCurrentGroup,
    currentGroup,
    currentPage,
    pageNumbers,
    totalPages,
}: PaginationProps) {
    const handlePrevGroup = () => {
        if (currentPage % pageGroup === 1) {
            const prevLastPage = currentPage - 1;
            paginate(prevLastPage);
            setCurrentGroup(currentGroup - 1);
        } else {
            paginate(currentPage - 1);
        }
    };

    const handleNextGroup = () => {
        const nextPage = currentPage + 1;
        const newGroup = Math.ceil(nextPage / pageGroup);
        if (newGroup !== currentGroup) {
            setCurrentGroup(newGroup);
        }
        paginate(nextPage);
    };

    return (
        <>
            <nav>
                <ul className={`${styles.pagination}`}>
                    <li>
                        <button onClick={() => paginate(1)}>{"<<"}</button>
                    </li>
                    <li>
                        <button onClick={handlePrevGroup} disabled={currentPage === 1}>
                            {"<"}
                        </button>
                    </li>
                    {pageNumbers.map((number) => (
                        <li key={number}>
                            <button
                                onClick={() => paginate(number)}
                                className={currentPage === number ? `${styles.active}` : ""}
                            >
                                {number}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button onClick={handleNextGroup} disabled={currentPage >= totalPages}>
                            {">"}
                        </button>
                    </li>
                    <li>
                        <button onClick={() => paginate(totalPages)}>{">>"}</button>
                    </li>
                </ul>
            </nav>
        </>
    );
}
