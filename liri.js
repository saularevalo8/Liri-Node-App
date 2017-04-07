var twiKeys = require('./keys.js');
var Twitter = require('twitter');
var spotify = require('spotify');
var command = process.argv[2];

function Tweets() {
    var client = new Twitter({
        consumer_key: twiKeys.twitterKeys.consumer_key,
        consumer_secret: twiKeys.twitterKeys.consumer_secret,
        access_token_key: twiKeys.twitterKeys.access_token_key,
        access_token_secret: twiKeys.twitterKeys.access_token_secret
    });
    var params = { screen_name: 'Saul_Valo', count: 20 };

    client.get('statuses/user_timeline', params, function(error, tweet, response) {
        if (!error) {
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


function runCommands() {

    if (command === "my-tweets") {
        Tweets();
    } else if (command === "spotify-this-song") {

        var songValue = process.argv.splice(3).join(" ");
        spotifySearch(songValue);

    }else{console.log("Please Provide a valid command!")
                }
}

runCommands();
