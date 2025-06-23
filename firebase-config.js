import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAE1cEhSkn7VcweOMEYxXwBu4eiIVHE4Rg",
  authDomain: "collaborative-whiteboard-b5400.firebaseapp.com",
  databaseURL: "https://collaborative-whiteboard-b5400-default-rtdb.firebaseio.com",
  projectId: "collaborative-whiteboard-b5400",
  storageBucket: "collaborative-whiteboard-b5400.firebasestorage.app",
  messagingSenderId: "1025566755171",
  appId: "1:1025566755171:web:253a8b2728ce658cba2b56",
  measurementId: "G-C83DB89VSL"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };