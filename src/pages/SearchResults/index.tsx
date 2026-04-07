import { FaSearch } from "react-icons/fa";

import useSearchStore from "@/stores/searchStore";

const SearchResults = () => {
  const { results, filterBy, query } = useSearchStore();

  return (
    <div className="p-4">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
        <FaSearch /> 검색 결과 - "{query}"
      </h2>
      {results.length === 0 ? (
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {results.map((item, index) => (
            <li
              key={index}
              className="rounded border p-3 shadow hover:bg-gray-50"
            >
              {filterBy === "title" && item.title}
              {filterBy === "file" && item.originalFilename}
              {filterBy === "sender" && item.senderName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
