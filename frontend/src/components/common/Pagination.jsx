export default function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, idx) => (
                <button
                    key={idx + 1}
                    onClick={() => onPageChange(idx + 1)}
                    className={`px-3 py-1 rounded ${currentPage === idx + 1
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                >
                    {idx + 1}
                </button>
            ))}
        </div>
    );
}
