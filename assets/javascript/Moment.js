/* global moment firebase */

// Initialize Firebase
// Make sure to match the configuration to the script version number in the HTML
// (Ex. 3.0 != 3.7.0)
var config = {
  
    apiKey: "AIzaSyAegOBn2u7h2dzVdRAsVAK2YgM73ZqKWNM",
    authDomain: "train-scheduler-665f3.firebaseapp.com",
    databaseURL: "https://train-scheduler-665f3.firebaseio.com",
    projectId: "train-scheduler-665f3",
    storageBucket: "train-scheduler-665f3.appspot.com",
    messagingSenderId: "625710226121"
  
};

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// --------------------------------------------------------------
// Link to Firebase Database for viewer tracking


// --------------------------------------------------------------
// Initial Values
var trainName
var destination
var startTime
var freq
var nextArrival
var mins
// --------------------------------------------------------------

// Add ourselves to presence list when online.

  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
    trainName = $("#train-name-input").val().trim();
    destination = $("#desti-input").val().trim();
    startTime = $("#start-input").val().trim();
    freq = $("#freq-input").val().trim();
    // Code for the push
         database.ref().push({
          trainName:trainName,
          destination: destination,
          startTime: startTime,
         freq: freq
        });


  });

  //creat a function return minsAway
  function minsAway(f,start){
    var tFrequency = f;

    var firstTime = start;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    return tMinutesTillTrain;

  }

  //check if the function works
  console.log(minsAway(3,"18:00"))

  //give value of time of next train
  // Firebase watcher + initial loader HINT: .on("value")
  database.ref().on("child_added", function(snapshot) {
    // Log everything that's coming out of snapshot
     //console.log(snapshot.val());
     console.log(snapshot.val().trainName);
     console.log(snapshot.val().destination);
     console.log(snapshot.val().startTime);
     console.log(snapshot.val().freq);
    
     mins = minsAway(snapshot.val().freq,snapshot.val().startTime);
     nextTrain = moment().add(mins, "minutes");
     //format the nextTrain to desired format
     nextArrival = moment(nextTrain).format("hh:mm")

    // Change the HTML to reflect

    var tableRow = $("<tr>")
    tableRow.append("<td>"+snapshot.val().trainName+"</td><td>" + snapshot.val().destination +"</td><td>" + snapshot.val().freq +
        " </td><td>" +   nextArrival+"</td><td>"+mins+"</td>")
    $("tbody").append(tableRow)
  
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

  
// ----------------------------------------------------------------

//Bounus part
//1.creat a function when click on the table, added two buttons
//2.click the delete button the data will be deletted 
// 

