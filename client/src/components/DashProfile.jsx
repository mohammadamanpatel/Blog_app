import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice.js";

export const DashProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [updateUserError, setUpdateUserError] = useState(null);

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    previewImage: "",
    avatar: "",
    userId: currentUser?.user?._id || "",
  });

  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0);
  const [imageFileUploadError, setImageFileUploadError] = useState("");
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  function handleImageUpload(e) {
    e.preventDefault();
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setData({
          ...data,
          previewImage: this.result,
          avatar: uploadedImage,
        });
      });
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if (!data.username || !data.email) {
      return;
    }

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", data.avatar);

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser.user._id}`, {
        method: "PUT",
        body: formData,
      });

      const result = await res.json();
      if (result.error) {
        dispatch(updateUserFailure(result.error));
        return;
      }

      dispatch(updateUserSuccess(result));
      navigate("/");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  async function handleSignOut() {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/user/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      navigate("/login");
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  async function handleDeleteUser() {
    try {
      const res = await fetch(`/api/user/delete/${currentUser.user._id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.error) {
        console.log("Error deleting user:", result.error);
        return;
      }
      navigate("/sign-in");
    } catch (error) {
      console.log("Error in user deletion:", error);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={onFormSubmit} className="flex flex-col gap-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => document.querySelector("input[type='file']").click()}
        >
          {imageFileUploadProgress > 0 && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={
              data.previewImage || currentUser?.user?.avatar?.secure_url || ""
            }
            alt="user"
            className={`rounded-full w-full h-full object-cover border-4 border-gray-300 ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <div className="text-red-500 text-center">{imageFileUploadError}</div>
        )}
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          value={data.username}
          onChange={handleInputChange}
          className="bg-gray-100 p-2 rounded-md text-gray-700"
        />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={data.email}
          onChange={handleInputChange}
          className="bg-gray-100 p-2 rounded-md text-gray-700"
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="New Password (optional)"
          value={data.password}
          onChange={handleInputChange}
          className="bg-gray-100 p-2 rounded-md text-gray-700"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 transition duration-300"
          disabled={loading || imageFileUploading}
        >
          {loading ? "Loading..." : "Update"}
        </button>
        {currentUser?.user?.isAdmin && (
          <Link to={"/create-post"}>
            <button
              type="button"
              className="bg-gray-800 text-white p-2 rounded-md w-full hover:bg-gray-900 transition duration-300"
            >
              Create a Post
            </button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span
          onClick={() => setShowModal(true)}
          className="cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="cursor-pointer">
          Sign Out
        </span>
      </div>
      {error && (
        <div className="mt-5 bg-red-100 text-red-800 p-3 rounded-md">
          {error}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500">
                Are you sure you want to delete your account?
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDeleteUser}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Yes, I'm sure
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
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
};
