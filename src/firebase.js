// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyABnuOqs0k6MT7K8BOSsflJ83nIjyppzTE",
    authDomain: "movie-ccf82.firebaseapp.com",
    projectId: "movie-ccf82",
    storageBucket: "movie-ccf82.appspot.com",
    messagingSenderId: "747738190164",
    appId: "1:747738190164:web:dd74bcb61e46408c72b8c1",
    measurementId: "G-2H38H2Y00E"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);