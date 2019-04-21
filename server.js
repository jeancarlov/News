var express = require("express");
var logger = require("morgan");
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
app.use(logger("dev"));
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

      // Save these results in an object that we'll push into the results array 
      if (title && link) {
        results.push({
          title: title,
          link: link
        });
        // Insert the data in the scrapedData db Article
        // db.Article.insert({
        //   title: title,
        //   link: link
        // },
        //   function (err, inserted) {
        //     if (err) {
        //       // Log the error if one is encountered during the query
        //       console.log(err);
        //     }
        //     else {
        //       // Otherwise, log the inserted data
        //       console.log(inserted);
        //     }
        //   });
      }
      console.log(results);

    });

    // Log the results once you've looped through each of the elements found with cheerio
    res.send("Scrape Complete");
  });

});











//  Ending Routes Section-------------------------




// server listerning

app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});




