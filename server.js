var express = require("express");
// var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars")
// scraping tools
var axios = require("axios");
var cheerio = require("cheerio");
// Require all models
var db = require("./models");

// Dynamic port to deploy with heroku.
var PORT = process.env.PORT || 3000;


// Initialize Express
var app = express();

// Configure middleware -------------

// morgan logger for logging requests 
// app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
// --------------------------------------
// Set Handlebars.
var exphbs = require("express-handlebars");
// defaul layout- main with handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// 
app.set("view engine", "handlebars");

// Connect to the Mongo DB first
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
// This code should connect mongoose to my remote mongolab database if deployed, but otherwise will connect to the local mongoHeadlines database on my computer.
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

//  Starting Routes Section-------------------------

// Get route for scraping the hbr.org 

app.get("/scrape", function (req, res) {
  //axios is grabbing the body of the html
  axios.get("https://www.hbr.org").then(function (response) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);

    // An empty array to save the data that is scrape
    var results = [];

    //  each element in the HTML body from which I want information.
    // NOTE: Cheerio selectors function similarly to jQuery's selectors,

    $(".hed").each(function (i, element) {

      var title = $(element).find("a").text();
      var link = $(element).find("a").attr("href");
      // var summary = $(element).find("div.dek").text();

      // Save these results in an object that we'll push into the results array 
      if (title && link)  {
        results.push({
          title: title,
          link: link,
          // summary: summary
        });
        // Insert the data in the scrapedData db Article
        db.Article.create({
          title: title,
          link: link,
          // summary: summary
        },
          function (err, inserted) {
            if (err) {
              // Log the error if one is encountered during the query
              console.log(err);
            }
            else {
              // Otherwise, log the inserted data
              console.log(inserted);
            }
          });
      }
      console.log(results);
      res.render("scrape",{results: results});
    });
  });
  // Log the results once you've looped through each of the elements found with cheerio
  //res.send("Scrape Complete");
 
});



// app.get("/"), function (req, res) {
//   res.render("index");
// }




// Route for getting all Articles from the db
app.get("/saved", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      console.log(dbArticle);

      // If we were able to successfully find Articles, send them back to the client
      // res.json(dbArticle);
      res.render("saved", {
        saved: dbArticle
      });
    })
  .catch(function (err) {
    // If an error occurred, send it to the client
    res.json(err);

  });
});


// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  console.log(req.params.id);

  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      console.log(dbArticle);
      // res.json(dbArticle);
      res.render("articles",{
        data: dbArticle
      })

    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// post(create) ------
//Route for creating an Article in the db
app.post("/api/saved", function (req, res) {
  db.Article.create(req.body)
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {  // saveid
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      console.log(dbArticel);

      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// delete article id
app.post("/articles/:id", function (req, res) {
  db.Article.deleteOne({ _id: req.params.id })
    .then(function (removed) {
      res.json(removed);
    }).catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    })
});













//  Ending Routes Section-------------------------




// server listerning

app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});




