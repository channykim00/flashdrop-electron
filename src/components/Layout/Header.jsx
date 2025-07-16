import { useEffect, useState, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import useSearchStore from "@/stores/searchStore";

const Header = () => {
  const navigate = useNavigate();

  const { filterBy, setFilterBy, query, setQuery, results, setResults } = useSearchStore();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const filterOptions = [
    { value: "title", label: "링크 제목" },
    { value: "file", label: "파일명" },
    { value: "sender", label: "보낸이" },
  ];

  const handleSearch = useCallback(async () => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    try {
      let matchedResults = [];
      if (filterBy === "title") {
        matchedResults = await window.api.searchLinksByTitle(query);
      } else if (filterBy === "file") {
        matchedResults = await window.api.searchDownloadHistory(query);
      } else if (filterBy === "sender") {
        matchedResults = await window.api.searchBySender(query);
      }
      setResults(matchedResults);
    } catch (err) {
      console.error("검색 중 오류:", err);
      setResults([]);
    }
  }, [query, filterBy, setResults]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filterBy, handleSearch, setResults]);

  return (
    <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="relative flex items-center gap-2 text-gray-600">
        <div className="relative">
          <input
            type="search"
            placeholder="검색"
            className="h-10 w-72 rounded-lg border border-gray-300 bg-white px-5 pl-10 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
                navigate("/searchResults");
              }
            }}
          />
          <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
            <FaSearch className="h-4 w-4" />
          </div>

          {showResults && results.length > 0 && (
            <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
              <ul className="max-h-60 overflow-auto py-1">
                {results.map((result, index) => (
                  <li
                    key={index}
                    className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      if (filterBy === "title") {
                        navigate("/linkManagement", {
                          state: { openId: result.uniqueUrl },
                        });
                      }
                      if (filterBy === "file" || filterBy === "sender") {
                        navigate("/fileHistory", { state: { highlightFileId: result.fileId } });
                      }
                    }}
                  >
                    {filterBy === "title" && (
                      <span className="me-2 rounded-sm border border-blue-400 bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-400">
                        링크 제목
                      </span>
                    )}
                    {filterBy === "sender" && (
                      <span className="me-2 rounded-sm border border-indigo-400 bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:text-indigo-400">
                        보낸이
                      </span>
                    )}
                    {filterBy === "file" && (
                      <span className="me-2 rounded-sm border border-green-400 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-gray-700 dark:text-green-400">
                        파일
                      </span>
                    )}
                    {filterBy === "title" && result.title}
                    {filterBy === "file" && result.originalFilename}
                    {filterBy === "sender" && result.senderName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="relative inline-block text-left">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
          >
            {filterOptions.find((opt) => opt.value === filterBy)?.label || "필터 선택"}
            <MdKeyboardArrowDown className="mt-1" />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
              role="menu"
              tabIndex="-1"
            >
              <div
                className="py-1"
                role="none"
              >
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilterBy(option.value);
                      setDropdownOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 ${
                      filterBy === option.value ? "bg-gray-100 font-semibold" : ""
                    }`}
                    role="menuitem"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
