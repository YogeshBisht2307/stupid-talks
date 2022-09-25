import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCfaDf9KByvCfRkF6qwDQSNn9ro7UEXVZQ",
  authDomain: "chat-kodeweich.firebaseapp.com",
  projectId: "chat-kodeweich",
  storageBucket: "chat-kodeweich.appspot.com",
  messagingSenderId: "604326248133",
  appId: "1:604326248133:web:f34bc2735507d3f9f7faac",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
