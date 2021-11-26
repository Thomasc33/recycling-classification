import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjQJ_IxN6TnaH7acSqZUDD9ibNDpVuMKg",
  authDomain: "recycling-classification-6db68.firebaseapp.com",
  projectId: "recycling-classification-6db68",
  storageBucket: "recycling-classification-6db68.appspot.com",
  messagingSenderId: "98201318374",
  appId: "1:98201318374:web:b711abcf82edf60a06dc27",
  measurementId: "G-8ELYNE3D9K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);