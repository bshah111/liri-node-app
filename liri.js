require("dotenv").config();
var keys = require('./keys.js');
var fs = require('fs');
var request = require("request");
var axios = require("axios");
var Spotify = require('node-spotify-api');
var moment = require('moment')
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var searchValue = process.argv[3];

var artist = ""

// Puts together the search value into one string
for (var i = 4; i < process.argv.length; i++) {
    searchValue += '+' + process.argv[i];
}
// -------------------- do-what-it-says ----------------------------
function randomSearch() {
    fs.readFile('random.txt', "utf8", function (err, data) {

        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        var array = data.split(",");
        if (array[0] === "spotify-this-song") {
            var songcheck = array[1].trim().slice(1, -1);
            searchSong(songcheck);
        }

    })
}
// -------------------- axios movie-this ----------------------------
function searchMovie(searchValue) {
    if (command === 'movie-this') {
        var movie = "";
        for (var i = 3; i < process.argv.length; i++) {
            movie += process.argv[i];
        }
    }
    else {
        movie = searchValue;
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(
        function (response) {
            console.log("Title: " + response.data.Title)
            console.log("Year: " + response.data.Year)
            console.log("IMDB Rating: " + response.data.imdbRating)
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value)
            console.log("Country: " + response.data.Country)
            console.log("Language: " + response.data.Language)
            console.log("Plot: " + response.data.Plot)
            console.log("Actors: " + response.data.Actors)
        }
    );
}
// -------------------- axios concert-this ----------------------------

function searchConcert(searchValue) {
    if (command === 'concert-this') {
        var artist = "";
        for (var i = 3; i < process.argv.length; i++) {
            artist += process.argv[i];
        }
    }
    else {
        artist = searchValue;
    }
    var queryUrl = ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    axios.get(queryUrl).then(
        function (response) {
            console.log("Name Of Venue: " + response.data[i].venue.name);
            console.log("Location Of Venue: " + response.data[i].venue.city)
            console.log("Date Of Event: " + moment(response.data[i].datetime).format("MM/DD/YYYY"))
        }
    );
}

// -------------------- Spotify spotify-this-song ----------------------------
function searchSong(searchValue) {

    // Default search value if no song is given
    if (searchValue == "") {
        searchValue = "The Sign Ace of Base";
    }
    spotify.search({ type: 'track', query: searchValue }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        var song = data.tracks.items[0];
        console.log("------Artists-----");
        for (i = 0; i < song.artists.length; i++) {
            console.log("Artist: " + song.artists[i].name);
            console.log("Song: " + song.name)
            console.log("Preview-Url: " + song.album.href)
            console.log("Album: " + song.album.name)
        }
    }

    )
}
// Runs corresponding function based on user command
switch (command) {
    case "concert-this":
        searchConcert(searchValue);
        break;
    case "spotify-this-song":
        searchSong(searchValue);
        break;
    case "movie-this":
        searchMovie(searchValue);
        break;
    case "do-what-it-says":
        randomSearch();
        break;
    default:
        console.log("\nI'm sorry, " + command + " is not a command that I recognize. Please try one of the following commands: \n\n  1. To search random: node liri.js do-what-it-says \n\n  2. To search a movie title: node liri.js movie-this (with a movie title following) \n\n  3. To search Spotify for a song: node liri.js spotify-this-song (with a song title following)\n\n  4. To search a concert playing: node liri.js concert-this (with artist name following)\n");
};
