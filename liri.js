require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var omdbkey = keys.omdb.apikey
var axios = require('axios');
var moment = require("moment");
moment().format();

var commands = process.argv[2];
var input = process.argv[3];


switch (commands) {
    case "concert-this":
        if (process.argv.length > 3) {
            var bandSearch = [];
            for (var m = 3; m < process.argv.length; m++) {
                bandSearch.push(process.argv[m]);
            }
            bandSearch = bandSearch.join(" ");

        } else {
            bandSearch = "Metallica";
        }
        axios.get("https://rest.bandsintown.com/artists/" + bandSearch + "/events?app_id=codingbootcamp").then(function (response) {
            // console.log(response.data);
            var bandArr = [];
            for (var i = 0; i < response.data.length; i++) {
                var bandObj = {
                    venue: response.data[i].venue.name,
                    location: response.data[i].venue.country,
                    city: response.data[i].venue.city,
                    date: response.data[i].datetime
                };
                bandArr.push(bandObj);
            };
            for (var i = 0; i < bandArr.length; i++) {
                console.log("====================");
                console.log(bandSearch + ": Tour");
                console.log("Name of Venue: " + bandArr[i].venue);
                console.log("City: " + bandArr[i].city);
                console.log("Location: " + bandArr[i].location);
                var when = moment(bandArr[i].date).format("MM/DD/YYYY");
                console.log("When: " + when);
            }
        }).catch(function (err) {
            console.log(err);
            console.log("This band is not touring");
        });

        break

    case "spotify-this-song":
        if (process.argv.length > 3) {
            var songSearch = [];
            for (var m = 3; m < process.argv.length; m++) {
                songSearch.push(process.argv[m]);
            }
            songSearch = songSearch.join(" ");

        } else {
            songSearch = "La Bamba";
        };

        spotify.search({
            type: 'track',
            query: songSearch
        }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            // console.log(data.tracks.items[0]); 
            console.log("=================");
            console.log("Name: " + data.tracks.items[0].name);
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Preview Song: " + data.tracks.items[0].external_urls.spotify);
        });
        break

    case "movie-this":
        if (process.argv.length > 3) {
            var movieSearch = [];
            for (var m = 3; m < process.argv.length; m++) {
                movieSearch.push(process.argv[m]);
            }
            movieSearch = movieSearch.join(" ");

        } else {
            movieSearch = "Space Jam";
        };
        axios.get('http://www.omdbapi.com/?apikey=' + omdbkey + '&t=space+jam')
            .then(function (response) {
                // console.log(response);
                console.log("==========================");
                console.log("Movie Title: " + response.data.Title);
                console.log("Release: " + response.data.Year);
                console.log("IMDB Rating: " + response.data.imdbRating);
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                console.log("Country of Origin: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
            })
            .catch(function (error) {
                console.log(error);
            });
        break
    case "do-what-it-says":
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (error) {
                return console.log(error);
            }
            randomTextArray = data.split(",")
            userQuery = randomTextArray[1]
            switch (randomTextArray[0]) {
                case "spotify-this-song":
                    spotify.search({
                        type: 'track',
                        query: userQuery
                    }, function (err, data) {
                        if (err) {
                            return console.log('Error occurred: ' + err);
                        }
                        // console.log(data.tracks.items[0]); 
                        console.log("=================");
                        console.log("Name: " + data.tracks.items[0].name);
                        console.log("Artist: " + data.tracks.items[0].artists[0].name);
                        console.log("Album: " + data.tracks.items[0].album.name);
                        console.log("Preview Song: " + data.tracks.items[0].external_urls.spotify);
                    });
                    break
            }
        });
    }
