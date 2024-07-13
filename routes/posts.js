import express from 'express';
import Post from '../models/Post.js';
import cloudinaryUploader from '../config/cloudinaryConfig.js';

const router = express.Router();

// Rotta per ottenere tutti i post con paginazione
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "createdAt";
    const sortDirection = req.query.sortDirection === "desc" ? -1 : 1;
    const skip = (page - 1) * limit;

    const posts = await Post.find({})
      .sort({ [sort]: sortDirection })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotta per ottenere un singolo post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotta per creare un nuovo post
router.post("/", cloudinaryUploader.single("cover"), async (req, res) => {
  try {
    const { readTimeValue, readTimeUnit, ...otherData } = req.body;
    const postData = {
      ...otherData,
      readTime: {
        value: readTimeValue,
        unit: readTimeUnit
      }
    };
    if (req.file) {
      postData.cover = req.file.path; // Cloudinary restituirà direttamente il suo URL
    }

    const post = new Post(postData);
    const newPost = await post.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error while saving the post:', error); // Debug: Log degli errori
    res.status(400).json({ message: error.message });
  }
});

// Rotta per aggiornare un post
router.patch("/:id", async (req, res) => {
  try {
    const { readTimeValue, readTimeUnit, ...otherData } = req.body;
    const updateData = {
      ...otherData,
      readTime: {
        value: readTimeValue,
        unit: readTimeUnit
      }
    };
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rotta per eliminare un post
router.delete("/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post eliminato" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotta per cercare i post in base al titolo
router.get("/search", async (req, res) => {
  try {
    const searchQuery = req.query.title;
    const posts = await Post.find({ title: new RegExp(searchQuery, 'i') });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
