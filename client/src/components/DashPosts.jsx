import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  console.log("userPosts",userPosts);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `/api/post/getposts`
        );
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.user.isAdmin) {
      fetchPosts();
    }
  }, []);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser.user._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser.user._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-4 mx-auto overflow-x-auto">
      {currentUser.user.isAdmin && userPosts.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 table-auto">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="py-2 px-4 text-left text-gray-800 dark:text-gray-200">Date Updated</th>
                  <th className="py-2 px-4 text-left text-gray-800 dark:text-gray-200">Post Image</th>
                  <th className="py-2 px-4 text-left text-gray-800 dark:text-gray-200">Post Title</th>
                  <th className="py-2 px-4 text-left text-gray-800 dark:text-gray-200">Category</th>
                  <th className="py-2 px-4 text-left text-gray-800 dark:text-gray-200">Delete</th>
                  <th className="py-2 px-4 text-left text-gray-800 dark:text-gray-200">Edit</th>
                </tr>
              </thead>
              <tbody>
                {userPosts.map((post) => (
                  <tr key={post._id} className="border-b">
                    <td className="py-2 px-4">{new Date(post.updatedAt).toLocaleDateString()}</td>
                    <td className="py-2 px-4">
                      <Link to={`/post/${post.slug}`}>
                        <img
                          src={post.image.secure_url}
                          alt={post.title}
                          className="w-20 h-10 object-cover"
                        />
                      </Link>
                    </td>
                    <td className="py-2 px-4">
                      <Link className="text-blue-500 hover:underline" to={`/post/${post.slug}`}>
                        {post.title}
                      </Link>
                    </td>
                    <td className="py-2 px-4">{post.category}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setPostIdToDelete(post._id);
                        }}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                    <td className="py-2 px-4">
                      <Link className="text-teal-500 hover:underline" to={`/update-post/${post._id}`}>
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-blue-500 py-2 mt-4"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p className="text-gray-800 dark:text-gray-200">You have no posts yet!</p>
      )}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this post?
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDeletePost}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Yes, I'm sure
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
