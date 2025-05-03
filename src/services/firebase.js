// services/firebase.js

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDLqzSdSMS2BhMOmZtyzcZniUH608OtJ40",
  authDomain: "recicla-arcoverde.firebaseapp.com",
  projectId: "recicla-arcoverde",
  storageBucket: "recicla-arcoverde.firebasestorage.app",
  messagingSenderId: "594597215919",
  appId: "1:594597215919:web:48b8d31c9a4ae72a13de5a"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { auth };
