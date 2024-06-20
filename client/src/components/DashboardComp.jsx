import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers?limit=5');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts?limit=5');
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getcomments?limit=5');
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.user.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser.user]);

  return (
    <div className='p-3 mx-auto'>
      <div className='flex flex-wrap gap-4 justify-center'>
        <div className='flex flex-col p-4 bg-white dark:bg-gray-800 rounded-md shadow-md w-full md:w-72'>
          <div className='flex justify-between'>
            <div>
              <h3 className='text-gray-500 uppercase text-sm'>Total Users</h3>
              <p className='text-2xl'>{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className='text-teal-600 text-5xl' />
          </div>
          <div className='flex items-center gap-2 text-sm mt-2'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <span className='text-gray-500'>Last month</span>
          </div>
        </div>
        <div className='flex flex-col p-4 bg-white dark:bg-gray-800 rounded-md shadow-md w-full md:w-72'>
          <div className='flex justify-between'>
            <div>
              <h3 className='text-gray-500 uppercase text-sm'>Total Comments</h3>
              <p className='text-2xl'>{totalComments}</p>
            </div>
            <HiAnnotation className='text-indigo-600 text-5xl' />
          </div>
          <div className='flex items-center gap-2 text-sm mt-2'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <span className='text-gray-500'>Last month</span>
          </div>
        </div>
        <div className='flex flex-col p-4 bg-white dark:bg-gray-800 rounded-md shadow-md w-full md:w-72'>
          <div className='flex justify-between'>
            <div>
              <h3 className='text-gray-500 uppercase text-sm'>Total Posts</h3>
              <p className='text-2xl'>{totalPosts}</p>
            </div>
            <HiDocumentText className='text-lime-600 text-5xl' />
          </div>
          <div className='flex items-center gap-2 text-sm mt-2'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <span className='text-gray-500'>Last month</span>
          </div>
        </div>
      </div>
      <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
        <div className='flex flex-col w-full md:w-auto bg-white dark:bg-gray-800 p-4 rounded-md shadow-md'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg font-semibold'>Recent Users</h2>
            <Link to='/dashboard?tab=users' className='text-blue-500'>
              See all
            </Link>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white dark:bg-gray-800'>
              <thead>
                <tr>
                  <th className='py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'>User Image</th>
                  <th className='py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'>Username</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className='border-b'>
                    <td className='py-2 px-4'>
                      <img src={user.avatar.secure_url} alt='user' className='w-10 h-10 rounded-full bg-gray-500' />
                    </td>
                    <td className='py-2 px-4'>{user.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className='flex flex-col w-full md:w-auto bg-white dark:bg-gray-800 p-4 rounded-md shadow-md'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg font-semibold'>Recent Comments</h2>
            <Link to='/dashboard?tab=comments' className='text-blue-500'>
              See all
            </Link>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white dark:bg-gray-800'>
              <thead>
                <tr>
                  <th className='py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'>Comment Content</th>
                  <th className='py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'>Likes</th>
                </tr>
              </thead>
              <tbody>
                {comments.map(comment => (
                  <tr key={comment._id} className='border-b'>
                    <td className='py-2 px-4 w-96'>
                      <p className='line-clamp-2'>{comment.content}</p>
                    </td>
                    <td className='py-2 px-4'>{comment.numberOfLikes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className='flex flex-col w-full md:w-auto bg-white dark:bg-gray-800 p-4 rounded-md shadow-md'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg font-semibold'>Recent Posts</h2>
            <Link to='/dashboard?tab=posts' className='text-blue-500'>
              See all
            </Link>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white dark:bg-gray-800'>
              <thead>
                <tr>
                  <th className='py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'>Post Image</th>
                  <th className='py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'>Post Title</th>
                  <th className='py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'>Category</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post._id} className='border-b'>
                    <td className='py-2 px-4'>
                      <img src={post.image.secure_url} alt='post' className='w-14 h-10 rounded-md bg-gray-500' />
                    </td>
                    <td className='py-2 px-4 w-96'>{post.title}</td>
                    <td className='py-2 px-4'>{post.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
