// this will go on the server ---------

//Routes  
// require("./routes/apiRoutes")(app);
// require("./routes/htmlRoutes")(app);

// ----------------------------




// scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
// var axios = require("axios");
// var cheerio = require("cheerio");
// // Require all models
// var db = require("./models");


// // Routes   home, save, scrape --------------------------------

// // A GET route for scraping the hbr.org website


// module.exports = function (app) {
//   // Get route for scraping the hbr.org site
//   app.get("/scrape", function (req, res) {
//     //axios is grabbing the body of the html
//     axios.get("https://www.hbr.org").then(function (response) {

//       // Load the HTML into cheerio and save it to a variable
//       // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
//       var $ = cheerio.load(response.data);

//       // An empty array to save the data that is scrape
//       var results = [];

//       //  each element in the HTML body from which I want information.
//       // NOTE: Cheerio selectors function similarly to jQuery's selectors,
      
//       $(".hed").each(function (i, element) {

//         var title = $(element).find("a").text();
//         var link = $(element).find("a").attr("href");

//         // Save these results in an object that we'll push into the results array 
//         if (title && link) {
//           results.push({
//             title: title,
//             link: link
//           });
//           // Insert the data in the scrapedData db Article
//           db.Article.insert({
//             title: title,
//             link: link
//           },
//             function (err, inserted) {
//               if (err) {
//                 // Log the error if one is encountered during the query
//                 console.log(err);
//               }
//               else {
//                 // Otherwise, log the inserted data
//                 console.log(inserted);
//               }
//             });
//         }
//         console.log(results);

//       });

//       // Log the results once you've looped through each of the elements found with cheerio
//       res.send("Scrape Complete");
//     });

//   });
// }

