var request = require("request");
var cheerio = require("cheerio");

const baseUrl = "http://www.billboard.com/charts/";

var getChart = function(chart, date, cb){
	var result;
	if (typeof date === 'function'){
		cb = date;
		date = '';
	} else if (typeof date === 'string') {
		date = tunningDate(date);
		result = {'chartTime': date};
	}

	var songs = [];

	var titles = [];
	var artists = [];
	var covers = [];
	var ranks = [];
	var positions = [];

	request(baseUrl + chart + "/" + date, function(error, response, html){

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
					positions.push(positionInfo);
				});
			});

			$('.chart-row__current-week').each(function(index){
				ranks.push($(this).text().replace(/\r?\n|\r/g, "").replace(/\s+/g, ' '));
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

			if (titles.length > 1){
				for (var i = 0; i < titles.length; i++){
					var song = {
						"rank": ranks[i],
						"title": titles[i],
						"artist": artists[i],
						"cover": covers[i]
					};
					var positionInfo = positions[i];
					if (positionInfo) {
						song['position'] = positionInfo;
					}
					songs.push(song);

					if (i == titles.length - 1){
						cb (songs);
					}

				}
			}
			else {
				cb ([], "no chart found");
			}
			
	});

}

/**
 * list the available chart page
 */
var manifest = function(cb) {
	request(baseUrl, function(error, response, html) {
		if (error) {
			cb([], error)
			return;
		}
		var $ = cheerio.load(html);
		var links = new Set();
		var prefixOfLink = '/charts/';
		$('#main-wrapper a').each(function(_, item) {
			var address = $(item).attr('href') || '';
			var startIndex = -1;
			if ((startIndex = address.indexOf(prefixOfLink)) !== -1) {
				links.add(address.substring(startIndex + prefixOfLink.length))
			}
		});
		if (typeof cb === 'function') {
			cb([...links]);
		}
	});
}

/**
 * allow any date
 * if the date which given by user is not saturday,
 * it will be automatically adjusted to the saturday of the last week 
 */
function tunningDate(date) {
	if (/\d{4}-\d{2}-\d{2}/.test(date)) {
		var day = new Date(date);
		var dayOfWeek = day.getDay();
		var endOfWeek = dayOfWeek === 6;
		var timestampOfDay = day.getTime();
		if (!endOfWeek) {
			var saturday = new Date(timestampOfDay - (dayOfWeek + 1) * 24 * 60 * 60 * 1000);
			return saturday.toISOString().substring(0, 10);
		}
	}
	return date;
}

module.exports = {
	getChart,
	manifest
}