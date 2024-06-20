import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.user.isAdmin) {
      fetchUsers();
    }
  }, [currentUser.user._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-3'>
      {currentUser.user.isAdmin && users.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className='min-w-full table-fixed shadow-md'>
              <thead className='bg-gray-200 dark:bg-gray-700'>
                <tr>
                  <th className='w-1/6 p-2 text-left'>Date created</th>
                  <th className='w-1/6 p-2 text-left'>User image</th>
                  <th className='w-1/6 p-2 text-left'>Username</th>
                  <th className='w-1/6 p-2 text-left'>Email</th>
                  <th className='w-1/6 p-2 text-left'>Admin</th>
                  <th className='w-1/6 p-2 text-left'>Delete</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <td className='p-2'>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className='p-2'>
                      <img
                        src={user.avatar.secure_url}
                        alt={user.username}
                        className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                      />
                    </td>
                    <td className='p-2'>{user.username}</td>
                    <td className='p-2'>{user.email}</td>
                    <td className='p-2'>
                      {user.isAdmin ? (
                        <FaCheck className='text-green-500' />
                      ) : (
                        <FaTimes className='text-red-500' />
                      )}
                    </td>
                    <td className='p-2'>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setUserIdToDelete(user._id);
                        }}
                        className='font-medium text-red-500 hover:underline cursor-pointer'
                      >
                        Delete
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-4 mt-2'
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p className='text-center mt-6 text-gray-500'>You have no users yet!</p>
      )}
      {showModal && (
        <div className='fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white dark:bg-gray-800 rounded-lg p-6 mx-4 max-w-md'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this user?
            </h3>
            <div className='flex justify-center gap-4'>
              <button
                onClick={handleDeleteUser}
                className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600'
              >
                Yes, I'm sure
              </button>
              <button
                onClick={() => setShowModal(false)}
                className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400'
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
