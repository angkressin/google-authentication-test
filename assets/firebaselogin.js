$(document).ready(function() {

  var config = {
    apiKey: "AIzaSyCiu-Fy9DUeHgMu-1KzRk3nWab9zgawgCI",
    authDomain: "sign-in-activity-f902d.firebaseapp.com",
    databaseURL: "https://sign-in-activity-f902d.firebaseio.com",
    projectId: "sign-in-activity-f902d",
    storageBucket: "sign-in-activity-f902d.appspot.com",
    messagingSenderId: "1000046306996"
  };
  firebase.initializeApp(config)

  var database = firebase.database()

  /////////// FireBase authentication

  // Initialize the FirebaseUI Widget using Firebase.
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  var uiConfig = {
  callbacks: {
    signInSuccess: function(currentUser, credential, redirectUrl) {
      // User successfully signed in.
      return true;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: 'index.html',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url.
  // tosUrl: '<your-tos-url>'
};

  ui.start('#firebaseui-auth-container', uiConfig);

})
