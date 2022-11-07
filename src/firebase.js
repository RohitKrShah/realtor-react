// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbRhtWhYfMWao1UEYVG4o8hx8S1y8wb3M",
  authDomain: "realtor-react-38789.firebaseapp.com",
  projectId: "realtor-react-38789",
  storageBucket: "realtor-react-38789.appspot.com",
  messagingSenderId: "37435538899",
  appId: "1:37435538899:web:cebdd20b2c0172d502c326",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
