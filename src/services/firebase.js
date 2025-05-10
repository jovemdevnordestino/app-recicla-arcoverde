// Importando as funções do Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDLqzSdSMS2BhMOmZtyzcZniUH608OtJ40",
  authDomain: "recicla-arcoverde.firebaseapp.com",
  projectId: "recicla-arcoverde",
  storageBucket: "recicla-arcoverde.appspot.com",
  messagingSenderId: "594597215919",
  appId: "1:594597215919:web:48b8d31c9a4ae72a13de5a"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);

// Inicializando o Auth e Firestore
const auth = getAuth(app);
const firestore = getFirestore(app);
const db = getFirestore(app);

// Exportando para uso nos componentes
export { app, auth, firestore, db };
