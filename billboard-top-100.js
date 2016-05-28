var app = require("express")();
var http = require("http").Server(app);
var request = require("request");
var cheerio = require("cheerio");

var getTop100 = function(cb){

	var soArray = [];

	var songsArray = [];
	var artistsArray = [];

	request("http://www.billboard.com/charts/hot-100", function(error, response, html){

			var $ = cheerio.load(html);

			$('.chart-row__song').each(function(index){
				var songName = $(this).text().replace(/\r?\n|\r/g, "").replace(/\s+/g, ' ');
				while(songName[0] === ' ')
    				songName = songName.substr(1);
				songsArray.push(songName);
			});

			$('.chart-row__artist').each(function(index){
				var artistName = $(this).text().replace(/\r?\n|\r/g, "").replace(/\s+/g, ' ');
				while(artistName[0] === ' ')
    				artistName = artistName.substr(1);
    			if (artistName[artistName.length - 1] == ' '){
    				artistName = artistName.substring(0, artistName.length - 1);
    			}
				artistsArray.push(artistName);
			});

			for (var i = 0; i < songsArray.length; i++){

				soArray.push({
					"rank": i + 1,
					"title": songsArray[i],
					"artist": artistsArray[i]
				});

				if (i == songsArray.length - 1){
					cb (soArray);
				}

			}

	});

}

module.exports = getTop100;