var twiKeys = require('./keys.js');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require("request");
var fs = require("fs");
var command = process.argv[2];

function Tweets() {
    var client = new Twitter({
        consumer_key: twiKeys.twitterKeys.consumer_key,
        consumer_secret: twiKeys.twitterKeys.consumer_secret,
        access_token_key: twiKeys.twitterKeys.access_token_key,
        access_token_secret: twiKeys.twitterKeys.access_token_secret
    });
    var params = { screen_name: 'Saul_Valo', count: 20 };

    client.get('statuses/user_timeline', params, function(err, tweet, response) {
        if (!err) {
            console.log("===========================");
            for (var i = 0; i < tweet.length; i++) {
                var username = tweet[i].user.name;
                var textTweet = tweet[i].text;
                var timeTweet = tweet[i].created_at;
                console.log(username + " tweeted, '" + textTweet + "' on " + timeTweet + ".");
            }
            console.log("===========================");
        }
    });
}


function spotifySearch(songInput) {

    spotify.search({ type: 'track', query: songInput }, function(err, data) {
        console.log("===========================");

        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else if (data.tracks.items.length === 0) {
            console.log("Please provide a valid Song, searching for stored song");
            spotifySearch("The Sign Ace Of Base");
            return;
        } else if (!err) {

            var song = data.tracks.items[0].name;
            var urlSong = data.tracks.items[0].preview_url;
            var albumInfo = data.tracks.items[0].album.name;
            var artist = data.tracks.items[0].artists;
            var artistsArr = [];

            for (var i = 0; i < artist.length; i++) {
                var art = data.tracks.items[0].artists[i].name;
                artistsArr.push(art);
            }
            console.log("Artists: " + artistsArr.join(" & "));
            console.log("Song Title: " + song);
            console.log("Preview Location : " + urlSong);
            console.log("Album Information: " + albumInfo);
        }

        console.log("===========================");

    });

}

function movieSearch(mov) {
    // if no movie is input default to 'Mr. Nobody.'
    if (mov === '') {
        mov = 'Mr. Nobody.';
    }
    // request parameter to make omdb request
    var url = "http://www.omdbapi.com/?t=" + mov + "&y=&plot=short&r=json";

    // request method makes request and console logs response properties
    request.get(url, function(err, response, body) {
        if (err) {
            return console.error(err);
        }
        console.log("--------------------------------");
        console.log("\nTitle: " + JSON.parse(body).Title + "\nYear Released: " + JSON.parse(body).Year + "\nIMDB Rating: " + JSON.parse(body).imdbRating + "\nProduced In: " + JSON.parse(body).Country + "\nLanguage(s): " + JSON.parse(body).Language + "\nActors: " + JSON.parse(body).Actors + "\nPlot: " + JSON.parse(body).Plot + "\nPlot: " + JSON.parse(body).Plot + "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1]["Value"]);
        console.log("--------------------------------");

    });
}

// doWhatItSays function reads random.txt and executes a function
function doWhatItSays() {
    // readFile method reads random.txt and returns back the file's data
    fs.readFile("random.txt", "utf8", function(error, data) {
        // variables take in string from random.txt and create an array with the function and search property
        var dataArr = data.split(",");
        var value = dataArr[1];

        if (dataArr[0] === "my-tweets") {
            myTweets();
        } else if (dataArr[0] === "spotify-this-song") {
            spotifySearch(value);
        } else if (dataArr[0] === "movie-this") {
            movieSearch(value);
        } else { console.log("Please Provide a valid command!") }

    });
}






function runCommands() {

    if (command === "my-tweets") {
        Tweets();
    } else if (command === "spotify-this-song") {

        var songValue = process.argv.splice(3).join(" ");
        spotifySearch(songValue);

    } else if (command === "movie-this") {

        var movieValue = process.argv.splice(3).join(" ");
        movieSearch(movieValue);
    } else if (command === "do-what-it-says") {

        doWhatItSays();

    } else {
        console.log("Please Provide a valid command!");

    }
}

runCommands();
