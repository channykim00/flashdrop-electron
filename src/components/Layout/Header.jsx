import { FaSearch } from "react-icons/fa";

const Header = () => {
  return (
    <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="relative text-gray-600">
        <input
          type="search"
          name="search"
          placeholder="Search"
          className="h-10 w-96 rounded-lg border border-gray-300 bg-white px-5 pl-10 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none"
        />
        <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
          <FaSearch className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default Header;
