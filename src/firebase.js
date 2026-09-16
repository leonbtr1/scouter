import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyArJJI1SM0ULp_VVyOoivggSy_2iuuTtrg",
  authDomain: "scouter-d6805.firebaseapp.com",
  projectId: "scouter-d6805",
  storageBucket: "scouter-d6805.firebasestorage.app",
  messagingSenderId: "2400458431",
  appId: "1:2400458431:web:74338bb6d6e44e033c580a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };