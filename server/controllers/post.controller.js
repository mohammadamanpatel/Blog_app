import Post from "../models/post.model.js";
import uploadImageToCloudinary from "../utils/uploadImageToCloudinary.js";
import multer from "multer";
import fs from "fs";
import deleteImageFromCloudinary from "../utils/deleteImageFromCloudinary.js";

const upload = multer({ dest: "uploads/" }); // Assuming 'uploads/' is your upload directory

export const create = async (req, res) => {
  upload.single("image");

  if (!req.user.isAdmin) {
    return res.status(403).json({
      message: "You are not allowed to create a post",
    });
  }

  if (!req.body.title || !req.body.content) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  try {
    let imageUrl = null;
    if (req.file) {
      const cloudinaryResponse = await uploadImageToCloudinary(
        req.file.path,
        "posts"
      );
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
      imageUrl = {
        public_id: cloudinaryResponse.public_id,
        secure_url: cloudinaryResponse.secure_url,
      };
    }

    const newPost = new Post({
      userId: req.user.id,
      content: req.body.content,
      title: req.body.title,
      image: imageUrl,
      category: req.body.category || "uncategorized",
      slug,
    });

    const savedPost = await newPost.save();
    res.status(201).json({ savedPost, message: "Post created successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};

export const updatepost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { title, content, category } = req.body;

    if (!req.user.isAdmin) {
      return res.status(403).json({
        message: "You are not allowed to update this post",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;

    if (req.file) {
      try {
        const cloudinaryResponse = await uploadImageToCloudinary(
          req.file.path,
          "posts"
        );

        if (post.image && post.image.public_id) {
          await deleteImageFromCloudinary(post.image.public_id);
        }

        post.image = {
          public_id: cloudinaryResponse.public_id,
          secure_url: cloudinaryResponse.secure_url,
        };

        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload image to Cloudinary",
          error: error.message,
        });
      }
    }

    const updatedPost = await post.save();
    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getposts = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
      
    const totalPosts = await Post.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
      message: "Internal server error",
    });
  }
};

export const deletepost = async (req, res) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return res.status(404).json({
      message: "You have no authority to delete",
    });
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("The post has been deleted");
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};
