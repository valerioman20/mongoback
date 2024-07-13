import { verifyJWT } from '../utils/jwt.js';
import User from '../models/User.js';

// Middleware di autenticazione
export const authMiddleware = async (req, res, next) => {
    try {
      // Estrai il token dall'header Authorization
      // L'operatore ?. (optional chaining) previene errori se authorization è undefined
      // replace('Bearer ', '') rimuove il prefisso 'Bearer ' dal token
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      // Se non c'è un token, restituisci un errore 401 (Unauthorized)
      if (!token) {
        return res.status(401).send('Token mancante');
      }
  
      // Verifica e decodifica il token usando la funzione verifyJWT
      // Se il token è valido, decoded conterrà il payload del token (es. { id: '123' })
      const decoded = await verifyJWT(token);
  
      // Usa l'ID dell'utente dal token per trovare l'utente nel database
      // .select('-password') esclude il campo password dai dati restituiti
      const user = await User.findById(decoded.id).select('-password');
      
      // Se l'utente non viene trovato nel database, restituisci un errore 401
      if (!user) {
        return res.status(401).send('Utente non trovato');
      }
  
      // Aggiungi l'oggetto user alla richiesta
      // Questo rende i dati dell'utente disponibili per le route successive
      req.user = user;
  
      // Passa al prossimo middleware o alla route handler
      next();
    } catch (error) {
      // Se c'è un errore durante la verifica del token o nel trovare l'utente,
      // restituisci un errore 401
      res.status(401).send('Token non valido');
    }
  };