var request = require("request");
var cheerio = require("cheerio");

const baseUrl = "http://www.billboard.com/charts/";

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// list all data from requested chart

var getChart = function(chart, date, cb){
	var result;
	if (typeof date === 'function'){
		cb = date;
		date = '';
	}

	var songs = [];

	var titles = [];
	var artists = [];
	var covers = [];
	var ranks = [];
	var positions = [];

	request(baseUrl + chart + "/" + date, function(error, response, html){

			var $ = cheerio.load(html);

  // Cover
			covers.push(undefined); // top song has no cover image
			$('.chart-list-item__image-wrapper').each(function(index, item){
				var imageSrcAttrib = $(this).children()[1].attribs['data-srcset'];
				if (imageSrcAttrib == undefined) {
					imageSrcAttrib = $(this).children()[2].attribs['data-srcset'];
				}
				var songCover = imageSrcAttrib.split(', ').slice(-1)[0].split(' ')[0];
				covers.push(songCover);
			});

// A and B are the same thing
      //A
			$('#main > div.chart-detail-header > div.container.container--no-background.chart-number-one > div.chart-video__wrapper').each(function(index, item){
				var item = $(this)[0].attribs;
				var full_title = item['data-title'];
				var [song_titles, artists_name] = full_title.split(/[_\-]/);
				titles.push(song_titles);
				artists.push(artists_name);
				ranks.push(item['data-rank']);
			});
      //B
			$('.chart-list-item__title').each(function(index, item){
				var item = $(this).parent().parent().parent().parent()[0].attribs;
				titles.push(item['data-title']);
				artists.push(item['data-artist']);
				ranks.push(item['data-rank']);
			});

  // position of song
      $('.chart-list-item__stats').each(function(index,item){
        var lastWeek = $(this).children('.chart-list-item__stats-cell').children('.chart-list-item__last-week').text();
        var peak = $(this).children('.chart-list-item__stats-cell').children('.chart-list-item__weeks-at-one').text();
        var wksOnChart = $(this).children('.chart-list-item__stats-cell').children('.chart-list-item__weeks-on-chart').text();
        positions.push({
          "PositionLastWeek": lastWeek,
          "PeakPosition": peak,
          "WksOnChart": wksOnChart
        });
      })

  // information for #1 ranked song
			songs.push({
				"rank": 1,
				"title": $('.chart-number-one__details').children('.chart-number-one__title').text().trim(),
				"artist": $('.chart-number-one__details').children('.chart-number-one__artist').text().trim(),
				"cover": "",
        "position" : {
          "PositionLastWeek": $('.chart-number-one__stats-cell--bordered').children('.chart-number-one__last-week').text().trim(),
          "PeakPosition": "1",
          "WksOnChart":$('.chart-number-one__stats-cell--bordered').children('.chart-number-one__weeks-on-chart').text().trim()
        }
			});

			if (titles.length > 1){
				for (var i = 0; i < titles.length; i++){
					var song = {
						"rank": ranks[i],
						"title": titles[i],
						"artist": artists[i],
						"cover": covers[i],
					};
					var positionInfo = positions[i];
					if (positionInfo) {
						song['position'] = positionInfo;
					}
					songs.push(song);

					if (i == titles.length - 1){
						cb (null, songs);
					}

				}
			}
			else {
				cb ("No chart found.", null);
			}

	});

}

  // list the available charts

  var listCharts = function(cb) {
  	request(baseUrl, function(error, response, html) {
  		var charts = [];
  		if (error) {
  			cb(error, null)
  			return;
  		}
  		var $ = cheerio.load(html);

  		$('.chart-panel__link').each(function(index, item) {
  			var chartObject = {};
  			chartObject.chart = toTitleCase($(this)[0].attribs.href.replace('/charts/', '').replace(/-/g, ' '));
  			chartObject.link = $(this)[0].attribs.href;
  			charts.push(chartObject);
  		});

  		if (typeof cb === 'function') {
  			cb(null, charts);
  		}
  	});
  }

  module.exports = {
  	getChart,
  	listCharts
  }
