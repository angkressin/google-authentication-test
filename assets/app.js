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

  ////// sign-in
  $("#signInSubmit").on("click", function(event) {
    event.preventDefault();
    var email = $("#email").val().trim()
    var password = $("#password").val().trim()
    // Sign in existing user
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
    window.location.replace("index.html");

  })

  /////////// validate email address
  $("#signUpSubmit").on("click", function(event) {
    event.preventDefault();
    checkEmail()
    checkPassword()
    var email = $("#email").val().trim()
    var password = $("#password").val().trim()
    // Register a new user
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
    window.location.replace("index.html");
  })

  // add signout button and pass in this { firebase.auth().signOut()}
  $("#logoutButton").on("click", function(event){
    event.preventDefault();
    firebase.auth().signOut()
    firebase.auth().signOut().then(function() {
  window.location.replace("login.html")
}).catch(function(error) {
  console.log("test log out error")
});
  })
//
//
// Add a realtime listener
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    console.log(user)
    // show log out in the index.html
    // ...
  } else {
    console.log("not logged in")
    // if they are not logged in, don't show log out in the index.html
  }
});

  var ok = 0;

  function checkEmail() {
    var email_val = $("#email").val().trim();
    if (email_val == "" || email_val.indexOf("@") == -1 || email_val.indexOf(".") == -1) {
      $("#email").css({
        "border": "1px solid red"
      });
      $("#email_error").text("Please enter a valid email address");
      $("#email_error").css({
        "margin-top": "5px"
      });
    } else {
      $("#email").css({
        "border": "1px solid grey"
      });
      $("#email_error").text("");
      $("#email_error").css({
        "margin-top": "0px"
      });
      ok++;
    }
  }

  function checkPassword() {
    var pass_val = $("#password").val();
    if (pass_val == "" || pass_val.length < 4) {
      $("#password").css({
        "border": "1px solid red"
      });
      $("#password_error").text("Password at least 3 charaters");
      $("#password_error").css({
        "margin-top": "5px"
      });
    } else {
      $("#password").css({
        "border": "1px solid grey"
      });
      $("#password_error").text("");
      $("#password_error").css({
        "margin-top": "0px"
      });
      ok++;
    }
  }


  //////////// ---------------------------- //////////////
  $(".trainSubmit").on("click", function(event) {
    event.preventDefault();
    var name = $("#trainNameForm").val()
    var destination = $("#destinationForm").val()
    var firstTrain = $("#firstTrainForm").val()
    var frequency = $("#frequencyForm").val()
    database.ref().push({
      name: name,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    })
    alert("Employee successfully added")
    $("#trainNameForm").val("")
    $("#destinationForm").val("")
    $("#firstTrainForm").val("")
    $("#frequencyForm").val("")
  })


  //function to retrieve data
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
    var db = childSnapshot.val()
    renderTable(db)
  })

  function renderTable(db) {
    // convert time to minutes
    var firstTrainInMins = moment.duration(db.firstTrain).asMinutes()
    console.log("train time in minutes:", firstTrainInMins)
    // capture now and convert to military and then to minutes
    var now = moment()
    var nowinMilitary = moment(now).format("HH:mm")
    var nowinMinutes = moment.duration(nowinMilitary).asMinutes()
    // find the difference in time to get next train time and mins away
    var diff = moment(nowinMinutes).diff(firstTrainInMins)
    console.log("time diff:", diff)
    var nextTrainTimeinMins
    var minsAway
    console.log("time now in minutes:", nowinMinutes)
    if (firstTrainInMins > nowinMinutes) {
      nextTrainTimeinMins = firstTrainInMins
      minsAway = Math.abs(nextTrainTimeinMins - nowinMinutes)
    } else {
      minsAway = db.frequency - (diff % db.frequency)
      nextTrainTimeinMins = nowinMinutes + minsAway
    }
    console.log("next train time in mins:", nextTrainTimeinMins)
    console.log("mins away:", minsAway)
    // convert the next train time to military time format
    var nextTrainTime = moment().startOf('day').add(nextTrainTimeinMins, 'minutes').format("HH:mm")
    console.log("next train in 24h:", nextTrainTime)
    var tBody = $("tbody")
    var tRow = $("<tr>")
    var nameTd = $("<td>").text(db.name)
    var destinationTd = $("<td>").text(db.destination)
    var frequencyTd = $("<td>").text(db.frequency)
    var nextArrivalTd = $("<td>").text(nextTrainTime)
    var minutesAwayTd = $("<td>").text(minsAway)
    tRow.append(nameTd, destinationTd, frequencyTd, nextArrivalTd, minutesAwayTd)
    tBody.append(tRow);
  }

  // function to update the train time change every minute
  setInterval(function() {
    var currentTime = moment().format("HH:mm:ss")
    // if the minutes change, seconds should be at 00
    if (currentTime.endsWith("00")) {
      $("tbody").empty()
      database.ref().on("child_added", function(childSnapshot, prevChildKey) {
        var db = childSnapshot.val()
        renderTable(db)
      })
    }
  }, 1000)

  // function to generate and initiate clock countdown flip
  function countDownDisplay() {
    var clock
    // Instantiate a countdown FlipClock
    clock = $('.clock').FlipClock({
      clockFace: 'TwentyFourHourClock'
    });
  };

  countDownDisplay()

})
