// services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDLqzSdSMS2BhMOmZtyzcZniUH608OtJ40",
  authDomain: "recicla-arcoverde.firebaseapp.com",
  projectId: "recicla-arcoverde",
  storageBucket: "recicla-arcoverde.firebasestorage.app",
  messagingSenderId: "594597215919",
  appId: "1:594597215919:web:48b8d31c9a4ae72a13de5a",
  measurementId: "G-33J95SXQXE"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Obtenha a referência de autenticação
const auth = getAuth(app);

export { auth };
