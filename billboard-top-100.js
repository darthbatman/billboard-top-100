var request = require("request");
var cheerio = require("cheerio");

var getTop100 = function(date, cb){

	if (typeof date === 'function'){
		cb = date;
		date = '';
	}

	var songs = [];

	var titles = [];
	var artists = [];
  	var covers = [];
	var position = [];

	request("http://www.billboard.com/charts/hot-100/" + date, function(error, response, html){

			var $ = cheerio.load(html);

			$('.chart-row__song').each(function(index, item){
				var songName = $(this).text().replace(/\r?\n|\r/g, "").replace(/\s+/g, ' ');
				while(songName[0] === ' ')
    				songName = songName.substr(1);
				titles.push(songName);

				$(item).closest('article').find('.chart-row__secondary > div').each(function(_, item) {
					var positionInfo = {};
					$(item).children('div').each(function(_, item) {
						positionInfo[$('span:first-child', item).text()] = $('span:last-child', item).text()
					});
					position.push(positionInfo);
				});
			});

			$('.chart-row__artist').each(function(index){
				var artistName = $(this).text().replace(/\r?\n|\r/g, "").replace(/\s+/g, ' ');
				while(artistName[0] === ' ')
    				artistName = artistName.substr(1);
    			if (artistName[artistName.length - 1] == ' '){
    				artistName = artistName.substring(0, artistName.length - 1);
    			}
				artists.push(artistName);
			});
			
			$('.chart-row__image').each(function(index){
				var style = $(this).attr("style");
				if(style){
					var songCover= style.replace("background-image: url(http://","").replace(")","");
				}else{
					var data = $(this).attr("data-imagesrc");
					if(data){
						var songCover = data.replace("http://","");
					}	
				}
				covers.push(songCover);
			});

			for (var i = 0; i < titles.length; i++){

				songs.push({
					"rank": i + 1,
					"title": titles[i],
					"artist": artists[i],
					"cover": covers[i],
					"position": position[i]
				});

				if (i == titles.length - 1){
					cb (songs);
				}

			}

	});

}

module.exports = getTop100;