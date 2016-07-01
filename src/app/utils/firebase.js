import firebase from 'firebase'



export const getFirebase = () => {
  // Initialize Firebase
  var config = {
  	apiKey: 'AIzaSyBZhtrbo4O1preOARIAoSsUXDepZW13k6g',
  	authDomain: 'idealgardens-codeword.firebaseapp.com',
  	databaseURL: 'https://idealgardens-codeword.firebaseio.com',
  	storageBucket: 'idealgardens-codeword.appspot.com'
  }

  firebase.initializeApp(config)
  return firebase.database()
}
