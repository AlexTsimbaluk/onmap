import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyCXV8hHfiUzTVhuI71syEOejIneF3n1r5w",
  authDomain: "map-notes-5f629.firebaseapp.com",
  databaseURL: "https://map-notes-5f629.firebaseio.com",
  projectId: "map-notes-5f629",
  storageBucket: "map-notes-5f629.appspot.com",
  messagingSenderId: "415342811462",
  appId: "1:415342811462:web:bf1b2f8612080353c56d47",
  measurementId: "G-TMVZ8V8D81"
};

const fire = firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export default fire;