import React, { useState } from "react";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [category, setCategory] = useState("uncategorized");
  const navigate = useNavigate();

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
      const res = await fetch("/api/post/create", {
        method: "POST",
        body: postFormData,
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message || "Failed to create post");
        return;
      }
      setPublishError(null);
      navigate(`/post/${data.savedPost.slug}`);
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            value={category}
            onChange={(e) => {
              const selectedCategory = e.target.value;
              setCategory(selectedCategory);
              setFormData({ ...formData, category: selectedCategory });
            }}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
            <option value="nodejs">Node.js</option>
            <option value="Mern">Mern stack</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={handleUploadImage} // Call handleUploadImage directly
          />
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
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
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
