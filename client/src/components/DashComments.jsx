import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.user.isAdmin) {
      fetchComments();
    }
  }, [currentUser.user._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="mx-auto overflow-x-auto">
      {currentUser.user.isAdmin && comments.length > 0 ? (
        <>
          <table className="min-w-full shadow-md table-auto">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="py-2 px-4 text-left">Date updated</th>
                <th className="py-2 px-4 text-left">Comment content</th>
                <th className="py-2 px-4 text-left">Number of likes</th>
                <th className="py-2 px-4 text-left">PostId</th>
                <th className="py-2 px-4 text-left">UserId</th>
                <th className="py-2 px-4 text-left">Delete</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr
                  key={comment._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <td className="py-2 px-4">
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">{comment.content}</td>
                  <td className="py-2 px-4">{comment.numberOfLikes}</td>
                  <td className="py-2 px-4">{comment.postId}</td>
                  <td className="py-2 px-4">{comment.userId}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer focus:outline-none"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-2 mt-4 focus:outline-none"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">You have no comments yet!</p>
      )}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg text-center p-6 shadow-lg">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteComment}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
              >
                Yes, I'm sure
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
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
