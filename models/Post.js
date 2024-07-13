import { Schema, model } from "mongoose";

// Definizione dello schema del post
const postSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    readTime: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
    },
    author: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    collection: "posts",
    timestamps: true, // Aggiunge i campi createdAt e updatedAt automaticamente
  }
);

// Esporta il modello 'Post' utilizzando il metodo model di Mongoose
const Post = model("Post", postSchema);
export default Post;
