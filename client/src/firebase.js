import { initializeApp } from "firebase/app";
import apiKey from "./config.js";

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "mern-estate-1e7c6.firebaseapp.com",
  projectId: "mern-estate-1e7c6",
  storageBucket: "mern-estate-1e7c6.appspot.com",
  messagingSenderId: "876651159558",
  appId: "1:876651159558:web:055cce3f432886b1aba387",
};

export const app = initializeApp(firebaseConfig);
