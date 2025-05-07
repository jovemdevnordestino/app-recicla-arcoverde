// Importando funções do Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDLqzSdSMS2BhMOmZtyzcZniUH608OtJ40",
  authDomain: "recicla-arcoverde.firebaseapp.com",
  projectId: "recicla-arcoverde",
  storageBucket: "recicla-arcoverde.appspot.com",
  messagingSenderId: "594597215919",
  appId: "1:594597215919:web:48b8d31c9a4ae72a13de5a"
};

// Inicializando Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Exportando apenas o que é usado
export { app, auth };
