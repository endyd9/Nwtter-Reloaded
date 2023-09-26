// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDeMNQPP67jzz1wWIHb4cs09A_0Q_fZjCU",
  authDomain: "nwtter-31c7d.firebaseapp.com",
  projectId: "nwtter-31c7d",
  storageBucket: "nwtter-31c7d.appspot.com",
  messagingSenderId: "701984346300",
  appId: "1:701984346300:web:fbc8c50c5fc833d4dcc0b9",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
