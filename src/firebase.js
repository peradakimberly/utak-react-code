import {initializeApp} from "firebase/app";
import {getFirestore} from "@firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyCt6J_GPfDHU6sQlt_fgdrezhNggt_fpKE",
    authDomain: "utak-react-2e52f.firebaseapp.com",
    databaseURL: "https://utak-react-2e52f-default-rtdb.firebaseio.com",
    projectId: "utak-react-2e52f",
    storageBucket: "utak-react-2e52f.appspot.com",
    messagingSenderId: "929510885271",
    appId: "1:929510885271:web:26ece72f7f8acc23d726d2"
  };

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)