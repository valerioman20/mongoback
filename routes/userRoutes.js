import express from "express";
import User from "../models/User.js"; // Importa il modello User
import Post from "../models/Post.js"; // Importa il modello Post

const router = express.Router(); // Crea un router Express

// Rotta per ottenere gli utenti con PAGINAZIONE
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "name";
    const sortDirection = req.query.sortDirection === "desc" ? -1 : 1;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .sort({ [sort]: sortDirection })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotta per ottenere un singolo utente
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotta per ottenere i post di un autore specifico
router.get("/:id/blogPosts", async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ user: userId });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotta per creare un nuovo utente
router.post("/", async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();

  const userResponse = newUser.toObject();
  delete userResponse.password;


    res.status(201).json(userResponse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rotta per aggiornare un utente
router.patch("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rotta per eliminare un utente
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Utente Eliminato" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
