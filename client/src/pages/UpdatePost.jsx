import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdatePost({ initialData }) {
  const [file, setFile] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState(initialData || {});
  const [updateError, setUpdateError] = useState(null);
  const [category, setCategory] = useState("uncategorized");
  const navigate = useNavigate();
  const postId = useParams();
  console.log("postId", postId);
  console.log("formData", formData);

  function handleUploadImage(e) {
    e.preventDefault();
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const fileReader = new FileReader();
      fileReader.onload = function () {
        setFormData({
          ...formData,
          image: fileReader.result,
        });
      };
      fileReader.readAsDataURL(uploadedFile);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postFormData = new FormData();
      postFormData.append("title", formData.title);
      postFormData.append("content", formData.content);
      postFormData.append("category", formData.category);
      if (file) {
        postFormData.append("image", file);
      }
      const res = await fetch(`/api/post/updatepost/${postId.postId}`, {
        method: "PUT",
        body: postFormData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      console.log("data in update post", data);
      if (!res.ok) {
        setUpdateError(data.message || "Failed to update post");
        return;
      }
      setUpdateError(null);
      navigate(`/post/${data.updatedPost.slug}`);
    } catch (error) {
      setUpdateError("Something went wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
            value={formData.title || ""}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <select
            value={category}
            onChange={(e) => {
              const selectedCategory = e.target.value;
              setCategory(selectedCategory);
              setFormData({ ...formData, category: selectedCategory });
            }}
            className="flex-1 px-4 py-2 border border-gray-700 rounded-lg text-gray-900"
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
            <option value="nodejs">Node.js</option>
            <option value="Mern">Mern stack</option>
          </select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadImage}
            className="file-input text-gray-900"
          />
        </div>
        {imageUploadError && (
          <div className="text-red-500">{imageUploadError}</div>
        )}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12 text-white-900"
          value={formData.content || ""}
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700"
        >
          Update
        </button>
        {updateError && <div className="mt-5 text-red-500">{updateError}</div>}
      </form>
    </div>
  );
}
