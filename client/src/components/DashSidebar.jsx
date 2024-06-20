import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOutUserSuccess } from '../redux/user/userSlice';

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'GET',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutUserSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="w-full md:w-56 bg-gray-800 text-white">
      <div className="p-4">
        <div className="flex flex-col gap-1">
          {currentUser.user && currentUser.user.isAdmin && (
            <Link to="/dashboard?tab=dash">
              <div
                className={`p-2 flex items-center gap-2 rounded-md hover:bg-gray-700 transition duration-300 ${
                  tab === 'dash' || !tab ? 'bg-gray-700' : ''
                }`}
              >
                <HiChartPie className="w-5 h-5" />
                Dashboard
              </div>
            </Link>
          )}
          <Link to="/dashboard?tab=profile">
            <div
              className={`p-2 flex items-center gap-2 rounded-md hover:bg-gray-700 transition duration-300 ${
                tab === 'profile' ? 'bg-gray-700' : ''
              }`}
            >
              <HiUser className="w-5 h-5" />
              <span>
                Profile {currentUser.isAdmin ? '(Admin)' : '(User)'}
              </span>
            </div>
          </Link>
          {currentUser.user.isAdmin && (
            <Link to="/dashboard?tab=posts">
              <div
                className={`p-2 flex items-center gap-2 rounded-md hover:bg-gray-700 transition duration-300 ${
                  tab === 'posts' ? 'bg-gray-700' : ''
                }`}
              >
                <HiDocumentText className="w-5 h-5" />
                Posts
              </div>
            </Link>
          )}
          {currentUser.user.isAdmin && (
            <>
              <Link to="/dashboard?tab=users">
                <div
                  className={`p-2 flex items-center gap-2 rounded-md hover:bg-gray-700 transition duration-300 ${
                    tab === 'users' ? 'bg-gray-700' : ''
                  }`}
                >
                  <HiOutlineUserGroup className="w-5 h-5" />
                  Users
                </div>
              </Link>
              <Link to="/dashboard?tab=comments">
                <div
                  className={`p-2 flex items-center gap-2 rounded-md hover:bg-gray-700 transition duration-300 ${
                    tab === 'comments' ? 'bg-gray-700' : ''
                  }`}
                >
                  <HiAnnotation className="w-5 h-5" />
                  Comments
                </div>
              </Link>
            </>
          )}
          <div
            className="p-2 flex items-center gap-2 rounded-md hover:bg-gray-700 transition duration-300 cursor-pointer"
            onClick={handleSignout}
          >
            <HiArrowSmRight className="w-5 h-5" />
            Sign Out
          </div>
        </div>
      </div>
    </div>
  );
}
