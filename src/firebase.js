import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyAmE-wRFe3qw0nhfSU1LhTGxI1a9ryZYQs",
    authDomain: "tiktok-f3bfa.firebaseapp.com",
    projectId: "tiktok-f3bfa",
    storageBucket: "tiktok-f3bfa.appspot.com",
    messagingSenderId: "487579548593",
    appId: "1:487579548593:web:c0c3a64550adfc3b17db90",
    measurementId: "G-S3P265Z818"
  };


const firebaseApp = firebase.initializeApp(firebaseConfig)



const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export {db,auth,storage}