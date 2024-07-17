import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCcTFFGhSbI83WEsPOm7IArHt8oVIcw1jk",
  authDomain: "upload-image-sell.firebaseapp.com",
  projectId: "upload-image-sell",
  storageBucket: "upload-image-sell.appspot.com",
  messagingSenderId: "579995976992",
  appId: "1:579995976992:web:7b3d038c7a71a39c7e8345",
  measurementId: "G-E4333D90N3",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default storage;
