import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var config = {
    apiKey: "AIzaSyClC3QvpVdXOyaKZOcagqjODAF2uDLWlM8",
    authDomain: "react-slack-clone-a4a0c.firebaseapp.com",
    databaseURL: "https://react-slack-clone-a4a0c-default-rtdb.firebaseio.com/",
    projectId: "react-slack-clone-a4a0c",
    storageBucket: "react-slack-clone-a4a0c.appspot.com",
    messagingSenderId: "919140021960",
    appId: "1:919140021960:web:3203d91e2e1604922417fd",
    measurementId: "G-Z72VRZK9RH"
  };
  // Initialize Firebase
  firebase.initializeApp(config);
  //firebase.analytics();

  export default firebase;