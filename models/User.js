// Importa il modulo Mongoose per la gestione del database MongoDB
import { Schema, model } from "mongoose";

// Definizione dello schema dell'utente utilizzando il costruttore Schema di Mongoose
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
  },
  lastName: {
      type: String ,
      required: true

  },
  email: {
      type: String ,
      required: true

  }, 
  birthday: {
      type: String,
      required: true

  },
  avatar: {
      type: String,
      required: true

  }
  },
  {
    // Opzioni dello schema:
    collection: "users", // Specifica il nome della collezione nel database MongoDB
  }
);

// Esporta il modello 'User' utilizzando il metodo model di Mongoose
// Il modello 'User' sarà basato sullo schema 'userSchema' definito sopra
const User = model("User", userSchema);
export default User;