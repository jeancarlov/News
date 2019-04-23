// Grab the save articles as a json
// $.getJSON("/saved", function (data) {
//   // For each one
//   for (var i = 0; i < data.length; i++) {
//     // Display the apropos information on the page
//     $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//   }
// });

// Query on Scrape articles
$(document).on("click", "#scrape-button", function () {
  $.ajax({
    method:"GET",
    url: "/scrape"
  }).then(function(){
    window.location.reload();
  })
});

// Query on  saved articles button
$(document).on("click", "#save-article", function () {
   // Grab the id associated with the article from save button
   var thisId =$(this).attr("data-id");
   $(this).hide();
   var data = {}
   data.link = $("#article-link-sec")
   data.title = $("#article-title-sec").attr()
   $.ajax({
     method:"GET",
     url: "/save" + id// in server.js  we need a route to /save/:id 
   }).then(function(){
     window.location.reload();
   })
});


 

  // Query on  delete articles button
$(document).on("click", "#delete-button", function () {
  var thisId =$(this).attr("data-_id");
  console.log(thisId);
  $.ajax({
    method:"DELETE",
    url: "/articles/" + thisId// in server.js  we need a route to /articles/:id 
  }).then(function(){
    window.location.reload();
  })
  
});

// Query on articles notes button
 //  server.js  we need a route to /articles/:id with the Post method
$(document).on("click", "#article-notes", function () {
  var thisId =$(this).attr("data-_id");
  $.ajax({
    method:"POST",
    url: "/articles/" + thisId,
    // data:{
    //   // title input
    //   title:,
    //   //body
    //   body:
    // }
   
  }).then(function(){
    window.location.reload();
  })
});

// Query on  saved articles button
$(document).on("click", "#save-article", function () {
  
});










// Notes Section

// When you click the submitnote button

$(document).on("click", "#submit-note", function() {
// Grab the id associated with the article from the summit button
var thisId = $(this).attr("data-id");

// Run a POST request to change the note, using what's entered in the inputs
$.ajax({
  method: "POST",
  url: "/articles/" + thisId,
  data: {
    // Value taken from title input
    title: $("#titleinput").val(),
    // Value taken from note textarea
    body: $("#bodyinput").val()
  }
})
  // With that done
  .then(function(data) {
    // Log the response
    console.log(data);
    // Empty the notes section
    $("#notes").empty();
  });

// Also, remove the values entered in the input and textarea for note entry
$("#titleinput").val("");
$("#bodyinput").val("");
});

//delete note

$(document).on("click", "#delete-note", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })


});