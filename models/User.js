// Importa il modulo Mongoose per la gestione del database MongoDB
import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt'; // NEW! Importa bcrypt per l'hashing delle password

// Definizione dello schema dell'utente utilizzando il costruttore Schema di Mongoose
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }, 
    birthday: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    // Opzioni dello schema:
    collection: "users", // Specifica il nome della collezione nel database MongoDB
  }
);

// Metodo per confrontare la password fornita con quella hashata nel database
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Middleware per l'hashing delle password prima del salvataggio
userSchema.pre('save', async function(next) {
  // Esegui l'hashing solo se la password è stata modificata (o è nuova)
  if (!this.isModified('password')) return next();

  try {
    // Genera un salt (un valore casuale per rendere l'hash più sicuro)
    const salt = await bcrypt.genSalt(10);
    // Crea l'hash della password usando il salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Passa eventuali errori al middleware successivo
  }
});

// Creazione del modello utente basato sullo schema
const User = model("User", userSchema);

export default User;