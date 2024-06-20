import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toggleTheme } from "../redux/theme/themeSlice";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { signOutUserStart, signOutUserSuccess } from "../redux/user/userSlice";

export default function Header() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleSignout = async () => {
    try {
      console.log("Signing out...");
      signOutUserStart();
      dispatch(signOutUserSuccess());
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    window.location.href = `/search?${searchQuery}`;
  };

  return (
    <nav className="border-b-2 flex justify-between items-center py-2 px-4 flex-wrap">
      <Link
        to="/"
        className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center mb-4 sm:mb-0"
      >
        <span className="text-3xl text-purple-600 mr-2">M</span> Blog
      </Link>

      <form onSubmit={handleSubmit} className="flex items-center mx-auto mb-4 sm:mb-0">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring focus:ring-purple-400 mr-2 text-gray-600 w-full sm:w-auto"
        />
        <button type="submit" className="w-10 h-10  rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:ring-purple-400">
          <span className="text-gray-600">
            <AiOutlineSearch />
          </span>
        </button>
      </form>

      <div className="flex gap-6 mb-4 sm:mb-0">
        <Link
          to="/about"
          className="text-gray-900 dark:text-white hover:text-purple-600 transition-colors duration-300"
        >
          About
        </Link>
        <Link
          to="/projects"
          className="text-gray-900 dark:text-white hover:text-purple-600 transition-colors duration-300"
        >
          Projects
        </Link>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {currentUser ? (
          <div className="relative">
            <div className="w-10 h-10 cursor-pointer" onClick={toggleDropdown}>
              <img
                src={currentUser.user.avatar.secure_url}
                alt="user"
                className="w-full h-full rounded-full"
              />
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10">
                <div className="flex items-center p-3">
                  <img
                    src={currentUser.user.avatar.secure_url}
                    alt="user"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-gray-200">
                      {currentUser.username}
                    </span>
                    <span className="block text-xs text-gray-600 dark:text-gray-400">
                      {currentUser.email}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <Link to="/dashboard?tab=profile" onClick={closeDropdown}>
                    <button className="block w-full py-2 text-sm text-left text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
                      Profile
                    </button>
                  </Link>
                  <button
                    onClick={handleSignout}
                    className="block w-full py-2 text-sm text-left text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/sign-in">
            <button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}
