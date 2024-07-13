import express from 'express';
import User from '../models/User.js'; 
import { generateJWT } from '../utils/jwt.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';


const router = express.Router();

// POST /login => restituisce token di accesso
router.post('/login', async (req, res) => {
  try {
    // Estrae email e password dal corpo della richiesta
    const { email, password } = req.body;

    // Cerca l'utente nel database usando l'email
    const user = await User.findOne({ email });
    if (!user) {
      // Se l'utente non viene trovato, restituisce un errore 401
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    // Verifica la password usando il metodo comparePassword definito nel modello User
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Se la password non corrisponde, restituisce un errore 401
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    // Se le credenziali sono corrette, genera un token JWT
    const token = await generateJWT({ id: user._id });

    // Restituisce il token e un messaggio di successo
    res.json({ token, message: "Login effettuato con successo" });
  } catch (error) {
    // Gestisce eventuali errori del server
    console.error('Errore nel login:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
});

// GET /me => restituisce l'utente collegato al token di accesso
// authMiddleware verifica il token e aggiunge i dati dell'utente a req.user
router.get('/me', authMiddleware, (req, res) => {
  // Converte il documento Mongoose in un oggetto JavaScript semplice
  const userData = req.user.toObject();
  // Rimuove il campo password per sicurezza
  delete userData.password;
  // Invia i dati dell'utente come risposta
  res.json(userData);
});

export default router;